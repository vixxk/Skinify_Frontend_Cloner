import { Globe, Download, Terminal, HardDrive } from "lucide-react";
import "./ResultSection.css";

export default function ResultSection({ resolvedURL, folderName, BACKEND_URL }) {
  return (
    <div className="result-section">
      <span className="section-label">// SCRAPING OUTPUT READY</span>
      
      <div className="resolved-url">
        <Globe size={16} className="url-icon" />
        <span className="url-label">RESOLVED HOST:</span>
        <a href={resolvedURL} className="url-link" target="_blank" rel="noopener noreferrer">
          {resolvedURL}
        </a>
      </div>

      <button
        className="download-btn"
        onClick={() => window.open(`${BACKEND_URL}/download/${folderName}`, "_blank")}
        type="button"
      >
        <Download size={16} /> DOWNLOAD COMPILATION (.ZIP)
      </button>

      <div className="instructions-section">
        <h4 className="instructions-title">
          <Terminal size={18} className="instruction-header-icon" /> // RUNTIME DEPLOYMENT INSTRUCTIONS:
        </h4>
        <div className="instructions-grid">
          <div className="instruction-method">
            <h5>
              <HardDrive size={14} className="method-icon" /> IDE RUNTIME (VS CODE)
            </h5>
            <ol>
              <li>EXTRACT COMPILATION COMPRESSED FILE</li>
              <li>LAUNCH VS CODE -&gt; OPEN FOLDER</li>
              <li>RIGHT-CLICK <code>index.html</code></li>
              <li>SELECT <strong>"OPEN WITH LIVE SERVER"</strong></li>
            </ol>
          </div>
          <div className="instruction-method">
            <h5>
              <Terminal size={14} className="method-icon" /> SHELL/TERMINAL RUNTIME
            </h5>
            <ol>
              <li>EXTRACT COMPILATION COMPRESSED FILE</li>
              <li>LAUNCH TERMINAL IN RESOURCE FOLDER</li>
              <li>WINDOWS: RUN <code>open.bat</code></li>
              <li>MAC/LINUX: RUN <code>bash open.sh</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
