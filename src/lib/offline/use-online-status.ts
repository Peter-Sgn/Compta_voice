"use client";

/**
 * useOnlineStatus — hook client (T-023).
 *
 * Retourne l'état de connexion réseau du navigateur en temps réel.
 * SSR-safe : renvoie `true` côté serveur (pas de flash "hors ligne" initial).
 * Écoute les événements natifs `online` / `offline` sur `window`.
 */

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot(): boolean {
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  // On considère qu'on est en ligne côté serveur pour éviter le flash
  return true;
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

