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
  "broad field graduate outcome": "border-coral/30 bg-coral/10 text-coral"
};

export const ROI_INVESTMENT_RETURN_RATE = 0.1;

export function buildInitialAssumptions(profile: PathwayFinancialProfile): RoiAssumptions {
  return {
    studyYears: valueOrZero(profile.studyYears),
    tuitionPerYear: valueOrZero(profile.tuitionPerYear),
    livingCostPerYearWhileStudying: valueOrZero(profile.livingCostPerYearWhileStudying),
    otherStudyCosts: valueOrZero(profile.otherStudyCosts),
    opportunityCostPerYear: valueOrZero(profile.opportunityCostPerYear),
    startingSalary: valueOrZero(profile.startingSalary),
    occupationMedianSalary: valueOrZero(profile.occupationMedianSalary),
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
  const tuitionCost = compoundAnnualStudyCostToGraduation(
    assumptions.tuitionPerYear,
    studyYears
  );
  const livingCostWhileStudying = compoundAnnualStudyCostToGraduation(
    assumptions.livingCostPerYearWhileStudying,
    studyYears
  );
  const opportunityCost = 0;
  const totalStudyCost = tuitionCost + livingCostWhileStudying;

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
  const paybackPeriodYears = calculateDynamicPaybackPeriod(assumptions, totalStudyCost, false);
  const riskAdjustedPaybackPeriodYears = calculateDynamicPaybackPeriod(
    assumptions,
    totalStudyCost,
    true
  );

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
    paybackPeriodYears,
    riskAdjustedPaybackPeriodYears,
    cumulativeFreeCashFlow5Years: calculateCumulativeFreeCashFlow(assumptions, 5),
    cumulativeFreeCashFlow10Years: calculateCumulativeFreeCashFlow(assumptions, 10)
  };
}

export function buildScenarioResults(
  baseAssumptions: RoiAssumptions,
  profile?: PathwayFinancialProfile
): ScenarioResult[] {
  return scenarioAdjustments.map((scenario) => {
    const assumptions: RoiAssumptions = {
      ...baseAssumptions,
      startingSalary: Math.max(
        0,
        baseAssumptions.startingSalary * valueOrOne(scenario.salaryMultiplier)
      ),
      occupationMedianSalary:
        profile?.occupationMedianSalary.value ?? baseAssumptions.occupationMedianSalary,
      employmentProbability: clamp(
        baseAssumptions.employmentProbability + valueOrZero(scenario.employmentProbabilityDelta),
        0,
        1
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
    "startingSalary",
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

  for (let year = 1; year <= years; year += 1) {
    total *= 1 + ROI_INVESTMENT_RETURN_RATE;
    const grossIncome = salaryForCareerYear(assumptions, year);
    const incomeTax = estimateIncomeTax(grossIncome, assumptions.taxResidency, assumptions.simpleEffectiveTaxRate);
    total += grossIncome - incomeTax - livingAfterGraduation - annualOtherCosts;
  }

  return total;
}

// Year 1 uses graduate salary. Years 2-5 rise linearly, reaching the occupation median in year 5.
// From year 5 onward, the model holds salary at the occupation median and does not add inflation.
export function salaryForCareerYear(assumptions: RoiAssumptions, careerYear: number) {
  const startingSalary = Math.max(0, assumptions.startingSalary);
  const occupationMedianSalary =
    assumptions.occupationMedianSalary > 0
      ? Math.max(0, assumptions.occupationMedianSalary)
      : startingSalary;
  const boundedYear = Math.max(1, Math.min(5, careerYear));
  const progressToMedian = (boundedYear - 1) / 4;

  return startingSalary + (occupationMedianSalary - startingSalary) * progressToMedian;
}

function calculateDynamicPaybackPeriod(
  assumptions: RoiAssumptions,
  totalStudyCost: number,
  riskAdjusted: boolean
) {
  if (totalStudyCost <= 0) {
    return null;
  }

  const livingCost = Math.max(0, assumptions.annualLivingCostAfterGraduation);
  const otherCosts = Math.max(0, assumptions.otherAnnualCostsAfterGraduation);
  const employmentProbability = clamp(assumptions.employmentProbability, 0, 1);
  const fallbackIncome = Math.max(0, assumptions.fallbackIncomeIfNotEmployed);
  const fallbackAfterTax =
    fallbackIncome -
    estimateIncomeTax(
      fallbackIncome,
      assumptions.taxResidency,
      assumptions.simpleEffectiveTaxRate
    );
  const fallbackFreeCashFlow = fallbackAfterTax - livingCost - otherCosts;
  let remainingCostBalance = totalStudyCost;

  for (let year = 1; year <= 100; year += 1) {
    const startingBalance = remainingCostBalance;
    const balanceAfterInvestmentReturn = startingBalance * (1 + ROI_INVESTMENT_RETURN_RATE);
    const grossIncome = salaryForCareerYear(assumptions, year);
    const afterTaxIncome =
      grossIncome -
      estimateIncomeTax(grossIncome, assumptions.taxResidency, assumptions.simpleEffectiveTaxRate);
    const employedFreeCashFlow = afterTaxIncome - livingCost - otherCosts;
    const yearlyFreeCashFlow = riskAdjusted
      ? employmentProbability * employedFreeCashFlow +
        (1 - employmentProbability) * fallbackFreeCashFlow
      : employedFreeCashFlow;
    const endingBalance = balanceAfterInvestmentReturn - yearlyFreeCashFlow;

    if (endingBalance <= 0 && endingBalance < startingBalance) {
      return year - 1 + startingBalance / (startingBalance - endingBalance);
    }

    remainingCostBalance = endingBalance;
  }

  return null;
}

// Treat tuition and study-period living costs as money paid at the start of each study year.
// Each payment is compounded at the model's 10% annual return rate to the graduation date.
// During payback, that graduation-date cost balance keeps compounding until free cash flow clears it.
function compoundAnnualStudyCostToGraduation(annualCost: number, studyYears: number) {
  const positiveAnnualCost = Math.max(0, annualCost);
  const positiveStudyYears = Math.max(0, studyYears);
  const fullYears = Math.floor(positiveStudyYears);
  const partialYear = positiveStudyYears - fullYears;
  let total = 0;

  for (let yearIndex = 0; yearIndex < fullYears; yearIndex += 1) {
    total += positiveAnnualCost * Math.pow(1 + ROI_INVESTMENT_RETURN_RATE, positiveStudyYears - yearIndex);
  }

  if (partialYear > 0) {
    total +=
      positiveAnnualCost *
      partialYear *
      Math.pow(1 + ROI_INVESTMENT_RETURN_RATE, partialYear);
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
