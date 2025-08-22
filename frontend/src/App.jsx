import { useState } from "react";
import { Download, Globe, Search, Loader2, AlertCircle, CheckCircle, Copy, Sparkles, Code2, Zap } from "lucide-react";
import './App.css';

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [resolvedURL, setResolvedURL] = useState("");
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deepMode, setDeepMode] = useState(false);

  const BACKEND_URL = "https://skinify-backend-ui4w.onrender.com";
  // const BACKEND_URL = "http://localhost:3001";

  const defaultWebsites = [
    "hitesh.ai",
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
    setError("");
    setSuccess("");
    setResolvedURL("");
    setFolderName("");

    try {
      // Set a longer timeout for deep mode
      const timeoutDuration = deepMode ? 300000 : 60000; // 5 minutes for deep mode, 1 minute for normal
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

      const res = await fetch(`${BACKEND_URL}/api/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim(), isRecursive: deepMode }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (!data.url) {
        setError("Could not resolve URL. Try another keyword or URL.");
      } else {
        setResolvedURL(data.url);
        setFolderName(data.folder);
        setSuccess(`Website scraped successfully! ${deepMode ? '(Deep mode: All pages scraped)' : '(Landing page only)'}`);
      }
    } catch (err) {
      console.error('Scraping error:', err);
      
      if (err.name === 'AbortError') {
        setError(`Request timed out. ${deepMode ? 'Deep mode takes longer - try again or disable deep mode.' : 'Try again or check your connection.'}`);
      } else if (err.message.includes('HTTP error')) {
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
      // Create a temporary notification
      const notification = document.createElement('div');
      notification.textContent = `Copied: ${text}`;
      notification.className = 'copy-notification';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="app">
      {/* Animated background elements */}
      <div className="bg-element bg-element-1" />
      <div className="bg-element bg-element-2" />
      <div className="bg-element bg-element-3" />

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logo-section">
            <div className="logo-icon">
              <Code2 size={32} color="#ffffff" />
            </div>
            <h1 className="title">Skinify</h1>
          </div>
          
          <p className="subtitle">
            Clone any frontend in seconds ✨
          </p>
          
          <div className="how-it-works">
            <div className="how-it-works-header">
              <Sparkles size={20} />
              <span>How it works</span>
            </div>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <div className="step-title">Enter keyword</div>
                  <div className="step-description">Type website name or URL</div>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-title">Auto-resolve</div>
                  <div className="step-description">We find the correct URL</div>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <div className="step-title">Download & Extract</div>
                  <div className="step-description">Get ZIP and extract files</div>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <div className="step-title">Open index.html</div>
                  <div className="step-description">Find & open in browser</div>
                </div>
              </div>
            </div>
          </div>

          <div className="note">
            <p>
              <strong>Note:</strong> Works best with light JS websites. May not work well with complex sites like Netflix, Facebook or GitHub.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-group">
            <div className="input-wrapper">
              <Search 
                size={20} 
                className="search-icon"
              />
              <input
                type="text"
                placeholder="Enter keyword or URL (e.g., hitesh.ai)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="keyword-input"
              />
            </div>
            <button
              onClick={handleScrape}
              disabled={loading}
              className={`scrape-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spin" />
                  {deepMode ? 'Deep Scraping...' : 'Scraping...'}
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Scrape Website
                </>
              )}
            </button>
          </div>

          {/* Deep Mode Toggle */}
          <div className="deep-mode-section">
            <div className="toggle-wrapper">
              <input
                type="checkbox"
                id="deepModeToggle"
                checked={deepMode}
                onChange={(e) => setDeepMode(e.target.checked)}
                className="toggle-checkbox"
              />
              <label htmlFor="deepModeToggle" className="toggle-label">
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-text">Deep Mode</span>
            </div>
            <p className="deep-mode-description">
              {deepMode ? (
                <>
                  <span className="mode-status active">Enabled:</span>
                  Scrapes all subpages and linked content (slower but more comprehensive)
                </>
              ) : (
                <>
                  <span className="mode-status">Disabled:</span>
                  Scrapes only the main landing page (faster but basic)
                </>
              )}
            </p>
          </div>

          {/* Loading Progress */}
          {loading && (
            <div className="loading-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p className="loading-text">
                {deepMode ? (
                  <>
                    Deep scraping in progress... This may take 2-5 minutes depending on website size.
                    <br />
                    <small>Downloading all pages, images, CSS, and JavaScript files.</small>
                  </>
                ) : (
                  <>
                    Scraping landing page... This usually takes 10-30 seconds.
                    <br />
                    <small>Downloading main page content only.</small>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="message error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="message success-message">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* Result */}
          {resolvedURL && folderName && (
            <div className="result-section">
              <div className="resolved-url">
                <Globe size={16} color="#8b5cf6" />
                <span className="url-label">Resolved URL:</span>
                <a 
                  href={resolvedURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="url-link"
                >
                  {resolvedURL}
                </a>
              </div>
              <button
                onClick={() => window.open(`${BACKEND_URL}/download/${folderName}`, "_blank")}
                className="download-btn"
              >
                <Download size={16} />
                Download ZIP
              </button>
            </div>
          )}
        </div>

        {/* Website Examples */}
        <div className="examples-section">
          <h3 className="examples-title">
            Try these popular websites
          </h3>
          <div className="examples-grid">
            {defaultWebsites.map((site, index) => (
              <div
                key={site}
                className="example-card"
                onClick={() => setKeyword(site)}
              >
                <span className="site-name">
                  {site}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(site);
                  }}
                  className="copy-btn"
                >
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}