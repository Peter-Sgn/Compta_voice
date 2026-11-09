/**
 * Pure functions for currency and money calculations.
 * Strictly adheres to rule 4.1 in AGENTS.md:
 * - FCFA (XOF) amounts are always integers (never decimals).
 * - Formatting uses non-breaking spaces (\u00A0) for thousands and currency separator: "12 000 FCFA".
 */

/**
 * Formats an amount in integer FCFA with non-breaking spaces.
 * Example: 12000 -> "12 000 FCFA", 0 -> "0 FCFA", -2500 -> "-2 500 FCFA"
 */
export function formatFCFA(amount: number): string {
  const integerAmount = Math.round(amount);
  const formattedNumber = Math.abs(integerAmount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  const prefix = integerAmount < 0 ? "-" : "";

  return `${prefix}${formattedNumber}\u00A0FCFA`;
}

