import { Copy } from "lucide-react";
import "./ExamplesSection.css";

export default function ExamplesSection({ defaultWebsites, setKeyword, copyToClipboard }) {
  return (
    <section className="examples-section">
      <h3 className="examples-title">Try these popular websites</h3>
      <div className="examples-grid">
        {defaultWebsites.map((site) => (
          <div key={site} className="example-card" onClick={() => setKeyword(`https://${site}`)}>
            <span className="site-name">{site}</span>
            <button
              className="copy-btn"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(`https://${site}`);
              }}
            >
              <Copy size={14} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
