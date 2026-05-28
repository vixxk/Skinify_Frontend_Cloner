import "./HowItWorks.css";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "ENTER TARGET DOMAIN",
      desc: "Provide any keyword, domain name, or direct URL inside the terminal command input above."
    },
    {
      num: "02",
      title: "ENGINE SELECTION & RESOLUTION",
      desc: "The active scraper resolves the host, checks routing tables, and builds file maps."
    },
    {
      num: "03",
      title: "SCRAPE & PACKAGE COMPILATION",
      desc: "Skinify pulls resources, remaps asset urls, compiles structure, and generates a zip archive."
    },
    {
      num: "04",
      title: "LOCAL SANDBOX RUNTIME",
      desc: "Extract the zip file and go live instantly with VS Code Live Server or by running open.bat / open.sh."
    }
  ];

  return (
    <section className="extraction-protocol-section">
      <span className="section-label">// EXTRACTION PROTOCOL</span>
      <div className="protocol-steps-list">
        {steps.map((step, idx) => (
          <div key={step.num} className="protocol-step-wrapper">
            <div className="protocol-step-item">
              <div className="protocol-watermark">{step.num}</div>
              <div className="protocol-content">
                <h4 className="protocol-title">{step.title}</h4>
                <p className="protocol-desc">{step.desc}</p>
              </div>
            </div>
            {idx < steps.length - 1 && <div className="protocol-divider" />}
          </div>
        ))}
      </div>
      <div className="protocol-video-container">
        <a
          href="https://www.youtube.com/watch?v=UC4WWgLZCWI"
          target="_blank"
          rel="noopener noreferrer"
          className="protocol-video-link"
        >
          &gt;_ LAUNCH VIDEO TUTORIAL [DEMO_STREAM.MOV]
        </a>
      </div>
    </section>
  );
}
