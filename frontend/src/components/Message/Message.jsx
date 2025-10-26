import { AlertCircle, CheckCircle } from "lucide-react";
import "./Message.css";

export default function Message({ type, message }) {
  return (
    <div className={`message ${type === "error" ? "error-message" : "success-message"}`}>
      {type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {message}
    </div>
  );
}
