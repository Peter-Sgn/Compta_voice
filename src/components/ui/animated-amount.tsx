"use client";

/**
 * AnimatedAmount — composant client (T-024).
 *
 * Affiche un montant FCFA qui monte de 0 à sa valeur cible en ~700 ms
 * (easing « ease-out cubic »). Respecte prefers-reduced-motion : si actif,
 * la valeur finale s'affiche immédiatement sans animation.
 *
 * La valeur finale est le contenu initial du span (rendue côté serveur ou
 * à l'hydratation) : aucun saut de contenu n'est causé.
 */

import { useEffect, useRef } from "react";
import { formatFCFA } from "@/lib/money";

export interface AnimatedAmountProps {
  /** Montant en FCFA (entier). */
  amount: number;
  /** Durée de l'animation en ms. Défaut : 700. */
  duration?: number;
  /** Classes Tailwind supplémentaires. */
  className?: string;
  /** Libellé accessible (aria-label). */
  ariaLabel?: string;
}

/** Easing ease-out cubic : décélère vers la fin. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedAmount({
  amount,
  duration = 1800,
  className = "",
  ariaLabel,
}: AnimatedAmountProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    // Vérifier prefers-reduced-motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      el.textContent = formatFCFA(amount);
      return;
    }

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeOutCubic(rawProgress);
      const currentValue = Math.round(amount * progress);

      if (el) {
        el.textContent = formatFCFA(currentValue);
      }

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    // Démarrer à 0 pour l'animation
    el.textContent = formatFCFA(0);
    let rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [amount, duration]);

  return (
    <span
      ref={spanRef}
      className={`tabular-nums ${className}`.trim()}
      aria-label={ariaLabel ?? formatFCFA(amount)}
      aria-live="off"
    >
      {/* Valeur finale rendue initialement (SSR / avant hydratation) pour
          éviter tout décalage de mise en page. */}
      {formatFCFA(amount)}
    </span>
  );
}
