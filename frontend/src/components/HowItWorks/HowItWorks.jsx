import { Sparkles, Monitor, Terminal } from "lucide-react";
import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-it-works-header">
        <Sparkles size={20} />
        <span>How it works</span>
      </div>
      <div className="steps-grid">
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

        {/* Special Go Live Step with Two Options */}
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
      </div>
    </section>
  );
}
