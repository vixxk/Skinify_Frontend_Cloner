import "./ExamplesSection.css";

export default function ExamplesSection({ defaultWebsites, setKeyword, copyToClipboard }) {
  return (
    <section className="examples-section">
      <span className="section-label">// RECENT TARGETS</span>
      <div className="examples-grid">
        {defaultWebsites.map((site) => (
          <button
            key={site}
            className="example-card"
            onClick={() => setKeyword(`https://${site}`)}
            type="button"
          >
            <span className="site-name">{site}</span>
            <span
              className="copy-tag"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(`https://${site}`);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  copyToClipboard(`https://${site}`);
                }
              }}
            >
              [COPY]
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
