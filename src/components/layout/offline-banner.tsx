"use client";

/**
 * OfflineBanner — composant client (T-023).
 *
 * Bandeau discret qui apparaît en haut de la colonne de téléphone quand
 * le navigateur perd le réseau, et disparaît avec une courte animation
 * au retour du réseau. Utilise le hook useOnlineStatus.
 *
 * State is managed via a tiny external store to avoid calling setState
 * synchronously inside useEffect (React 19 lint rule).
 */

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { useOnlineStatus } from "@/lib/offline/use-online-status";
import { fr } from "@/lib/i18n/fr";

// ─── Tiny external store for banner phase ────────────────────────────────────

type BannerPhase = "hidden" | "visible" | "leaving";

let bannerPhase: BannerPhase = "hidden";
let bannerListeners: Array<() => void> = [];
let leaveTimer: ReturnType<typeof setTimeout> | null = null;

function emitBanner() {
  for (const listener of bannerListeners) {
    listener();
  }
}

function showBanner() {
  if (leaveTimer) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
  bannerPhase = "visible";
  emitBanner();
}

function hideBanner() {
  if (bannerPhase !== "visible") return;
  bannerPhase = "leaving";
  emitBanner();
  leaveTimer = setTimeout(() => {
    bannerPhase = "hidden";
    leaveTimer = null;
    emitBanner();
  }, 250);
}

function subscribeBanner(callback: () => void): () => void {
  bannerListeners.push(callback);
  return () => {
    bannerListeners = bannerListeners.filter((l) => l !== callback);
  };
}

function getBannerSnapshot(): BannerPhase {
  return bannerPhase;
}

function getServerBannerSnapshot(): BannerPhase {
  return "hidden";
}

// ─── Component ───────────────────────────────────────────────────────────────

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const phase = useSyncExternalStore(
    subscribeBanner,
    getBannerSnapshot,
    getServerBannerSnapshot
  );

  // Sync online status → external store via useEffect (no setState involved)
  useEffect(() => {
    if (!isOnline) {
      showBanner();
    } else {
      hideBanner();
    }
  }, [isOnline]);

  if (phase === "hidden") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`sticky top-0 z-50 flex items-center justify-center gap-2 px-4 py-2 bg-accent-100 border-b border-accent-500/30 text-text text-caption font-medium ${
        phase === "leaving" ? "animate-banner-out" : "animate-banner-in"
      }`}
    >
      {/* Wifi-off icon */}
      <svg
        className="w-4 h-4 shrink-0 text-accent-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 20h.01" />
        <path d="M8.5 16.429a5 5 0 0 1 7 0" />
        <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
        <path d="M13.83 10.17A10 10 0 0 1 19 12.859" />
        <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
        <path d="M17.83 6.17A15 15 0 0 1 22 8.82" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
      <span>{fr.ui.offlineBanner}</span>
    </div>
  );
}
