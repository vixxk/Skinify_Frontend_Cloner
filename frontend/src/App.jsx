import { useState } from "react";
import "./App.css";
import ModelSwitch from "./components/ModelSwitch/ModelSwitch";
import DeepModeToggle from "./components/DeepModeToggle/DeepModeToggle";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import ModelNote from "./components/ModelNote/ModelNote";
import SearchInput from "./components/SearchInput/SearchInput";
import LoadingProgress from "./components/LoadingProgress/LoadingProgress";
import Message from "./components/Message/Message";
import ResultSection from "./components/ResultSection/ResultSection";
import ExamplesSection from "./components/ExamplesSection/ExamplesSection";
import BackgroundElements from "./components/BackgroundElements/BackgroundElements";
import FaqSection from "./components/FaqSection/FaqSection";
import Chatbot from "./components/Chatbot/Chatbot";

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [modelResults, setModelResults] = useState({
    "website-scraper": { resolvedURL: "", folderName: "", success: "", error: "" },
    "puppeteer-cheerio": { resolvedURL: "", folderName: "", success: "", error: "" }
  });
  const [loading, setLoading] = useState(false);
  const [deepMode, setDeepMode] = useState(false);
  const [model, setModel] = useState("website-scraper");

  const { resolvedURL, folderName, success, error } = modelResults[model];

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://skinify-backend-ui4w.onrender.com";

  const defaultWebsites = [
    "hitesh.ai",
    "piyushgarg.dev",
    "code.visualstudio.com",
    "tailwindcss.com",
    "nextjs.org",
    "vercel.com",
    "getbootstrap.com",
    "w3schools.com",
    "react.dev"
  ];

  const handleScrape = async () => {
    if (!keyword.trim()) {
      setModelResults(prev => ({
        ...prev,
        [model]: { ...prev[model], error: "Please enter a keyword or URL!", success: "" }
      }));
      return;
    }
    setLoading(true);
    setModelResults(prev => ({
      ...prev,
      [model]: { resolvedURL: "", folderName: "", success: "", error: "" }
    }));

    try {
      const timeoutDuration = deepMode ? 300000 : 100000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

      const modelNumber = model === "website-scraper" ? "1" : "2";
      const apiUrl = `${BACKEND_URL}/api/resolve/${modelNumber}`;
      const requestBody =
        model === "website-scraper"
          ? { keyword: keyword.trim(), isRecursive: deepMode }
          : { keyword: keyword.trim() };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (!data.url) {
        setModelResults(prev => ({
          ...prev,
          [model]: {
            resolvedURL: "",
            folderName: "",
            success: "",
            error: "Could not resolve URL. Try another keyword or paste the URL."
          }
        }));
      } else {
        const modelName = model === "website-scraper" ? "Website Scraper" : "Puppeteer + Cheerio";
        const modeText = model === "website-scraper" && deepMode ? " (Deep mode)" : " (Landing page only)";
        setModelResults(prev => ({
          ...prev,
          [model]: {
            resolvedURL: data.url,
            folderName: data.folder,
            success: `Website scraped successfully using ${modelName}${modeText}`,
            error: ""
          }
        }));
      }
    } catch (err) {
      let errMsg = "";
      if (err.name === "AbortError") {
        errMsg = `Request timed out. ${
          deepMode
            ? "Deep mode takes longer - try again or disable deep mode."
            : "Try again or check your connection."
        }`;
      } else if (err.message && err.message.includes("HTTP error")) {
        errMsg = "Server error occurred during scraping. If you are typing keywords, try giving the full URL instead. The backend memory might be full. Please try again after 2 minutes.";
      } else {
        errMsg = "Cannot connect to server. Please check if the backend is running.";
      }
      setModelResults(prev => ({
        ...prev,
        [model]: {
          resolvedURL: "",
          folderName: "",
          success: "",
          error: errMsg
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleScrape();
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      const notification = document.createElement("div");
      notification.textContent = `COPIED TO CLIPBOARD: ${text}`;
      notification.className = "copy-notification";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="app">
      <BackgroundElements />

      {/* Control Panel Sidebar */}
      <aside className="sidebar">
        <div className="brand-logo-container">
          <div className="brand-hexagon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 21 7.2 21 16.8 12 22 3 16.8 3 7.2" />
            </svg>
          </div>
          <h1 className="brand-name">skinify</h1>
        </div>

        <div className="sidebar-section">
          <ModelSwitch model={model} setModel={setModel} disabled={loading} />
        </div>

        <div className="sidebar-section" style={{ opacity: model === "website-scraper" ? 1 : 0.4, transition: "opacity 150ms" }}>
          <DeepModeToggle 
            deepMode={model === "website-scraper" ? deepMode : false} 
            setDeepMode={model === "website-scraper" ? setDeepMode : () => {}} 
            disabled={loading}
          />
        </div>

        <div className="sidebar-section">
          {model === "website-scraper" ? (
            <div className="note-container">
              // ENGINE PARAMS:<br />
              <strong>WEBSITE SCRAPER</strong> works best on light/static JS files. Captures full linked tree assets when <strong>DEEP MODE</strong> is active.
            </div>
          ) : (
            <div className="note-container">
              // ENGINE PARAMS:<br />
              <strong>PUPPETEER + CHEERIO</strong> leverages automated chromium rendering. Optimized for accurate static content extract protocols.
            </div>
          )}
        </div>
      </aside>

      {/* Workspace Panel */}
      <main className="workspace">
        <ModelNote />

        <div className="workspace-console-section">
          <span className="section-label">// Scraping Console</span>
          <SearchInput
            keyword={keyword}
            setKeyword={setKeyword}
            loading={loading}
            handleScrape={handleScrape}
            handleKeyPress={handleKeyPress}
          />
        </div>

        {loading && <LoadingProgress />}
        {error && <Message type="error" message={error} />}
        {success && <Message type="success" message={success} />}

        {resolvedURL && folderName && (
          <ResultSection
            resolvedURL={resolvedURL}
            folderName={folderName}
            BACKEND_URL={BACKEND_URL}
          />
        )}

        <ExamplesSection
          defaultWebsites={defaultWebsites}
          setKeyword={setKeyword}
          copyToClipboard={copyToClipboard}
        />

        <HowItWorks />

        <FaqSection />
      </main>
      <Chatbot />
    </div>
  );
}
