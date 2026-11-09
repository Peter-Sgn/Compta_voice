import type { HTMLAttributes } from "react";
import { formatFCFA } from "@/lib/money";

export type AmountKind = "sale" | "expense" | "neutral";
export type AmountSize = "hero" | "title" | "body" | "caption";

export interface AmountTextProps extends HTMLAttributes<HTMLSpanElement> {
  amount: number;
  kind?: AmountKind;
  size?: AmountSize;
}

export function AmountText({
  amount,
  kind = "neutral",
  size = "body",
  className = "",
  ...props
}: AmountTextProps) {
  const formatted = formatFCFA(Math.abs(amount));

  const sizeClasses = {
    hero: "text-hero font-bold",
    title: "text-title font-bold",
    body: "text-body font-semibold",
    caption: "text-caption font-semibold",
  };

  const kindClasses = {
    sale: "text-sale",
    expense: "text-expense",
    neutral: "text-text",
  };

  const accessibleLabel =
    kind === "sale"
      ? `+ ${formatted}`
      : kind === "expense"
      ? `- ${formatted}`
      : formatted;

  return (
    <span
      className={`inline-flex items-center gap-1.5 tabular-nums ${sizeClasses[size]} ${kindClasses[kind]} ${className}`.trim()}
      aria-label={accessibleLabel}
      {...props}
    >
      {kind === "sale" && (
        <span aria-hidden="true" className="inline-flex items-center gap-0.5">
          <svg
            className="w-[1em] h-[1em] inline-block shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          <span>+</span>
        </span>
      )}
      {kind === "expense" && (
        <span aria-hidden="true" className="inline-flex items-center gap-0.5">
          <svg
            className="w-[1em] h-[1em] inline-block shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
          <span>−</span>
        </span>
      )}
      <span>{formatted}</span>
    </span>
  );
}

