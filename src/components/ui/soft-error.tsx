/**
 * SoftError — composant réutilisable (T-023).
 *
 * Affiche un message d'erreur doux et sans jargon technique, avec un
 * bouton « Réessayer ». Conforme à docs/DESIGN.md section 7 (erreurs).
 */

import { Button } from "./button";

export interface SoftErrorProps {
  /** Error message to display (from fr.ts, never a technical message). */
  message: string;
  /** Label for the retry button. */
  retryLabel: string;
  /** Callback when the user taps retry. */
  onRetry: () => void;
  /** Additional CSS classes. */
  className?: string;
}

export function SoftError({
  message,
  retryLabel,
  onRetry,
  className = "",
}: SoftErrorProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center text-center px-4 py-6 gap-4 ${className}`.trim()}
    >
      {/* Warning icon */}
      <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-500">
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>

      <p className="text-body text-text max-w-xs font-medium">{message}</p>

      <Button variant="secondary" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}

