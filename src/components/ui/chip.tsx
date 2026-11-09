import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: ReactNode;
}

export function Chip({
  selected = false,
  disabled = false,
  className = "",
  type = "button",
  children,
  ...props
}: ChipProps) {
  const baseClasses =
    "inline-flex items-center justify-center min-h-12 px-5 py-2 rounded-full text-caption sm:text-body font-medium transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer disabled:cursor-not-allowed select-none";

  const stateClasses = selected
    ? "bg-brand-700 text-surface shadow-soft font-semibold"
    : "bg-surface border border-border text-text-muted hover:text-text hover:bg-bg";

  return (
    <button
      type={type}
      disabled={disabled}
      aria-pressed={selected}
      className={`${baseClasses} ${stateClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

