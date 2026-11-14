import { z } from "zod";

export const loginEmailSchema = z.email();

export type AuthErrorKind = "rateLimit" | "generic";

export function getAuthErrorKind(
  error: { code?: string; status?: number } | null | undefined,
): AuthErrorKind {
  const code = error?.code ?? "";

  if (
    error?.status === 429 ||
    code.includes("rate_limit") ||
    code.includes("over_request") ||
    code.includes("over_email")
  ) {
    return "rateLimit";
  }

  return "generic";
}
