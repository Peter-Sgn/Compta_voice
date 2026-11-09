import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: "card" | "button" | "full" | "default";
}

export function Skeleton({
  rounded = "default",
  className = "",
  ...props
}: SkeletonProps) {
  const roundedClasses = {
    card: "rounded-card",
    button: "rounded-button",
    full: "rounded-full",
    default: "rounded",
  };

  return (
    <div
      aria-hidden="true"
      className={`bg-border/70 animate-pulse motion-reduce:animate-none ${roundedClasses[rounded]} ${className}`.trim()}
      {...props}
    />
  );
}

