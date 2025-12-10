'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA: Already installed as standalone app');
      return;
    }

    // Check if already dismissed (with fallback for private browsing)
    try {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
      
      // Show prompt again after 7 days
      if (dismissed && dismissedTime) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed < 7) {
          console.log('PWA: Prompt was dismissed recently');
          return;
        }
      }
    } catch (error) {
      console.log('PWA: localStorage not available (private browsing?)', error);
      // Continue anyway - show prompt
    }

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowPrompt(true);
      console.log('PWA: beforeinstallprompt event fired');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Enhanced iOS detection (including older devices)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad on iOS 13+
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true); // For older iOS
    
    if (isIOS && !isStandalone) {
      console.log('PWA: iOS device detected, showing install prompt');
      // Show iOS-specific install instructions after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    } else {
      console.log('PWA: Waiting for beforeinstallprompt event');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem('pwa-install-dismissed', 'true');
      localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
    } catch (error) {
      console.log('PWA: Could not save dismiss state', error);
    }
  };

  if (!showPrompt) {
    return null;
  }

  // Check if iOS for different instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <button className="install-prompt-close" onClick={handleDismiss} aria-label="Close">
          ×
        </button>
        
        <div className="install-prompt-icon">⚽💕</div>
        
        <h3 className="install-prompt-title">Add to Home Screen</h3>
        
        {isIOS ? (
        <div className="install-prompt-ios-instructions">
          <p className="install-prompt-text" style={{ marginBottom: '1rem' }}>
            Install our app for quick access during the wedding!
          </p>
          <div className="install-icon-share-container">
            <div className="install-icon-share">
              {/* iOS Share Button Icon */}
              <svg 
                width="30" 
                height="36" 
                viewBox="0 0 30 36" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ margin: '0 auto' }}
              >
                {/* Box */}
                <rect x="3" y="12" width="24" height="20" rx="3" stroke="#007AFF" strokeWidth="2" fill="none"/>
                {/* Arrow shaft */}
                <line x1="15" y1="4" x2="15" y2="18" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
                {/* Arrow head */}
                <polyline points="10,9 15,4 20,9" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </div>
          <p className="install-prompt-text install-steps">
            1. Tap the <strong>Share button</strong> <span style={{ fontSize: '0.9em', color: '#666' }}>(shown above)</span> in the navigation bar at the bottom of your screen<br/>
            2. Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong><br/>
            3. Tap <strong>&quot;Add&quot;</strong> to install!
          </p>
        </div>
        ) : (
          <>
            <p className="install-prompt-text">
              Install our app for quick access during the wedding!
            </p>
            <button className="install-prompt-button" onClick={handleInstall}>
              Install App
            </button>
          </>
        )}
      </div>
    </div>
  );
}

