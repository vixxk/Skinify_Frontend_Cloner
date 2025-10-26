import { useState } from "react";
import "./FaqSection.css";

const faqList = [
  {
    q: "How does Skinify clone websites?",
    a: "Skinify uses two powerful engines: a custom Website Scraper and a headless Puppeteer + Cheerio setup. Both extract HTML, assets, and stylesheets to generate a downloadable, ready-to-run front-end package."
  },
  {
    q: "What is the difference between Website Scraper and Puppeteer + Cheerio?",
    a: "Website Scraper excels at static and lightweight websites, providing fast, clean results. Puppeteer + Cheerio simulates a real browser and parses complex/dynamic content—ideal for modern or JavaScript-heavy sites. Switch models if one fails."
  },
  {
    q: "What is Deep Mode?",
    a: "Deep Mode enables recursive crawling. With this enabled, Skinify scrapes all internal links and subpages, offering a far more comprehensive download—perfect for capturing entire documentation sites or blogs."
  },
  {
    q: "Why do I encounter usage errors or failed downloads?",
    a: "Skinify currently runs on a free tier Render backend with limited memory and CPU. High traffic, large downloads, or multiple users may lead to temporary server errors. Wait a few moments and try again if you see errors."
  },
  {
    q: "Is there a limit on what domains I can clone?",
    a: "Skinify is designed for open/public content. Sites with authentication, aggressive dynamic scripts, or anti-bot protections may not clone properly. Do not use for confidential or paid content without permission."
  },
  {
    q: "What can I do with the downloaded ZIP?",
    a: "Extract, open in VS Code or any IDE, and use Live Server or the provided `open.sh` / `open.bat` scripts to view your cloned site locally. This is perfect for learning, prototyping, or design inspiration."
  },
  {
    q: "Can I contribute or report issues?",
    a: (
      <>
        Absolutely! All contributions, issues, and feedback are welcome. Visit the{" "}
        <a
          href="https://github.com/vixxk/Skinify_Frontend_Cloner"
          target="_blank"
          rel="noopener noreferrer"
          className="faq-link"
        >
          GitHub repository
        </a>.
      </>
    )
  }
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqList.map((item, idx) => (
          <div
            className={`faq-block ${openIdx === idx ? "open" : ""}`}
            key={idx}
          >
            <button
              className="faq-q"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
            >
              {item.q}
              <span className={`faq-arrow ${openIdx === idx ? "open" : ""}`}>
                ▶
              </span>
            </button>

            <div
              className={`faq-a-wrapper ${openIdx === idx ? "visible" : ""}`}
              style={
                openIdx === idx
                  ? { maxHeight: "500px", opacity: 1 }
                  : { maxHeight: 0, opacity: 0 }
              }
            >
              <div className="faq-a">{item.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
