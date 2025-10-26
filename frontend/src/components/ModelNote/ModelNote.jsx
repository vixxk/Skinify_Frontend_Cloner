import { Info } from "lucide-react";
import "./ModelNote.css";

export default function ModelNote() {
  return (
    <div className="model-note-pro">
      <div className="model-note-icon">
        <Info size={22} strokeWidth={2.2} />
      </div>
      <div className="model-note-content">
        <p>
          If scraping fails, try switching between
          <span className="model-highlight">Website Scraper</span>
          and
          <span className="model-highlight">Puppeteer + Cheerio</span>
          for better compatibility. Each engine uses a different technology! 
          Sites developed in NextJS may throw Client Side Error.

        </p>
      </div>
    </div>
  );
}
