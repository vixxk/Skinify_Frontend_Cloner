import { Cpu } from "lucide-react";
import "./ModelSwitch.css";

export default function ModelSwitch({ model, setModel }) {
  return (
    <div className="fixed-top-bar left">
      <div className="model-switch-wrapper">
        <Cpu size={18} className="model-icon" />
        <span className="switch-text">Model:</span>
        <input
          type="checkbox"
          id="modelToggle"
          className="switch-checkbox"
          checked={model === "2"}
          onChange={(e) => setModel(e.target.checked ? "2" : "1")}
        />
        <label htmlFor="modelToggle" className="switch-label">
          <span className="switch-slider"></span>
        </label>
        <span className="model-status">{model === "1" ? "1" : "2"}</span>
      </div>
    </div>
  );
}
