"use client";

/**
 * Toast — composant client réutilisable (T-023).
 *
 * Notification temporaire avec une action « Annuler », visible 5 secondes.
 * Conforme à la règle de suppression douce de AGENTS.md (annulation possible
 * pendant 5 secondes). Aucune logique de suppression n'est branchée ici.
 *
 * - role="status" pour l'accessibilité.
 * - Animation d'entrée/sortie de 200 ms (CSS classes).
 * - Désactivable par prefers-reduced-motion.
 * - Se positionne en bas de la colonne de téléphone, au-dessus de la barre d'onglets.
 */

import { useEffect, useState, useCallback } from "react";

export interface ToastProps {
  /** Message to display. */
  message: string;
  /** Label for the undo / action button. */
  actionLabel: string;
  /** Callback when the user taps the action button. */
  onAction?: () => void;
  /** Callback when the toast finishes (dismissed or expired). */
  onDismiss: () => void;
  /** Duration in ms before auto-dismiss. Default: 5000. */
  duration?: number;
}

export function Toast({
  message,
  actionLabel,
  onAction,
  onDismiss,
  duration = 5000,
}: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  const dismiss = useCallback(() => {
    setIsLeaving(true);
    // Wait for exit animation before calling onDismiss
    setTimeout(() => {
      onDismiss();
    }, 250);
  }, [onDismiss]);

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      dismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  const handleAction = () => {
    onAction?.();
    dismiss();
  };

  return (
    <div
      role="status"
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[448px] z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-card bg-brand-900 text-surface shadow-soft ${
        isLeaving ? "animate-toast-out" : "animate-toast-in"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <span className="text-caption font-medium flex-1 min-w-0">
        {message}
      </span>
      <button
        type="button"
        onClick={handleAction}
        className="text-accent-500 text-caption font-bold uppercase tracking-wider whitespace-nowrap min-h-12 min-w-12 flex items-center justify-center cursor-pointer shrink-0 rounded-button transition-opacity duration-150 motion-reduce:transition-none hover:opacity-80 active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900 select-none"
      >
        {actionLabel}
      </button>
    </div>
  );
}

