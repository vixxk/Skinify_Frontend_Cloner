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
        executablePath: puppeteer.executablePath(),
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      const assetResponses = new Map();
      page.on("response", async (res) => {
        try {
          const reqUrl = res.url();
          if (res.status() >= 200 && res.status() < 400) {
            const buffer = await res.buffer();
            if (buffer.length > 0) assetResponses.set(reqUrl, { buffer });
          }
        } catch {}
      });

      await page.goto(url, { waitUntil: ["load"], timeout: 45000 });
      await new Promise(resolve => setTimeout(resolve, 3000));

      let html = await page.content();

      if (!page.isClosed()) {
        try {
          await this.autoScroll(page);
          await this.loadLazyImages(page);
          html = await page.content();
        } catch {}
      }

      const baseUrl = new URL(url);

      for (const [assetUrl, { buffer }] of assetResponses.entries()) {
        try {
          const urlObj = new URL(assetUrl);
          if (urlObj.hostname !== baseUrl.hostname || urlObj.pathname === "/") continue;
          const assetPath = urlObj.pathname.startsWith("/")
            ? urlObj.pathname.substring(1)
            : urlObj.pathname;
          const localPath = path.join(outputDir, assetPath);
          await fs.ensureDir(path.dirname(localPath));
          await fs.writeFile(localPath, buffer);
        } catch {}
      }

      const $ = cheerio.load(html);
      const styleDir = path.join(outputDir, "styles");
      await fs.ensureDir(styleDir);
      const styleNodes = [];
      $("style").each((i, elem) => styleNodes.push({ index: i, element: elem }));
      styleNodes.forEach(({ index, element }) => {
        const cssContent = $(element).html();
        const styleFile = `inline-style-${index}.css`;
        const styleRelPath = path.posix.join("styles", styleFile);
        const styleOutPath = path.join(styleDir, styleFile);
        fs.writeFileSync(styleOutPath, cssContent, "utf-8");
        $(element).replaceWith(`<link rel="stylesheet" href="${styleRelPath}">`);
      });

      const selectors = [
        { selector: "link[href]", attr: "href" },
        { selector: "script[src]", attr: "src" },
        { selector: "img[src]", attr: "src" },
        { selector: "img[srcset]", attr: "srcset" },
        { selector: "video[src]", attr: "src" },
        { selector: "audio[src]", attr: "src" },
        { selector: "source[src]", attr: "src" },
        { selector: "iframe[src]", attr: "src" },
        { selector: "embed[src]", attr: "src" },
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
                return `${this.getRelativePath(url, baseUrl)} ${descriptor || ""}`.trim();
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
      try { if (browser) await browser.close(); } catch {}
    }
  }

  static async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
            clearInterval(timer);
            setTimeout(resolve, 1000);
          }
        }, 200);
      });
    });
  }

  static async loadLazyImages(page) {
    await page.evaluate(() => {
      document.querySelectorAll("img").forEach((img) => {
        const dataSrc = img.getAttribute("data-src") ||
                       img.getAttribute("data-original") ||
                       img.getAttribute("data-lazy");
        if (dataSrc && !img.getAttribute("src")) {
          img.setAttribute("src", dataSrc);
        }
      });
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
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
}
