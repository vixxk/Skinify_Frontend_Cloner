import { useState } from "react";
import { 
  Download, Globe, Search, Loader2, AlertCircle, CheckCircle, Copy, 
  Sparkles, Code2, Zap, Cpu, Settings
} from "lucide-react";
import "./App.css";

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [resolvedURL, setResolvedURL] = useState("");
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deepMode, setDeepMode] = useState(false);
  const [model, setModel] = useState("1");

  // const BACKEND_URL = "http://localhost:3001";
    const BACKEND_URL = "https://skinify-backend-ui4w.onrender.com";

  const defaultWebsites = [
    "hiteshchoudhary.com",
    "piyushgarg.dev", 
    "code.visualstudio.com",
    "tailwindcss.com",
    "nextjs.org",
    "en.wikipedia.org",
    "getbootstrap.com",
    "w3schools.com",
    "geeksforgeeks"
  ];

  const handleScrape = async () => {
    if (!keyword.trim()) return setError("Please enter a keyword or URL!");
    setLoading(true);
    setError(""); setSuccess(""); setResolvedURL(""); setFolderName("");

    try {
      const timeoutDuration = deepMode ? 300000 : 100000; 
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

      const apiUrl = `${BACKEND_URL}/api/resolve/${model}`;
      const requestBody = model === "1" 
        ? { keyword: keyword.trim(), isRecursive: deepMode }
        : { keyword: keyword.trim() };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      
      if (!data.url) {
        setError("Could not resolve URL. Try another keyword or URL.");
      } else {
        setResolvedURL(data.url);
        setFolderName(data.folder);
        const modelName = model === "1" ? "website-scraper" : "Puppeteer + Cheerio";
        const modeText = model === "1" && deepMode ? " (Deep mode)" : " (Landing page only)";
        setSuccess(`Website scraped successfully using ${modelName}${modeText}`);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError(`Request timed out. ${deepMode ? "Deep mode takes longer - try again or disable deep mode." : "Try again or check your connection."}`);
      } else if (err.message.includes("HTTP error")) {
        setError("Server error occurred during scraping. Please try again.");
      } else {
        setError("Cannot connect to server. Please check if the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleScrape();
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      const notification = document.createElement("div");
      notification.textContent = `Copied: ${text}`;
      notification.className = "copy-notification";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="app">
      <div className="fixed-top-bar left">
        <div className="model-selector">
          <Cpu size={18} className="cpu-icon" />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="model-dropdown"
          >
            <option value="1">Model 1: Website Scraper</option>
            <option value="2">Model 2: Puppeteer + Cheerio</option>
          </select>
        </div>
      </div>

      {model === "1" && (
        <div className="fixed-top-bar right">
          <div className="toggle-wrapper">
            <Settings size={18} />
            <span className="toggle-text">Deep Mode:</span>
            <input
              type="checkbox"
              id="deepModeToggle"
              className="toggle-checkbox"
              checked={deepMode}
              onChange={(e) => setDeepMode(e.target.checked)}
            />
            <label htmlFor="deepModeToggle" className="toggle-label">
              <span className="toggle-slider"></span>
            </label>
            <span className={`mode-status ${deepMode ? "active" : ""}`}>
              {deepMode ? "ON" : "OFF"}
            </span>
          </div>
        </div>
      )}

      <div className="bg-element bg-element-1"></div>
      <div className="bg-element bg-element-2"></div>
      <div className="bg-element bg-element-3"></div>

      <div className="container">
        <header className="header skinify-header">
          <div className="logo-section">
            <div className="logo-icon">
              <Code2 size={28} color="#fff" />
            </div>
            <h1 className="title">Skinify</h1>
          </div>
          <p className="subtitle">Clone any frontend in seconds ✨</p>
        </header>

        <section className="how-it-works">
          <div className="how-it-works-header">
            <Sparkles size={20} />
            <span>How it works</span>
          </div>
          <div className="steps-grid">
            {[
              { num: 1, title: "Enter keyword", desc: "Type website name or URL" },
              { num: 2, title: "Auto-resolve", desc: "We find the correct URL" },
              { num: 3, title: "Download & Extract", desc: "Get ZIP and extract files" },
              { num: 4, title: "Open index.html", desc: "Find & open in browser" }
            ].map((step) => (
              <div key={step.num} className="step">
                <div className="step-number">{step.num}</div>
                <div>
                  <div className="step-title">{step.title}</div>
                  <div className="step-description">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {model === "1" && (
          <div className="note">
            <p>
              <strong>Note:</strong> Website Scraper works best with light JS websites.
              {deepMode && " Deep mode will scrape all subpages and linked content."} 
              {" "}May not work well with complex sites like Netflix, Facebook or GitHub.
            </p>
          </div>
        )}
        {model === "2" && (
          <div className="note note-green">
            <p>
              <strong>Note:</strong> Puppeteer + Cheerio extracts more accurately but some images may not appear.
            </p>
          </div>
        )}

        <section className="input-section">
          <div className="input-group">
            <div className="input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Enter keyword or URL (e.g., google.com)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="keyword-input"
              />
            </div>
            <button
              onClick={handleScrape}
              className={`scrape-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spin" />
                  {model === "1" && deepMode ? "Deep Scraping..." : "Scraping..."}
                </>
              ) : (
                <>
                  <Zap size={20} /> Scrape Website
                </>
              )}
            </button>
          </div>

          {model === "1" && (
            <div className="deep-mode-section">
              <p className="deep-mode-description">
                {deepMode ? (
                  <>
                    <span className="mode-status active">Deep Mode Enabled:</span> Scrapes all subpages and linked content (slower but more comprehensive).
                  </>
                ) : (
                  <>
                    <span className="mode-status">Deep Mode Disabled:</span> Scrapes only the main landing page (faster but basic).
                  </>
                )}
              </p>
            </div>
          )}

          {loading && (
            <div className="loading-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p className="loading-text">
                {model === "1" && deepMode ? (
                  <>Deep scraping in progress... may take 2-5 min<br /><small>Downloading all pages, images, CSS, JS...</small></>
                ) : (
                  <>Scraping {model === "1" ? "landing page" : "with Puppeteer"}... usually 10-30s<br /><small>{model === "1" ? "Downloading main page only." : "Advanced parsing."}</small></>
                )}
              </p>
            </div>
          )}

          {error && <div className="message error-message"><AlertCircle size={16}/> {error}</div>}
          {success && <div className="message success-message"><CheckCircle size={16}/> {success}</div>}

          {resolvedURL && folderName && (
            <div className="result-section">
              <div className="resolved-url">
                <Globe size={16} color="#8b5cf6" />
                <span className="url-label">Resolved URL:</span>
                <a href={resolvedURL} className="url-link" target="_blank" rel="noopener noreferrer">{resolvedURL}</a>
              </div>
              <button className="download-btn" onClick={() => window.open(`${BACKEND_URL}/download/${folderName}`, "_blank")}>
                <Download size={16}/> Download ZIP
              </button>
            </div>
          )}
        </section>

        <section className="examples-section">
          <h3 className="examples-title">Try these popular websites</h3>
          <div className="examples-grid">
            {defaultWebsites.map((site) => (
              <div key={site} className="example-card" onClick={() => setKeyword(site)}>
                <span className="site-name">{site}</span>
                <button className="copy-btn" onClick={(e) => { e.stopPropagation(); copyToClipboard(site); }}>
                  <Copy size={14}/>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
