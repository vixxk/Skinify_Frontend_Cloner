import { Search, Loader2, Zap } from "lucide-react";
import "./SearchInput.css";

export default function SearchInput({
  keyword,
  setKeyword,
  loading,
  handleScrape,
  handleKeyPress,
  model,
  deepMode
}) {
  return (
    <>
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
        <button onClick={handleScrape} className={`scrape-btn ${loading ? "loading" : ""}`} disabled={loading}>
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
                <span className="mode-status active">Deep Mode Enabled:</span> Scrapes all subpages
                and linked content (slower but more comprehensive).
              </>
            ) : (
              <>
                <span className="mode-status">Deep Mode Disabled:</span> Scrapes only the main
                landing page (faster but basic).
              </>
            )}
          </p>
        </div>
      )}
    </>
  );
}
