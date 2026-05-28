import { ShieldAlert } from "lucide-react";
import "./ModelNote.css";

export default function ModelNote() {
  return (
    <div className="model-note-pro">
      <div className="model-note-icon">
        <ShieldAlert size={18} />
      </div>
      <div className="model-note-content">
        <p>
          COMPATIBILITY ALERT: Toggle between
          <span className="model-highlight">Website Scraper</span>
          and
          <span className="model-highlight">Puppeteer + Cheerio</span>
          engines to handle target-specific structures. Single-Page Apps (SPA) may trigger hydration warning errors.
        </p>
      </div>
    </div>
  );
}
