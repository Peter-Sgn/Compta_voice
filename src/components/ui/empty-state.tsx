/**
 * EmptyState — composant réutilisable (T-023).
 *
 * Affiche un état vide avec une illustration SVG provisoire, un titre,
 * un texte et un bouton d'action optionnel.
 *
 * L'illustration est un emplacement SVG simple (cercle + icône « + »)
 * qui sera remplacé par de vrais visuels locaux plus tard.
 */

import type { ReactNode } from "react";
import { Button } from "./button";

export interface EmptyStateProps {
  /** Title displayed below the illustration. */
  title: string;
  /** Body text displayed below the title. */
  body: string;
  /** Optional action button label. */
  actionLabel?: string;
  /** Optional action button callback. */
  onAction?: () => void;
  /** Optional custom illustration to replace the default placeholder. */
  illustration?: ReactNode;
  /** Additional CSS classes. */
  className?: string;
}

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  illustration,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center text-center px-4 py-8 gap-4 ${className}`.trim()}
    >
      {/* Illustration placeholder or custom illustration */}
      {illustration ?? (
        <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
          <svg
            className="w-12 h-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-xs">
        <h3 className="text-title font-bold text-text">{title}</h3>
        <p className="text-body text-text-muted">{body}</p>
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

