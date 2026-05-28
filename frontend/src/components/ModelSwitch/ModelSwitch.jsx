import { useState, useEffect } from "react";
import "./ModelSwitch.css";

function useScrambler(targetText, trigger) {
  const [text, setText] = useState(targetText);

  useEffect(() => {
    let iterations = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&*/=-+[]";
    const interval = setInterval(() => {
      setText(() =>
        targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) return targetText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= targetText.length) {
        clearInterval(interval);
      }
      iterations += 0.8;
    }, 20);

    return () => clearInterval(interval);
  }, [targetText, trigger]);

  return text;
}

export default function ModelSwitch({ model, setModel }) {
  const scraperText = useScrambler("WEBSITE SCRAPER", model);
  const puppeteerText = useScrambler("PUPPETEER + CHEERIO", model);

  return (
    <div className="engine-select-container">
      <span className="section-label">// ENGINE</span>
      <div className="hardware-switch-group">
        <button
          className={`hardware-switch ${model === "website-scraper" ? "active" : ""}`}
          onClick={() => setModel("website-scraper")}
          type="button"
        >
          <div className="switch-led" />
          <span className="switch-text">
            {model === "website-scraper" ? scraperText : "WEBSITE SCRAPER"}
          </span>
        </button>
        <button
          className={`hardware-switch ${model === "puppeteer-cheerio" ? "active" : ""}`}
          onClick={() => setModel("puppeteer-cheerio")}
          type="button"
        >
          <div className="switch-led" />
          <span className="switch-text">
            {model === "puppeteer-cheerio" ? puppeteerText : "PUPPETEER + CHEERIO"}
          </span>
        </button>
      </div>
    </div>
  );
}
