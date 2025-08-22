import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import { URL } from "url";
import * as cheerio from "cheerio";

export class ContentExtractor {
  static async extractFrontendContent(url, outputDir) {
    let browser = null;
    try {
      await fs.ensureDir(outputDir);

      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      const assetResponses = new Map();
      page.on("response", async (res) => {
        const reqUrl = res.url();
        if (res.status() >= 200 && res.status() < 400) {
          try {
            const buffer = await res.buffer();
            if (buffer.length > 0) assetResponses.set(reqUrl, { buffer });
          } catch {
            /* ignore */
          }
        }
      });

      await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });
      await this.autoScroll(page);

      // 🔥 Force-load lazy images (data-src, data-lazy, etc.)
      await page.evaluate(() => {
        document.querySelectorAll("img").forEach((img) => {
          const dataSrc =
            img.getAttribute("data-src") ||
            img.getAttribute("data-original") ||
            img.getAttribute("data-lazy");
          if (dataSrc && !img.getAttribute("src")) {
            img.setAttribute("src", dataSrc);
          }
        });
      });

      // ⏳ Wait a bit for new requests to complete
      await new Promise(resolve => setTimeout(resolve, 3000));

      const html = await page.content();
      const baseUrl = new URL(url);

      // Save captured assets
      for (const [assetUrl, { buffer }] of assetResponses.entries()) {
        try {
          const urlObj = new URL(assetUrl);
          if (urlObj.hostname !== baseUrl.hostname) continue;
          if (urlObj.pathname === "/") continue;

          const assetPath = urlObj.pathname.startsWith("/")
            ? urlObj.pathname.substring(1)
            : urlObj.pathname;
          const localPath = path.join(outputDir, assetPath);

          await fs.ensureDir(path.dirname(localPath));
          await fs.writeFile(localPath, buffer);
        } catch {
          /* ignore single asset failures */
        }
      }

      // Rewrite HTML
      const $ = cheerio.load(html);
      const selectors = [
        { selector: "link[href]", attr: "href" },
        { selector: "script[src]", attr: "src" },
        { selector: "img[src]", attr: "src" },
        { selector: "img[srcset]", attr: "srcset" },
        { selector: "source[src]", attr: "src" },
        { selector: "source[srcset]", attr: "srcset" },
        { selector: "video[src]", attr: "src" },
        { selector: "video[poster]", attr: "poster" },
      ];

      selectors.forEach(({ selector, attr }) => {
        $(selector).each((_, element) => {
          const el = $(element);
          const originalValue = el.attr(attr);
          if (!originalValue) return;

          if (attr === "srcset") {
            const newSrcset = originalValue
              .split(",")
              .map((part) => {
                const [url, descriptor] = part.trim().split(/\s+/);
                const newUrl = this.getRelativePath(url, baseUrl);
                return `${newUrl} ${descriptor || ""}`.trim();
              })
              .join(", ");
            el.attr(attr, newSrcset);
          } else {
            el.attr(attr, this.getRelativePath(originalValue, baseUrl));
          }
        });
      });

      $('script[id="__NEXT_DATA__"]').remove();

      await fs.writeFile(path.join(outputDir, "index.html"), $.html(), "utf-8");
    } finally {
      if (browser) await browser.close();
    }
  }

  static getRelativePath(assetUrl, baseUrl) {
    try {
      const fullAssetUrl = new URL(assetUrl, baseUrl.href);
      if (fullAssetUrl.hostname !== baseUrl.hostname) return assetUrl;
      return fullAssetUrl.pathname.startsWith("/")
        ? fullAssetUrl.pathname.substring(1)
        : fullAssetUrl.pathname;
    } catch {
      return assetUrl;
    }
  }

  static async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            setTimeout(resolve, 1000);
          }
        }, 100);
      });
    });
  }
}
