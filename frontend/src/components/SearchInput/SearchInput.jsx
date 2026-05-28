import "./SearchInput.css";

export default function SearchInput({
  keyword,
  setKeyword,
  loading,
  handleScrape,
  handleKeyPress
}) {
  return (
    <div className="terminal-input-group">
      <div className="terminal-input-wrapper">
        <span className="terminal-cursor">&gt;_</span>
        <input
          type="text"
          placeholder="ENTER TARGET DOMAIN OR URL (e.g., hitesh.ai)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          className="terminal-input"
        />
        {/* Trace lines for circuit-completion animation */}
        <span className="trace-line trace-top" />
        <span className="trace-line trace-right" />
        <span className="trace-line trace-bottom" />
        <span className="trace-line trace-left" />
      </div>
      <button
        onClick={handleScrape}
        className="terminal-execute-btn"
        disabled={loading}
        type="button"
      >
        {loading ? "EXECUTING..." : "EXECUTE →"}
      </button>
    </div>
  );
}
