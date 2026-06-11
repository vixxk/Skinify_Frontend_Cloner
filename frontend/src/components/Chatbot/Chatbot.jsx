import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Terminal, Cpu } from "lucide-react";
import "./Chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "SYSTEM LOG: Connection established.\n\nHello, I am **Skiny**, the Skinify system assistant. Ask me anything about our scraper engines, how to extract website code, or how to run your downloaded site locally! Type your question below or click a protocol query.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://skinify-backend-ui4w.onrender.com";

  const presetQueries = [
    "How does Skinify clone websites?",
    "What is the difference between the engines?",
    "How do I run the downloaded ZIP?",
    "Why does my download fail?",
  ];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    if (!text) setInputValue(""); // clear input if it was from input box
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.message) {
        let content = data.message.content || "";
        content = content.replace(/<think>[\s\S]*?(<\/think>|$)/g, "").trim();
        setMessages((prev) => [...prev, { ...data.message, content }]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Chatbot connection failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "ERROR: Communication timeout. Please check your internet connection or try again later. The backend server might be booting up.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Basic custom helper to render simple markdown-like formatting (bold, backticks, line breaks)
  // Robust custom markdown helper to render multi-line code blocks, bold text, links, lists, and inline code
  const formatMessageContent = (text) => {
    if (!text) return "";

    const parts = [];
    let currentIndex = 0;

    // Split text into triple backtick code blocks and regular text segments
    while (currentIndex < text.length) {
      const codeBlockStart = text.indexOf("```", currentIndex);
      if (codeBlockStart === -1) {
        parts.push({
          type: "text",
          content: text.substring(currentIndex),
        });
        break;
      }

      if (codeBlockStart > currentIndex) {
        parts.push({
          type: "text",
          content: text.substring(currentIndex, codeBlockStart),
        });
      }

      const codeBlockEnd = text.indexOf("```", codeBlockStart + 3);
      if (codeBlockEnd === -1) {
        parts.push({
          type: "code",
          content: text.substring(codeBlockStart + 3),
        });
        break;
      }

      parts.push({
        type: "code",
        content: text.substring(codeBlockStart + 3, codeBlockEnd),
      });

      currentIndex = codeBlockEnd + 3;
    }

    return parts.map((part, partIdx) => {
      if (part.type === "code") {
        const lines = part.content.split("\n");
        const firstLine = lines[0].trim();
        // Check if the first line is a language identifier (like js, bash, html)
        const hasLanguage = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const codeLines = hasLanguage ? lines.slice(1) : lines;
        const codeText = codeLines.join("\n").trim();

        return (
          <pre key={partIdx} className="chat-code-block">
            <code>{codeText}</code>
          </pre>
        );
      } else {
        const lines = part.content.split("\n");
        return lines.map((line, lineIdx) => {
          const trimmedLine = line.trim();

          // Render a simple spacer for empty lines
          if (!trimmedLine) {
            return lineIdx > 0 ? <div key={`${partIdx}-${lineIdx}`} className="chat-empty-line" /> : null;
          }

          // Check for horizontal divider
          if (trimmedLine === "---" || trimmedLine === "***") {
            return <hr key={`${partIdx}-${lineIdx}`} className="chat-divider" />;
          }

          // Check for headers (up to h4)
          let headingLevel = 0;
          if (trimmedLine.startsWith("# ")) headingLevel = 1;
          else if (trimmedLine.startsWith("## ")) headingLevel = 2;
          else if (trimmedLine.startsWith("### ")) headingLevel = 3;
          else if (trimmedLine.startsWith("#### ")) headingLevel = 4;

          const isHeading = headingLevel > 0;

          // Check if line is a bullet item
          const isBullet = !isHeading && (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* "));
          // Detect indentation (leading spaces)
          const leadingSpaces = line.length - line.trimStart().length;
          const indentClass = leadingSpaces > 2 ? "chat-indent" : "";

          let lineContent = trimmedLine;
          if (isHeading) {
            lineContent = trimmedLine.substring(headingLevel + 1);
          } else if (isBullet) {
            lineContent = trimmedLine.substring(2);
          }

          // Inline formatting (bold, code, links)
          let formattedText = [];
          let currentString = lineContent;
          let key = 0;

          // Regex to split by bold (**text**), inline code (`code`), or links
          const inlineRegex = /(\*\*.*?\*\*|`.*?`|https?:\/\/[^\s]+)/g;
          const inlineParts = currentString.split(inlineRegex);

          inlineParts.forEach((inlinePart) => {
            if (inlinePart.startsWith("**") && inlinePart.endsWith("**")) {
              formattedText.push(<strong key={key++}>{inlinePart.slice(2, -2)}</strong>);
            } else if (inlinePart.startsWith("`") && inlinePart.endsWith("`")) {
              formattedText.push(
                <code key={key++} className="inline-code">
                  {inlinePart.slice(1, -1)}
                </code>
              );
            } else if (inlinePart.match(/^https?:\/\/[^\s]+/)) {
              // Strip trailing punctuation
              const cleanUrl = inlinePart.replace(/[.,:;)]$/, "");
              formattedText.push(
                <a
                  key={key++}
                  href={cleanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chat-link"
                >
                  {cleanUrl}
                </a>
              );
            } else {
              formattedText.push(inlinePart);
            }
          });

          if (isHeading) {
            const HeadingTag = `h${headingLevel}`;
            return (
              <HeadingTag key={`${partIdx}-${lineIdx}`} className={`chat-heading chat-h${headingLevel} ${indentClass}`}>
                {formattedText}
              </HeadingTag>
            );
          }

          if (isBullet) {
            return (
              <li key={`${partIdx}-${lineIdx}`} className={`chat-bullet-item ${indentClass}`}>
                {formattedText}
              </li>
            );
          }

          return (
            <p key={`${partIdx}-${lineIdx}`} className={`chat-paragraph ${indentClass}`}>
              {formattedText}
            </p>
          );
        });
      }
    });
  };

  return (
    <div className="chatbot-root">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="chatbot-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open Chatbot"
        >
          <div className="fab-glow" />
          <Terminal className="fab-icon" size={24} />
          <span className="fab-pulse-dot" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-title-container">
              <Cpu size={16} className="header-status-icon pulse-animation" />
              <span className="header-title">[SKINY.EXE] // CHAT</span>
            </div>
            <button
              className="header-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chatbot"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages area */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message-bubble ${
                  msg.role === "user" ? "user-bubble" : "assistant-bubble"
                }`}
              >
                <div className="message-label">
                  {msg.role === "user" ? "[USER]:" : "[SKINY]:"}
                </div>
                <div className="message-text">
                  {formatMessageContent(msg.content)}
                </div>
              </div>
            ))}

            {/* Loading / Typing Indicator */}
            {isLoading && (
              <div className="chatbot-message-bubble assistant-bubble loading-bubble">
                <div className="message-label">[SKINY]:</div>
                <div className="typing-indicator">
                  <span className="typing-text">SCANNING SYSTEM</span>
                  <span className="typing-dots">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Presets suggestions */}
          {messages.length === 1 && !isLoading && (
            <div className="chatbot-presets">
              <div className="presets-label">// CHOOSE PROTOCOL:</div>
              <div className="presets-list">
                {presetQueries.map((query, idx) => (
                  <button
                    key={idx}
                    className="preset-btn"
                    onClick={() => handleSendMessage(query)}
                  >
                    &gt; {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="chatbot-input-area">
            <textarea
              className="chatbot-textarea"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Query system protocols..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className="chatbot-send-btn"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send query"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
