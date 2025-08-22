import express from "express";
import path from "path";
import fs from "fs";
import archiver from "archiver";
import cors from "cors";
import bodyParser from "body-parser";
import { resolveWebsiteURL, scrapeWebsiteByScraper,scrapeWebsiteByPuppeteer} from "./scraper-cli.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyParser.json());

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
  
  // This tells the browser that this file is meant to be downloaded, not displayed
  res.setHeader("Content-Disposition", `attachment; filename=${req.params.folderName}.zip`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);
  archive.directory(folderPath, false);
  await archive.finalize();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
