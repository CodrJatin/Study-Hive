"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "studyhive_pwa_install_dismissed";

function getInitialIsInstalled(): boolean {
  // Lazy initializer — runs once on mount (client-only), avoids setState in effect
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function InstallPWA() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  // Use lazy initializer so we never call setState synchronously inside an effect
  const [isInstalled, setIsInstalled] = useState<boolean>(getInitialIsInstalled);

  useEffect(() => {
    // Don't show if already dismissed in this session or recently
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    // If already standalone, nothing to show
    if (isInstalled) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setIsVisible(false);
    setPromptEvent(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setIsVisible(false);
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div
      role="banner"
      aria-label="Install StudyHive app"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-100 w-[calc(100%-2rem)] max-w-sm"
    >
      <div className="clay-card flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 animate-in slide-in-from-bottom-4 duration-300">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          style={{ background: "linear-gradient(135deg, #785900, #ffc107)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-192.png"
            alt="StudyHive"
            className="w-10 h-10 rounded-lg object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-on-surface font-headline leading-tight">
            Add StudyHive to Home Screen
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5 font-body">
            Access your hive anytime, offline-ready.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={handleInstall}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-on-primary cta-gradient hover:opacity-90 transition-opacity"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
