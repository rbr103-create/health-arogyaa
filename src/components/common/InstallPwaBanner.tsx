import React, { useState, useEffect } from 'react';
import { Download, Share2, Smartphone, Check, X, ShieldCheck } from 'lucide-react';
import { HealthArogyaaLogo } from './HealthArogyaaLogo';

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  useEffect(() => {
    // 1. Comprehensive standalone / installed check
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://') ||
      window.location.search.includes('source=pwa') ||
      window.location.search.includes('source=') ||
      window.location.search.includes('standalone=true') ||
      window.location.search.includes('installed=true');

    if (isRunningStandalone) {
      try {
        localStorage.setItem('healtharogyaa_is_installed', 'true');
        localStorage.setItem('healtharogyaa_install_dismissed', 'true');
      } catch {}
      setIsStandalone(true);
      setIsDismissed(true);
      return;
    }

    // 2. Check persistent installed flag or dismissed flag
    try {
      const alreadyInstalled = localStorage.getItem('healtharogyaa_is_installed') === 'true';
      const dismissedLocal = localStorage.getItem('healtharogyaa_install_dismissed') === 'true';
      const dismissedSession = sessionStorage.getItem('healtharogyaa_install_dismissed') === 'true';
      if (alreadyInstalled) {
        setIsStandalone(true);
        setIsDismissed(true);
      }
      if (dismissedLocal || dismissedSession) {
        setIsDismissed(true);
      }
    } catch {}

    // 3. Detect OS
    const ua = navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isAndroidDevice = /android/.test(ua);
    setIsIOS(isIosDevice);
    setIsAndroid(isAndroidDevice);

    // 4. Listen for Chrome/Edge/Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // 5. Listen for appinstalled event fired immediately upon installation
    const handleAppInstalled = () => {
      try {
        localStorage.setItem('healtharogyaa_is_installed', 'true');
      } catch {}
      setIsStandalone(true);
      setIsDismissed(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          try {
            localStorage.setItem('healtharogyaa_is_installed', 'true');
            localStorage.setItem('healtharogyaa_install_dismissed', 'true');
          } catch {}
          setDeferredPrompt(null);
          setIsDismissed(true);
          setIsStandalone(true);
        }
      } catch (err) {
        setShowInstructionsModal(true);
      }
    } else {
      setShowInstructionsModal(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('healtharogyaa_install_dismissed', 'true');
      sessionStorage.setItem('healtharogyaa_install_dismissed', 'true');
    } catch {}
  };

  const handleMarkAsInstalled = () => {
    try {
      localStorage.setItem('healtharogyaa_is_installed', 'true');
      localStorage.setItem('healtharogyaa_install_dismissed', 'true');
    } catch {}
    setIsStandalone(true);
    setIsDismissed(true);
    setShowInstructionsModal(false);
  };

  // If already installed or dismissed, do not render banner
  if (isStandalone || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Sleek App Banner with HealthArogyaa Logo */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white border-b border-emerald-800/80 px-3 sm:px-4 py-2.5 shadow-md relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* HealthArogyaa Official Circular Logo */}
            <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 border border-emerald-500/30">
              <HealthArogyaaLogo className="w-full h-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Install HealthArogyaa
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                  PWA App
                </span>
              </div>
              <p className="text-[11px] text-stone-300 truncate hidden xs:block">
                Add to your phone Home Screen for fast, fullscreen access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleMarkAsInstalled}
              className="hidden md:inline-block text-[11px] text-stone-300 hover:text-white px-2 py-1 rounded hover:bg-stone-800/50 transition-colors cursor-pointer"
              title="Already installed this app on your device"
            >
              Already Installed?
            </button>

            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install App</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800/60 transition-colors cursor-pointer"
              title="Dismiss banner"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Instructions Modal for Browsers without Native Prompt (e.g. Safari iOS) */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white text-stone-900 w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white border border-emerald-500/30 p-0.5 shadow-sm flex items-center justify-center shrink-0">
                  <HealthArogyaaLogo className="w-full h-full" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 font-display">
                    Install HealthArogyaa
                  </h3>
                  <p className="text-xs text-stone-500">
                    Add icon to your phone Home Screen
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              {isIOS ? (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-emerald-700" />
                    <span>How to Install on iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-stone-700 leading-relaxed">
                    <li>
                      Tap the <strong>Share button</strong>{' '}
                      <span className="inline-block px-1.5 py-0.5 bg-stone-200 rounded text-[10px]">
                        ⎋ / Share
                      </span>{' '}
                      at the bottom of Safari.
                    </li>
                    <li>
                      Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
                    </li>
                    <li>
                      Tap <strong>&quot;Add&quot;</strong> at the top right.
                    </li>
                  </ol>
                </div>
              ) : isAndroid ? (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span>How to Install on Android (Chrome):</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-stone-700 leading-relaxed">
                    <li>
                      Tap the <strong>three dots menu (⋮)</strong> in Chrome (top right).
                    </li>
                    <li>
                      Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                    </li>
                    <li>
                      Confirm by tapping <strong>&quot;Install&quot;</strong>.
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>How to Install on Desktop / Laptop:</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-stone-700 leading-relaxed">
                    <li>
                      In Google Chrome or Edge, click the <strong>Install icon</strong> in the address bar (right side).
                    </li>
                    <li>
                      Click <strong>&quot;Install&quot;</strong>.
                    </li>
                  </ol>
                </div>
              )}

              <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600 space-y-1">
                <div className="flex items-center gap-1 text-emerald-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Installed App Benefits:</span>
                </div>
                <p>
                  Runs fast in fullscreen mode without browser URL bar, saves offline daily food log, and shows the official HealthArogyaa logo icon.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleMarkAsInstalled}
                className="text-stone-500 hover:text-stone-800 text-xs font-semibold underline cursor-pointer"
              >
                Already installed? Don&apos;t show again
              </button>

              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
