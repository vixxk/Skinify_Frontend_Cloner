import express, { Request, Response } from "express";
import path from "node:path";
import fs from "node:fs";
import archiver from "archiver";
import { resolveWebsiteURL, scrapeWebsiteByScraper, scrapeWebsiteByPuppeteer } from "./scraper-cli.js";
import chatbotRouter from "./chatbot/chatbot.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use("/api/chat", chatbotRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/resolve/1", async (req: Request, res: Response): Promise<void> => {
  const { keyword, isRecursive } = req.body as { keyword?: string; isRecursive?: boolean };
  if (!keyword) {
    res.status(400).json({ error: "Keyword missing" });
    return;
  }

  try {
    const url = await resolveWebsiteURL(keyword);
    if (!url) {
      res.json({ url: null, folder: null });
      return;
    }

    const folder = await scrapeWebsiteByScraper(url, isRecursive);
    res.json({ url, folder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape website" });
  }
});

app.post("/api/resolve/2", async (req: Request, res: Response): Promise<void> => {
  const { keyword } = req.body as { keyword?: string };
  if (!keyword) {
    res.status(400).json({ error: "Keyword missing" });
    return;
  }

  try {
    const url = await resolveWebsiteURL(keyword);
    if (!url) {
      res.json({ url: null, folder: null });
      return;
    }

    const folder = await scrapeWebsiteByPuppeteer(url);
    res.json({ url, folder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape website with puppeteer" });
  }
});

app.get("/download/:folderName", async (req: Request, res: Response): Promise<void> => {
  const folderName = req.params.folderName;
  if (typeof folderName !== "string" || !folderName) {
    res.status(400).send("Folder name missing or invalid");
    return;
  }

  const folderPath = path.join(process.cwd(), "downloads", folderName);

  if (!fs.existsSync(folderPath)) {
    res.status(404).send("Folder not found");
    return;
  }

  // Clean filename for proper UX
  const cleanName = folderName.replace(/\(\d+\)$/, "");
  // Reconstruct domain format (replace dashes with dots)
  const domainName = cleanName.replace(/-/g, ".");
  const downloadFileName = `skinify-${domainName}.zip`;

  // This tells the browser that this file is meant to be downloaded, not displayed
  res.setHeader("Content-Disposition", `attachment; filename="${downloadFileName}"`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);
  archive.directory(folderPath, false);

  const openShPath = path.join(process.cwd(), "open.sh");
  if (fs.existsSync(openShPath)) {
    archive.file(openShPath, { name: "open.sh" });
  }

  const openBatPath = path.join(process.cwd(), "open.bat");
  if (fs.existsSync(openBatPath)) {
    archive.file(openBatPath, { name: "open.bat" });
  }

  res.on("finish", () => {
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`Error deleting folder ${folderPath} after download:`, err);
      } else {
        console.log(`Deleted folder ${folderPath} after download`);
      }
    });
  });

  await archive.finalize();
});

// Run cleanup task every 10 minutes to evict folders older than 30 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000;
const MAX_AGE = 30 * 60 * 1000;

setInterval(() => {
  const downloadsPath = path.join(process.cwd(), "downloads");
  if (!fs.existsSync(downloadsPath)) return;

  fs.readdir(downloadsPath, (err, files) => {
    if (err) {
      console.error("Error reading downloads directory for cleanup:", err);
      return;
    }

    const now = Date.now();
    files.forEach((file) => {
      const filePath = path.join(downloadsPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error checking stats for ${filePath}:`, err);
          return;
        }

        if (now - stats.mtimeMs > MAX_AGE) {
          fs.rm(filePath, { recursive: true, force: true }, (err) => {
            if (err) {
              console.error(`Failed to evict expired folder/file ${filePath}:`, err);
            } else {
              console.log(`Evicted expired folder/file: ${filePath}`);
            }
          });
        }
      });
    });
  });
}, CLEANUP_INTERVAL);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
