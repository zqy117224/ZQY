import {
  otherAnnualCostsAfterGraduationDefault,
  scenarioAdjustments,
  simpleEffectiveTaxRateDefault
} from "@/data/roiDefaults";
import { estimateIncomeTax } from "@/lib/tax";
import {
  type DataLabel,
  type DataQuality,
  type PathwayFinancialProfile,
  type RoiAssumptions,
  type RoiCalculation,
  type RoiInputKey,
  type ScenarioResult,
  type SourcedNumber
} from "@/types/roi";

export const qualityLabels: Record<DataQuality, string> = {
  "source-backed": "Source-backed",
  "existing-project-data": "Existing project data",
  "user-assumption": "User assumption",
  missing: "Missing"
};

export const qualityClasses: Record<DataQuality, string> = {
  "source-backed": "border-leaf/30 bg-leaf/10 text-leaf",
  "existing-project-data": "border-ink/20 bg-skywash text-ink",
  "user-assumption": "border-coral/30 bg-coral/10 text-coral",
  missing: "border-stone-300 bg-stone-100 text-stone-700"
};

export const dataLabelClasses: Record<DataLabel, string> = {
  "specific occupation data": "border-leaf/30 bg-leaf/10 text-leaf",
  "specific graduate data": "border-ink/20 bg-skywash text-ink",
  "broad field estimate": "border-coral/30 bg-coral/10 text-coral"
};

export function buildInitialAssumptions(profile: PathwayFinancialProfile): RoiAssumptions {
  return {
    studyYears: valueOrZero(profile.studyYears),
    tuitionPerYear: valueOrZero(profile.tuitionPerYear),
    livingCostPerYearWhileStudying: valueOrZero(profile.livingCostPerYearWhileStudying),
    otherStudyCosts: valueOrZero(profile.otherStudyCosts),
    opportunityCostPerYear: valueOrZero(profile.opportunityCostPerYear),
    startingSalary: valueOrZero(profile.startingSalary),
    salaryGrowthRate: valueOrZero(profile.salaryGrowthRate),
    employmentProbability: valueOrZero(profile.employmentProbability),
    annualLivingCostAfterGraduation: valueOrZero(profile.annualLivingCostAfterGraduation),
    otherAnnualCostsAfterGraduation: valueOrZero(otherAnnualCostsAfterGraduationDefault),
    fallbackIncomeIfNotEmployed: valueOrZero(profile.fallbackIncomeIfNotEmployed),
    taxResidency: "australian-resident",
    simpleEffectiveTaxRate: valueOrZero(simpleEffectiveTaxRateDefault)
  };
}

export function calculateRoi(assumptions: RoiAssumptions): RoiCalculation {
  const studyYears = Math.max(0, assumptions.studyYears);
  const tuitionCost = Math.max(0, assumptions.tuitionPerYear) * studyYears;
  const livingCostWhileStudying = Math.max(0, assumptions.livingCostPerYearWhileStudying) * studyYears;
  const opportunityCost = Math.max(0, assumptions.opportunityCostPerYear) * studyYears;
  const totalStudyCost =
    tuitionCost + livingCostWhileStudying + Math.max(0, assumptions.otherStudyCosts) + opportunityCost;

  const estimatedIncomeTax = estimateIncomeTax(
    assumptions.startingSalary,
    assumptions.taxResidency,
    assumptions.simpleEffectiveTaxRate
  );
  const afterTaxIncome = Math.max(0, assumptions.startingSalary) - estimatedIncomeTax;
  const annualOtherCosts = Math.max(0, assumptions.otherAnnualCostsAfterGraduation);
  const livingAfterGraduation = Math.max(0, assumptions.annualLivingCostAfterGraduation);
  const employedFreeCashFlow = afterTaxIncome - livingAfterGraduation - annualOtherCosts;
  const annualFreeCashFlow = employedFreeCashFlow;

  const fallbackTax = estimateIncomeTax(
    assumptions.fallbackIncomeIfNotEmployed,
    assumptions.taxResidency,
    assumptions.simpleEffectiveTaxRate
  );
  const fallbackFreeCashFlow =
    Math.max(0, assumptions.fallbackIncomeIfNotEmployed) - fallbackTax - livingAfterGraduation - annualOtherCosts;
  const employmentProbability = clamp(assumptions.employmentProbability, 0, 1);
  const riskAdjustedExpectedFreeCashFlow =
    employmentProbability * employedFreeCashFlow + (1 - employmentProbability) * fallbackFreeCashFlow;

  return {
    tuitionCost,
    livingCostWhileStudying,
    opportunityCost,
    totalStudyCost,
    estimatedIncomeTax,
    afterTaxIncome,
    employedFreeCashFlow,
    fallbackFreeCashFlow,
    annualFreeCashFlow,
    riskAdjustedExpectedFreeCashFlow,
    paybackPeriodYears:
      annualFreeCashFlow > 0 && totalStudyCost > 0 ? totalStudyCost / annualFreeCashFlow : null,
    riskAdjustedPaybackPeriodYears:
      riskAdjustedExpectedFreeCashFlow > 0 && totalStudyCost > 0
        ? totalStudyCost / riskAdjustedExpectedFreeCashFlow
        : null,
    cumulativeFreeCashFlow5Years: calculateCumulativeFreeCashFlow(assumptions, 5),
    cumulativeFreeCashFlow10Years: calculateCumulativeFreeCashFlow(assumptions, 10)
  };
}

export function buildScenarioResults(
  baseAssumptions: RoiAssumptions,
  profile?: PathwayFinancialProfile
): ScenarioResult[] {
  return scenarioAdjustments.map((scenario) => {
    const laterCareerSalary =
      scenario.name === "Optimistic" && profile?.laterCareerSalary.value !== null
        ? profile?.laterCareerSalary.value
        : null;
    const assumptions: RoiAssumptions = {
      ...baseAssumptions,
      startingSalary: Math.max(
        0,
        laterCareerSalary ?? baseAssumptions.startingSalary * valueOrOne(scenario.salaryMultiplier)
      ),
      employmentProbability: clamp(
        baseAssumptions.employmentProbability + valueOrZero(scenario.employmentProbabilityDelta),
        0,
        1
      ),
      salaryGrowthRate: Math.max(
        -0.99,
        baseAssumptions.salaryGrowthRate + valueOrZero(scenario.salaryGrowthRateDelta)
      ),
      livingCostPerYearWhileStudying: Math.max(
        0,
        baseAssumptions.livingCostPerYearWhileStudying * valueOrOne(scenario.livingCostMultiplier)
      ),
      annualLivingCostAfterGraduation: Math.max(
        0,
        baseAssumptions.annualLivingCostAfterGraduation * valueOrOne(scenario.livingCostMultiplier)
      )
    };

    return {
      name: scenario.name,
      assumptions,
      calculation: calculateRoi(assumptions)
    };
  });
}

export function getInputMeta(profile: PathwayFinancialProfile, key: RoiInputKey): SourcedNumber {
  if (key === "otherAnnualCostsAfterGraduation") {
    return otherAnnualCostsAfterGraduationDefault;
  }

  if (key === "simpleEffectiveTaxRate") {
    return simpleEffectiveTaxRateDefault;
  }

  return profile[key];
}

export function findAssumptionWarnings(profile: PathwayFinancialProfile) {
  const fields: RoiInputKey[] = [
    "studyYears",
    "tuitionPerYear",
    "livingCostPerYearWhileStudying",
    "otherStudyCosts",
    "opportunityCostPerYear",
    "startingSalary",
    "salaryGrowthRate",
    "employmentProbability",
    "annualLivingCostAfterGraduation",
    "otherAnnualCostsAfterGraduation",
    "fallbackIncomeIfNotEmployed",
    "simpleEffectiveTaxRate"
  ];

  return fields
    .map((field) => ({ field, meta: getInputMeta(profile, field) }))
    .filter(({ meta }) => meta.quality === "user-assumption" || meta.quality === "missing");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

export function formatPayback(value: number | null, notRecoveredText: string) {
  if (value === null || !Number.isFinite(value) || value <= 0) {
    return notRecoveredText;
  }

  if (value > 20) {
    return "20+ years under current assumptions.";
  }

  return `~${value.toFixed(1)} years`;
}

function calculateCumulativeFreeCashFlow(assumptions: RoiAssumptions, years: number) {
  let total = 0;
  const annualOtherCosts = Math.max(0, assumptions.otherAnnualCostsAfterGraduation);
  const livingAfterGraduation = Math.max(0, assumptions.annualLivingCostAfterGraduation);
  const growthRate = Math.max(-0.99, assumptions.salaryGrowthRate);

  for (let year = 0; year < years; year += 1) {
    const grossIncome = Math.max(0, assumptions.startingSalary) * Math.pow(1 + growthRate, year);
    const incomeTax = estimateIncomeTax(grossIncome, assumptions.taxResidency, assumptions.simpleEffectiveTaxRate);
    total += grossIncome - incomeTax - livingAfterGraduation - annualOtherCosts;
  }

  return total;
}

function valueOrZero(value: SourcedNumber) {
  return value.value ?? 0;
}

function valueOrOne(value: SourcedNumber) {
  return value.value ?? 1;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
