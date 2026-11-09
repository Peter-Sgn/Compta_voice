import { describe, it, expect } from "vitest";
import { formatFCFA } from "../money";

describe("formatFCFA", () => {
  it("formats standard thousands with non-breaking spaces", () => {
    expect(formatFCFA(12000)).toBe("12\u00A0000\u00A0FCFA");
  });

  it("formats zero correctly", () => {
    expect(formatFCFA(0)).toBe("0\u00A0FCFA");
  });

  it("rounds decimals to the nearest integer as FCFA has no cents", () => {
    expect(formatFCFA(12500.4)).toBe("12\u00A0500\u00A0FCFA");
    expect(formatFCFA(12500.8)).toBe("12\u00A0501\u00A0FCFA");
  });

  it("formats large numbers correctly", () => {
    expect(formatFCFA(1200000)).toBe("1\u00A0200\u00A0000\u00A0FCFA");
  });

  it("handles negative amounts", () => {
    expect(formatFCFA(-2500)).toBe("-2\u00A0500\u00A0FCFA");
  });
});

