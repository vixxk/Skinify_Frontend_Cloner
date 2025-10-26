import { Globe, Download } from "lucide-react";
import "./ResultSection.css";

export default function ResultSection({ resolvedURL, folderName, BACKEND_URL }) {
  return (
    <div className="result-section">
      <div className="resolved-url">
        <Globe size={16} color="#8b5cf6" />
        <span className="url-label">Resolved URL:</span>
        <a href={resolvedURL} className="url-link" target="_blank" rel="noopener noreferrer">
          {resolvedURL}
        </a>
      </div>
      <button
        className="download-btn"
        onClick={() => window.open(`${BACKEND_URL}/download/${folderName}`, "_blank")}
      >
        <Download size={16} /> Download ZIP
      </button>

      <div className="instructions-section">
        <h4 className="instructions-title">🚀 How to Go Live:</h4>
        <div className="instructions-grid">
          <div className="instruction-method">
            <h5>Method 1: VS Code Live Server</h5>
            <ol>
              <li>Extract the ZIP file to a folder</li>
              <li>Open VS Code → File → Open Folder</li>
              <li>Select the extracted folder</li>
              <li>
                Open <code>index.html</code>→Right Click
              </li>
              <li>
                Select <strong>"Open with Live Server"</strong>
              </li>
            </ol>
          </div>
          <div className="instruction-method">
            <h5>Method 2: Script Files</h5>
            <ol>
              <li>Extract the ZIP file to a folder</li>
              <li>Open the extracted folder</li>
              <li>
                <strong>Windows:</strong> Double-click <code>open.bat</code>
              </li>
              <li>
                <strong>Mac/Linux:</strong> Open terminal in folder
              </li>
              <li>
                <strong>Mac/Linux:</strong> Run <code>bash open.sh</code>
              </li>
            </ol>
          </div>
        </div>
        <div className="instructions-note">
          <p>
            <strong>💡 Pro Tip:</strong> Both methods will automatically open your browser and serve
            the website locally with live reload capabilities!
          </p>
        </div>
      </div>
    </div>
  );
}
