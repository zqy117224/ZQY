import { describe, expect, it } from "vitest";
import { estimateIncomeTax } from "@/lib/tax";

describe("estimateIncomeTax", () => {
  it("returns zero tax below the tax-free threshold for residents", () => {
    expect(estimateIncomeTax(18_000, "australian-resident")).toBe(0);
  });

  it("taxes income just above the tax-free threshold at the bracket rate", () => {
    const tax = estimateIncomeTax(18_200, "australian-resident");
    expect(tax).toBeCloseTo(0, 5);

    const taxAbove = estimateIncomeTax(20_000, "australian-resident");
    expect(taxAbove).toBeCloseTo((20_000 - 18_200) * 0.16, 5);
  });

  it("applies base tax plus marginal rate for higher resident brackets", () => {
    const tax = estimateIncomeTax(100_000, "australian-resident");
    expect(tax).toBeCloseTo(4_288 + (100_000 - 45_000) * 0.3, 5);
  });

  it("applies the top resident bracket correctly", () => {
    const tax = estimateIncomeTax(200_000, "australian-resident");
    expect(tax).toBeCloseTo(51_638 + (200_000 - 190_000) * 0.45, 5);
  });

  it("taxes foreign residents from the first dollar with no tax-free threshold", () => {
    expect(estimateIncomeTax(10_000, "foreign-resident")).toBeCloseTo(3_000, 5);
    expect(estimateIncomeTax(0, "foreign-resident")).toBe(0);
  });

  it("uses the simple effective tax rate when selected", () => {
    expect(estimateIncomeTax(100_000, "simple-effective-rate", 0.2)).toBe(20_000);
  });

  it("defaults the simple effective rate to 25% when not provided", () => {
    expect(estimateIncomeTax(100_000, "simple-effective-rate")).toBe(25_000);
  });

  it("clamps the simple effective rate into [0, 1]", () => {
    expect(estimateIncomeTax(100_000, "simple-effective-rate", 1.5)).toBe(100_000);
    expect(estimateIncomeTax(100_000, "simple-effective-rate", -0.5)).toBe(0);
  });

  it("treats negative income as zero", () => {
    expect(estimateIncomeTax(-5_000, "australian-resident")).toBe(0);
    expect(estimateIncomeTax(-5_000, "foreign-resident")).toBe(0);
  });
});
