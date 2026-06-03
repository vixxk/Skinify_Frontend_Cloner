import "./DeepModeToggle.css";

export default function DeepModeToggle({ deepMode, setDeepMode, disabled }) {
  return (
    <div className="deep-mode-sidebar-container">
      <div className="deep-mode-header">
        <span className="section-label">DEEP MODE</span>
        <div className="tooltip-trigger" tabIndex={0}>
          ⓘ
          <span className="tooltip-content">
            Enables recursive scanning of all internal links and directories. Takes longer to execute.
          </span>
        </div>
      </div>
      <div className="industrial-toggle-wrapper">
        <button
          type="button"
          className={`industrial-toggle-track ${deepMode ? "active" : ""}`}
          onClick={() => !disabled && setDeepMode(!deepMode)}
          disabled={disabled}
          aria-label="Toggle Deep Mode"
        >
          <span className="industrial-toggle-thumb" />
        </button>
        <span className={`industrial-toggle-status ${deepMode ? "active" : ""}`}>
          {deepMode ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
}
