import { useState } from "react";
import { Download, Globe, Search, Loader2, AlertCircle, CheckCircle, Copy } from "lucide-react";
import "./index.css";

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [resolvedURL, setResolvedURL] = useState("");
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BACKEND_URL = "http://localhost:3001";

  const defaultWebsites = [
    "hitesh.ai",
    "piyushgarg.dev",
    "code.visualstudio.com"
  ];

  const handleScrape = async () => {
    if (!keyword.trim()) return setError("Please enter a keyword or URL!");

    setLoading(true);
    setError("");
    setSuccess("");
    setResolvedURL("");
    setFolderName("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      const data = await res.json();
      if (!data.url) {
        setError("Could not resolve URL. Try another keyword or URL.");
      } else {
        setResolvedURL(data.url);
        setFolderName(data.folder);
        setSuccess("Website scraped successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error or cannot connect to backend.");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleScrape();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="container">
      <h1 className="title">Skinify - Frontend Cloner</h1>
      <p className="special-note">
        Note: This tool uses <b>website-scraper</b> and works best for light JS websites only.
        Won't work well for sites like netflix.com or github.com.
      </p>

      <div className="steps">
        <p>How it works:</p>
        <ol>
          <li>Enter a keyword or URL (e.g., clone hitesh.ai)</li>
          <li>Website URL is resolved automatically</li>
          <li>Scraper downloads the website to a ZIP</li>
          <li>Open <b>index.html</b> to view the cloned frontend</li>
        </ol>
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Keyword or URL..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button onClick={handleScrape} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="spinner" size={16} /> Scraping...
            </>
          ) : (
            <>
              <Search size={16} /> Scrape Website
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="message error-message">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div className="message success-message">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      {resolvedURL && folderName && (
        <div className="result-container">
          <div className="url-info">
            <Globe size={16} />
            <span>Resolved URL:</span>
            <a href={resolvedURL} target="_blank" rel="noopener noreferrer" className="url-link">
              {resolvedURL}
            </a>
          </div>
          <button
            onClick={() => window.open(`${BACKEND_URL}/download/${folderName}`, "_blank")}
            className="download-button"
          >
            <Download size={16} /> Download ZIP
          </button>
        </div>
      )}

      {/* Only 2-3 floating boxes at a time */}
      {defaultWebsites.map((site, index) => (
        <div
          key={site}
          className="floating-box"
          style={{
            top: `${20 + index * 25}%`,
            animationDuration: `${6 + index * 2}s`,
            animationDirection: index % 2 === 0 ? "normal" : "reverse",
          }}
        >
          <span>{site}</span>
          <button className="copy-button" onClick={() => copyToClipboard(site)}>
            <Copy size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
