import { useState, useEffect } from 'react';

function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay (don't show immediately)
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  // Don't show if previously dismissed
  if (sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">
          <img src="/DRSLOGO.jpg" alt="DRS Esports" />
        </div>
        <div className="pwa-install-text">
          <h3>Install DRS Esports</h3>
          <p>Add to your home screen for quick access and offline support!</p>
        </div>
        <div className="pwa-install-actions">
          <button className="pwa-install-btn" onClick={handleInstall}>
            Install
          </button>
          <button className="pwa-dismiss-btn" onClick={handleDismiss}>
            Not now
          </button>
        </div>
      </div>

      <style>{`
        .pwa-install-prompt {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          padding: 20px;
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .pwa-install-content {
          background: linear-gradient(135deg, #111827 0%, #1a1f2e 100%);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 -10px 40px rgba(0, 212, 255, 0.2);
          max-width: 500px;
          margin: 0 auto;
        }

        .pwa-install-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .pwa-install-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pwa-install-text {
          flex: 1;
        }

        .pwa-install-text h3 {
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          margin-bottom: 5px;
          color: #00d4ff;
        }

        .pwa-install-text p {
          font-size: 13px;
          color: #8b9dc3;
          margin: 0;
        }

        .pwa-install-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pwa-install-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #00d4ff 0%, #0066ff 100%);
          border: none;
          border-radius: 8px;
          color: #000;
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pwa-install-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(0, 212, 255, 0.4);
        }

        .pwa-dismiss-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #8b9dc3;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pwa-dismiss-btn:hover {
          border-color: #ff4444;
          color: #ff4444;
        }

        @media (max-width: 480px) {
          .pwa-install-content {
            flex-direction: column;
            text-align: center;
          }

          .pwa-install-actions {
            width: 100%;
          }

          .pwa-install-btn,
          .pwa-dismiss-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default PWAInstall;

