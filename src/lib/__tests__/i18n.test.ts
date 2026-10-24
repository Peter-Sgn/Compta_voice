import { describe, it, expect } from "vitest";
import { fr } from "../i18n/fr";

describe("i18n (fr)", () => {
  it("should have correct app name", () => {
    expect(fr.appName).toBe("Comptavoix");
  });

  it("should format greeting with user name", () => {
    expect(fr.home.greeting("Awa")).toBe("Bonjour Awa ! Voici ta journée.");
  });

  it("should format confirmation summary", () => {
    const summary = fr.confirmation.summary(
      "vente de 3 cartons de savon à 8 000",
      "24 000 FCFA"
    );
    expect(summary).toBe(
      "J'ai noté : vente de 3 cartons de savon à 8 000 (24 000 FCFA au total). C'est correct ?"
    );
  });

  it("should format fallback summary for reports", () => {
    const fallback = fr.bilans.summaryFallback(
      "Cette semaine",
      "310 000",
      "190 000",
      "120 000",
      "samedi"
    );
    expect(fallback).toBe(
      "Cette semaine : ventes 310 000, dépenses 190 000, il te reste 120 000. Ta meilleure journée : samedi."
    );
  });

  it("should format streak correctly", () => {
    expect(fr.home.streak(1)).toBe("1 jour de suite");
    expect(fr.home.streak(5)).toBe("5 jours de suite");
  });
});
