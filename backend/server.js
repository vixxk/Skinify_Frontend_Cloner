import express from "express";
import path from "path";
import fs from "fs";
import archiver from "archiver";
import cors from "cors";
import bodyParser from "body-parser";
import { resolveWebsiteURL, scrapeWebsiteByScraper,scrapeWebsiteByPuppeteer} from "./scraper-cli.js";
import chatbotRouter from "./chatbot/chatbot.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(bodyParser.json());

app.use("/api/chat", chatbotRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});


app.post("/api/resolve/1", async (req, res) => {
  const { keyword,isRecursive } = req.body;
  if (!keyword) return res.status(400).json({ error: "Keyword missing" });

  try {
    const url = await resolveWebsiteURL(keyword);
    if (!url) return res.json({ url: null, folder: null });

    const folder = await scrapeWebsiteByScraper(url,isRecursive);
    res.json({ url, folder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape website" });
  }
});

app.post("/api/resolve/2", async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: "Keyword missing" });

  try {
    const url = await resolveWebsiteURL(keyword);
    if (!url) return res.json({ url: null, folder: null });

    const folder = await scrapeWebsiteByPuppeteer(url);
    res.json({ url, folder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape website with puppeteer" });
  }
});


app.get("/download/:folderName", async (req, res) => {
  const folderPath = path.join(process.cwd(), "downloads", req.params.folderName);

  if (!fs.existsSync(folderPath)) return res.status(404).send("Folder not found");
  
  // Clean filename for proper UX
  let cleanName = req.params.folderName.replace(/\(\d+\)$/, "");
  // Reconstruct domain format (replace dashes with dots)
  let domainName = cleanName.replace(/-/g, ".");
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

// trial