import { Settings } from "lucide-react";
import "./DeepModeToggle.css";

export default function DeepModeToggle({ deepMode, setDeepMode }) {
  return (
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
  );
}
