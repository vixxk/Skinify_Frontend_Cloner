import { Layers } from "lucide-react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header skinify-header">
      <div className="logo-section">
        <div className="logo-icon">
          <Layers size={32} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 className="title">SKINIFY</h1>
      </div>
      <p className="subtitle">Clone any frontend in seconds ✨</p>
    </header>
  );
}
