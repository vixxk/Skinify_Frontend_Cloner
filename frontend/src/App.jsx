import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
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

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [resolvedURL, setResolvedURL] = useState("");
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deepMode, setDeepMode] = useState(false);
  const [model, setModel] = useState("1");

  // const BACKEND_URL = "http://localhost:3001";
  const BACKEND_URL = "https://skinify-backend-ui4w.onrender.com";

  const defaultWebsitesModel1 = [
    "hitesh.ai",
    "piyushgarg.dev",
    "code.visualstudio.com",
    "tailwindcss.com",
    "nextjs.org",
    "en.wikipedia.org",
    "getbootstrap.com",
    "w3schools.com",
    "geeksforgeeks"
  ];

  const defaultWebsitesModel2 = [
    "hitesh.ai",
    "vercel.com",
    "code.visualstudio.com",
    "razorpay.com",
    "nextjs.org",
    "paradox.ai",
    "docs.chaicode.com",
    "w3schools.com",
    "react.dev"
  ];

  const defaultWebsites = model === "1" ? defaultWebsitesModel1 : defaultWebsitesModel2;

  const handleScrape = async () => {
    if (!keyword.trim()) return setError("Please enter a keyword or URL!");
    setLoading(true);
    setError("");
    setSuccess("");
    setResolvedURL("");
    setFolderName("");

    try {
      const timeoutDuration = deepMode ? 300000 : 100000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

      const apiUrl = `${BACKEND_URL}/api/resolve/${model}`;
      const requestBody =
        model === "1"
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
        setError("Could not resolve URL. Try another keyword or paste the URL.");
      } else {
        setResolvedURL(data.url);
        setFolderName(data.folder);
        const modelName = model === "1" ? "website-scraper" : "Puppeteer + Cheerio";
        const modeText = model === "1" && deepMode ? " (Deep mode)" : " (Landing page only)";
        setSuccess(`Website scraped successfully using ${modelName}${modeText}`);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError(
          `Request timed out. ${
            deepMode
              ? "Deep mode takes longer - try again or disable deep mode."
              : "Try again or check your connection."
          }`
        );
      } else if (err.message.includes("HTTP error")) {
        setError(
          "Server error occurred during scraping. The backend memory might be full. Please try again after 2 minutes."
        );
      } else {
        setError("Cannot connect to server. Please check if the backend is running.");
      }
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
      notification.textContent = `Copied: ${text}`;
      notification.className = "copy-notification";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="app">
      <ModelSwitch model={model} setModel={setModel} />
      {model === "1" && <DeepModeToggle deepMode={deepMode} setDeepMode={setDeepMode} />}
      <BackgroundElements />

      <div className="container">
        <Header />
        <HowItWorks />
        <ModelNote />

        {model === "1" && (
          <div className="note">
            <p>
              <strong>Note:</strong> Website Scraper works best with light JS websites. May not work
              for some sites with dynamic content or network access blocked sites.
              {deepMode && " Deep mode will scrape all subpages and linked content."}
            </p>
          </div>
        )}
        {model === "2" && (
          <div className="note note-green">
            <p>
              <strong>Note:</strong> Puppeteer + Cheerio extracts with more accuracy but may not
              work for some sites with dynamic content or network access blocked sites.
            </p>
          </div>
        )}

        <section className="input-section">
          <SearchInput
            keyword={keyword}
            setKeyword={setKeyword}
            loading={loading}
            handleScrape={handleScrape}
            handleKeyPress={handleKeyPress}
            model={model}
            deepMode={deepMode}
          />

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
        </section>

        <ExamplesSection
          defaultWebsites={defaultWebsites}
          setKeyword={setKeyword}
          copyToClipboard={copyToClipboard}
        />
      </div>
    </div>
  );
}
