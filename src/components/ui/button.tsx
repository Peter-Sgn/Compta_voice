import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled = false,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-button text-body font-semibold transition-all duration-150 motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer disabled:cursor-not-allowed select-none";

  const variantClasses = {
    primary:
      "bg-brand-700 text-surface hover:bg-brand-900 active:scale-[0.98] focus-visible:ring-brand-700",
    secondary:
      "bg-surface border border-border text-brand-900 hover:bg-bg active:scale-[0.98] focus-visible:ring-brand-700",
    danger:
      "bg-danger text-surface hover:bg-danger/90 active:scale-[0.98] focus-visible:ring-danger",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

