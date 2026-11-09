import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant = "default" | "positive" | "warning";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

export function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const baseClasses = "rounded-card p-4 sm:p-6 shadow-soft transition-colors";

  const variantClasses = {
    default: "bg-surface border border-border text-text",
    positive: "bg-brand-100 border border-brand-700/20 text-brand-900",
    warning: "bg-accent-100 border border-accent-500/30 text-text",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

