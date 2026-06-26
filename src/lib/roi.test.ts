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
  it("compounds escalating tuition and living costs to graduation and excludes opportunity cost", () => {
    const result = calculateRoi(baseAssumptions());
    expect(result.tuitionCost).toBeCloseTo(36_068.63, 5);
    expect(result.livingCostWhileStudying).toBeCloseTo(17_781.12625, 5);
    expect(result.opportunityCost).toBe(0);
    expect(result.totalStudyCost).toBeCloseTo(53_849.75625, 5);
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

  it("uses a compounding cost balance reduced by risk-adjusted free cash flow for payback", () => {
    const result = calculateRoi(baseAssumptions());
    expect(result.riskAdjustedPaybackPeriodYears).toBeCloseTo(1.4713146482656252, 5);
  });

  it("lengthens risk-adjusted payback when employment probability falls", () => {
    const fullEmployment = calculateRoi(baseAssumptions({ employmentProbability: 1 }));
    const halfEmployment = calculateRoi(baseAssumptions({ employmentProbability: 0.5 }));

    expect(halfEmployment.riskAdjustedPaybackPeriodYears).toBeGreaterThan(
      fullEmployment.riskAdjustedPaybackPeriodYears ?? 0
    );
  });

  it("returns null risk-adjusted payback when there is no positive free cash flow", () => {
    const result = calculateRoi(
      baseAssumptions({ startingSalary: 0, occupationMedianSalary: 0, annualLivingCostAfterGraduation: 1_000 })
    );
    expect(result.riskAdjustedPaybackPeriodYears).toBeNull();
  });

  it("returns null risk-adjusted payback when there is no study cost to recover", () => {
    const result = calculateRoi(baseAssumptions({ tuitionPerYear: 0, livingCostPerYearWhileStudying: 0, otherStudyCosts: 0, opportunityCostPerYear: 0 }));
    expect(result.riskAdjustedPaybackPeriodYears).toBeNull();
  });

  it("compounds saved career-year free cash flow into the cumulative totals", () => {
    const result = calculateRoi(baseAssumptions());
    expect(result.cumulativeFreeCashFlow5Years).toBeCloseTo(230_029.5604, 5);
    expect(result.cumulativeFreeCashFlow10Years).toBeCloseTo(552_657.9184511803, 5);
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
