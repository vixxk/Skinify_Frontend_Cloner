import { useState } from "react";
import { Download, Globe, Search, Loader2, AlertCircle, CheckCircle, Copy, Sparkles, Code2, Zap } from "lucide-react";

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [resolvedURL, setResolvedURL] = useState("");
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BACKEND_URL = "https://skinify-backend-ui4w.onrender.com";

  const defaultWebsites = [
    "hitesh.ai",
    "piyushgarg.dev", 
    "code.visualstudio.com",
    "tailwindcss.com",
    "nextjs.org",
    "en.wikipedia.org",
    "getbootstrap.com",
    "w3schools.com"
  ];

  const handleScrape = async () => {
    if (!keyword.trim()) return setError("Please enter a keyword or URL!");

    setLoading(true);
    setError("");
    setSuccess("");
    setResolvedURL("");
    setFolderName("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      const data = await res.json();
      if (!data.url) {
        setError("Could not resolve URL. Try another keyword or URL.");
      } else {
        setResolvedURL(data.url);
        setFolderName(data.folder);
        setSuccess("Website scraped successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error or cannot connect to backend.");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleScrape();
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Create a temporary notification
      const notification = document.createElement('div');
      notification.textContent = `Copied: ${text}`;
      notification.className = 'copy-notification';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float1 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float2 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '50%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float3 10s ease-in-out infinite'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              padding: '12px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}>
              <Code2 size={32} color="#ffffff" />
            </div>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              Skinify
            </h1>
          </div>
          
          <p style={{
            fontSize: '1.25rem',
            color: '#a1a1aa',
            marginBottom: '1rem',
            fontWeight: '500'
          }}>
            Clone any frontend in seconds ✨
          </p>
          
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1rem',
              color: '#fbbf24'
            }}>
              <Sparkles size={20} />
              <span style={{ fontWeight: '600' }}>How it works</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{
                  background: '#8b5cf6',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  flexShrink: 0
                }}>1</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Enter keyword</div>
                  <div style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Type website name or URL</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{
                  background: '#8b5cf6',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  flexShrink: 0
                }}>2</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Auto-resolve</div>
                  <div style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>We find the correct URL</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{
                  background: '#8b5cf6',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  flexShrink: 0
                }}>3</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Download & Extract</div>
                  <div style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Get ZIP and extract files</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{
                  background: '#8b5cf6',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  flexShrink: 0
                }}>4</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Open index.html</div>
                  <div style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Find & open in browser</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#fbbf24', margin: 0 }}>
              <strong>Note:</strong> Works best with light JS websites. May not work well with complex sites like Netflix,Facebook or GitHub.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#8b5cf6'
                }}
              />
              <input
                type="text"
                placeholder="Enter keyword or URL (e.g., hitesh.ai)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '16px',
                  color: '#e2e8f0',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              onClick={handleScrape}
              disabled={loading}
              style={{
                padding: '16px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                background: loading ? '#6b7280' : 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                minWidth: '160px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.3)';
                }
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Scraping...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Scrape Website
                </>
              )}
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: '12px',
              color: '#fca5a5',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              color: '#86efac',
              marginBottom: '1rem'
            }}>
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* Result */}
          {resolvedURL && folderName && (
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                <Globe size={16} color="#8b5cf6" />
                <span style={{ color: '#a1a1aa' }}>Resolved URL:</span>
                <a 
                  href={resolvedURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#a855f7',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  {resolvedURL}
                </a>
              </div>
              <button
                onClick={() => window.open(`${BACKEND_URL}/download/${folderName}`, "_blank")}
                style={{
                  padding: '12px 24px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <Download size={16} />
                Download ZIP
              </button>
            </div>
          )}
        </div>

        {/* Website Examples */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '2rem'
        }}>
          <h3 style={{
            color: '#8b5cf6',
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Try these popular websites
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {defaultWebsites.map((site, index) => (
              <div
                key={site}
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.background = 'rgba(139, 92, 246, 0.15)';
                  e.target.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = 'rgba(139, 92, 246, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
                onClick={() => setKeyword(site)}
              >
                <span style={{ 
                  color: '#e2e8f0',
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}>
                  {site}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(site);
                  }}
                  style={{
                    background: '#8b5cf6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#7c3aed'}
                  onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
                >
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-15px); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(15px); }
          75% { transform: translateY(15px) translateX(-20px); }
        }
        
        .copy-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(139, 92, 246, 0.9);
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}