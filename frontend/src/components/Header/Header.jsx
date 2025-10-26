import { Code2, Sparkles } from "lucide-react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header skinify-header">
      <div className="logo-section">
        <div className="logo-icon">
          <Code2 size={28} color="#fff" />
        </div>
        <h1 className="title">Skinify</h1>
      </div>
      <p className="subtitle">Clone any frontend in seconds ✨</p>
    </header>
  );
}
