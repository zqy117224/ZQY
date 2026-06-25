import { describe, expect, it } from "vitest";
import { buildScenarioResults, calculateRoi, salaryForCareerYear } from "@/lib/roi";
import { type RoiAssumptions } from "@/types/roi";

function baseAssumptions(overrides: Partial<RoiAssumptions> = {}): RoiAssumptions {
  return {
    studyYears: 3,
    tuitionPerYear: 10_000,
    livingCostPerYearWhileStudying: 5_000,
    otherStudyCosts: 1_000,
    opportunityCostPerYear: 2_000,
    startingSalary: 60_000,
    occupationMedianSalary: 60_000,
    employmentProbability: 1,
    annualLivingCostAfterGraduation: 20_000,
    otherAnnualCostsAfterGraduation: 0,
    fallbackIncomeIfNotEmployed: 0,
    taxResidency: "simple-effective-rate",
    simpleEffectiveTaxRate: 0,
    ...overrides
  };
}

describe("salaryForCareerYear", () => {
  it("uses the starting salary in year 1", () => {
    const assumptions = baseAssumptions({ startingSalary: 50_000, occupationMedianSalary: 90_000 });
    expect(salaryForCareerYear(assumptions, 1)).toBe(50_000);
  });

  it("rises linearly toward the occupation median through year 5", () => {
    const assumptions = baseAssumptions({ startingSalary: 50_000, occupationMedianSalary: 90_000 });
    expect(salaryForCareerYear(assumptions, 3)).toBeCloseTo(70_000, 5);
    expect(salaryForCareerYear(assumptions, 5)).toBeCloseTo(90_000, 5);
  });

  it("holds flat at the occupation median after year 5", () => {
    const assumptions = baseAssumptions({ startingSalary: 50_000, occupationMedianSalary: 90_000 });
    expect(salaryForCareerYear(assumptions, 10)).toBeCloseTo(90_000, 5);
  });

  it("falls back to the starting salary when no occupation median is set", () => {
    const assumptions = baseAssumptions({ startingSalary: 50_000, occupationMedianSalary: 0 });
    expect(salaryForCareerYear(assumptions, 5)).toBe(50_000);
  });
});

describe("calculateRoi", () => {
  it("computes study cost as the sum of tuition, living, other costs, and opportunity cost", () => {
    const result = calculateRoi(baseAssumptions());
    expect(result.tuitionCost).toBe(30_000);
    expect(result.livingCostWhileStudying).toBe(15_000);
    expect(result.opportunityCost).toBe(6_000);
    expect(result.totalStudyCost).toBe(52_000);
  });

  it("computes free cash flow as after-tax income minus post-graduation living and other costs", () => {
    const result = calculateRoi(baseAssumptions());
    expect(result.afterTaxIncome).toBe(60_000);
    expect(result.employedFreeCashFlow).toBe(40_000);
    expect(result.annualFreeCashFlow).toBe(40_000);
  });

  it("blends employed and fallback cash flow by employment probability for the risk-adjusted figure", () => {
    const result = calculateRoi(
      baseAssumptions({ employmentProbability: 0.5, fallbackIncomeIfNotEmployed: 10_000 })
    );
    // fallback free cash flow = 10,000 - 0 tax - 20,000 living - 0 other = -10,000
    expect(result.fallbackFreeCashFlow).toBe(-10_000);
    expect(result.riskAdjustedExpectedFreeCashFlow).toBeCloseTo(0.5 * 40_000 + 0.5 * -10_000, 5);
  });

  it("finds the payback period once cumulative free cash flow exceeds total study cost", () => {
    const result = calculateRoi(baseAssumptions());
    // 40,000/year flat free cash flow against a 52,000 study cost recovers partway through year 2.
    expect(result.paybackPeriodYears).toBeCloseTo(1.3, 5);
  });

  it("returns null payback when free cash flow never recovers the study cost", () => {
    const result = calculateRoi(
      baseAssumptions({ startingSalary: 0, occupationMedianSalary: 0, annualLivingCostAfterGraduation: 1_000 })
    );
    expect(result.paybackPeriodYears).toBeNull();
  });

  it("returns null payback when there is no study cost to recover", () => {
    const result = calculateRoi(baseAssumptions({ tuitionPerYear: 0, livingCostPerYearWhileStudying: 0, otherStudyCosts: 0, opportunityCostPerYear: 0 }));
    expect(result.paybackPeriodYears).toBeNull();
  });

  it("sums career-year salary into multi-year cumulative free cash flow", () => {
    const result = calculateRoi(baseAssumptions());
    // Flat 60,000 salary, 20,000 living costs, no tax => 40,000/year free cash flow.
    expect(result.cumulativeFreeCashFlow5Years).toBe(200_000);
    expect(result.cumulativeFreeCashFlow10Years).toBe(400_000);
  });

  it("treats negative inputs as zero rather than reducing the total", () => {
    const result = calculateRoi(baseAssumptions({ tuitionPerYear: -10_000 }));
    expect(result.tuitionCost).toBe(0);
  });
});

describe("buildScenarioResults", () => {
  it("applies the conservative, base, and optimistic multipliers to salary and employment probability", () => {
    const assumptions = baseAssumptions({ startingSalary: 50_000, employmentProbability: 0.8 });
    const scenarios = buildScenarioResults(assumptions);
    const byName = Object.fromEntries(scenarios.map((scenario) => [scenario.name, scenario]));

    expect(byName.Conservative.assumptions.startingSalary).toBeCloseTo(45_000, 5);
    expect(byName.Conservative.assumptions.employmentProbability).toBeCloseTo(0.7, 5);

    expect(byName.Base.assumptions.startingSalary).toBeCloseTo(50_000, 5);
    expect(byName.Base.assumptions.employmentProbability).toBeCloseTo(0.8, 5);

    expect(byName.Optimistic.assumptions.startingSalary).toBeCloseTo(55_000, 5);
    expect(byName.Optimistic.assumptions.employmentProbability).toBeCloseTo(0.85, 5);
  });

  it("clamps employment probability into [0, 1] even with an optimistic boost near the ceiling", () => {
    const assumptions = baseAssumptions({ employmentProbability: 0.98 });
    const scenarios = buildScenarioResults(assumptions);
    const optimistic = scenarios.find((scenario) => scenario.name === "Optimistic");
    expect(optimistic?.assumptions.employmentProbability).toBeLessThanOrEqual(1);
  });
});
