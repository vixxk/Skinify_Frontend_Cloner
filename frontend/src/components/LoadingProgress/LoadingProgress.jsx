import "./LoadingProgress.css";

export default function LoadingProgress() {
  return (
    <div className="loading-progress">
      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>
      <p className="loading-text">
        Downloading time depends on the file size and website complexity...
      </p>
    </div>
  );
}
