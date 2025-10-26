import { Cpu } from "lucide-react";
import "./ModelSwitch.css";

export default function ModelSwitch({ model, setModel }) {
  return (
    <div className="fixed-top-bar left">
      <div className="model-switch-wrapper">
        <Cpu size={20} className="model-icon" />
        <span className="switch-label-text">Scraping Engine:</span>
        <div className="model-selector">
          <button
            className={`model-option ${model === "website-scraper" ? "active" : ""}`}
            onClick={() => setModel("website-scraper")}
          >
            Website Scraper
          </button>
          <button
            className={`model-option ${model === "puppeteer-cheerio" ? "active" : ""}`}
            onClick={() => setModel("puppeteer-cheerio")}
          >
            Puppeteer + Cheerio
          </button>
        </div>
      </div>
    </div>
  );
}
