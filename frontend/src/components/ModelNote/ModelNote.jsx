import { Info } from "lucide-react";
import "./ModelNote.css";

export default function ModelNote() {
  return (
    <div className="model-note">
      <Info size={16} />
      <p>
        <strong>Tip:</strong> Try switching between Model 1 and Model 2 if scraping fails with one
        approach. Each model uses different techniques for better compatibility.
      </p>
    </div>
  );
}
