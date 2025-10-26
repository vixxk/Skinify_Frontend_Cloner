import { Sparkles, Monitor, Terminal } from "lucide-react";
import "./HowItWorks.css";

// YouTube accent icon using SVG - circular, minimal
function YouTubeIcon() {
  return (
    <svg
      width="23"
      height="23"
      fill="none"
      viewBox="0 0 32 32"
      style={{
        display: "block"
      }}
    >
      <circle cx="16" cy="16" r="16" fill="#FF4B2B"/>
      <polygon points="12,10 24,16 12,22" fill="#fff"/>
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-it-works-header">
        <Sparkles size={20} />
        <span>How it works</span>
      </div>
      <div className="steps-grid">
        {/* Numbered Steps */}
        {[
          { num: 1, title: "Enter keyword", desc: "Type website name or URL" },
          { num: 2, title: "Auto-resolve", desc: "Skinify finds the correct URL" },
          { num: 3, title: "Download & Extract", desc: "Get ZIP and extract files" }
        ].map((step) => (
          <div key={step.num} className="step">
            <div className="step-number">{step.num}</div>
            <div className="step-content">
              <div className="step-title">{step.title}</div>
              <div className="step-description">{step.desc}</div>
            </div>
          </div>
        ))}

        {/* Go Live step remains same */}
        <div className="step-go-live-container">
          <div className="step-header">
            <div className="step-number">4</div>
            <div className="step-title">Go Live</div>
          </div>
          <div className="go-live-options">
            <div className="go-live-option">
              <div className="option-icon">
                <Monitor size={16} />
              </div>
              <div className="option-content">
                <div className="option-title">VS Code</div>
                <div className="option-desc">Launch with Live Server</div>
              </div>
            </div>
            <div className="option-divider">OR</div>
            <div className="go-live-option">
              <div className="option-icon">
                <Terminal size={16} />
              </div>
              <div className="option-content">
                <div className="option-title">Terminal/Bash</div>
                <div className="option-desc">
                  .bat(Windows)
                  <br /> .sh(Linux/Mac)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Tutorial, styled exactly as a step but clickable */}
        <a
          href="https://www.youtube.com/watch?v=UC4WWgLZCWI"
          target="_blank"
          rel="noopener noreferrer"
          className="step step-video"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 18px",
            cursor: "pointer",
            border: "1.5px solid var(--primary-orange)",
            boxShadow: "0 4px 12px 0 rgba(255,107,53,0.16)",
            textDecoration: "none",
            background: "rgba(255, 107, 53, 0.08)",
            transition: "var(--transition-default)"
          }}
        >
          <div className="step-number" style={{ background: "linear-gradient(135deg,#FF4B2B,#ff7c3b)" }}>
            <YouTubeIcon />
          </div>
          <div className="step-content">
            <div className="step-title" style={{ color: "var(--primary-orange)", fontWeight: 700 }}>
              Demo Video
            </div>
            <div className="step-description" style={{ color: "#ffb288", fontWeight: 500 }}>
              Click here for a <br></br>step-by-step demo!
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
