export type DataQuality = "source-backed" | "existing-project-data" | "user-assumption" | "missing";
export type DataLabel =
  | "specific occupation data"
  | "specific graduate data"
  | "broad field graduate outcome";

export type SourceMeta = {
  sourceName: string;
  sourceUrl?: string;
  sourceDate?: string;
  lastUpdated?: string;
  scope: string;
  note?: string;
};

export type SourcedNumber = {
  value: number | null;
  unit: string;
  quality: DataQuality;
  dataLabel?: DataLabel;
  source?: SourceMeta;
  note?: string;
};

export type TaxResidency = "australian-resident" | "foreign-resident" | "simple-effective-rate";

export type PathwayFinancialProfile = {
  pathwayId: string;
  studyYears: SourcedNumber;
  professionalPathwayYears?: SourcedNumber;
  professionalPathwayLabel?: string;
  yearsToGeneralRegistration?: SourcedNumber;
  registrationRequired?: boolean;
  trainingNote?: string;
  tuitionPerYear: SourcedNumber;
  livingCostPerYearWhileStudying: SourcedNumber;
  otherStudyCosts: SourcedNumber;
  opportunityCostPerYear: SourcedNumber;
  startingSalary: SourcedNumber;
  laterCareerSalary: SourcedNumber;
  occupationMedianSalary: SourcedNumber;
  employmentProbability: SourcedNumber;
  annualLivingCostAfterGraduation: SourcedNumber;
  fallbackIncomeIfNotEmployed: SourcedNumber;
};

export type RoiAssumptions = {
  studyYears: number;
  tuitionPerYear: number;
  livingCostPerYearWhileStudying: number;
  otherStudyCosts: number;
  opportunityCostPerYear: number;
  startingSalary: number;
  occupationMedianSalary: number;
  employmentProbability: number;
  annualLivingCostAfterGraduation: number;
  otherAnnualCostsAfterGraduation: number;
  fallbackIncomeIfNotEmployed: number;
  taxResidency: TaxResidency;
  simpleEffectiveTaxRate?: number;
};

export type RoiInputKey =
  | "studyYears"
  | "tuitionPerYear"
  | "livingCostPerYearWhileStudying"
  | "otherStudyCosts"
  | "opportunityCostPerYear"
  | "startingSalary"
  | "employmentProbability"
  | "annualLivingCostAfterGraduation"
  | "otherAnnualCostsAfterGraduation"
  | "fallbackIncomeIfNotEmployed"
  | "simpleEffectiveTaxRate";

export type RoiCalculation = {
  tuitionCost: number;
  livingCostWhileStudying: number;
  opportunityCost: number;
  totalStudyCost: number;
  salaryNpv: number;
  roiPercent: number | null;
  estimatedIncomeTax: number;
  afterTaxIncome: number;
  employedFreeCashFlow: number;
  fallbackFreeCashFlow: number;
  annualFreeCashFlow: number;
  riskAdjustedExpectedFreeCashFlow: number;
  paybackPeriodYears: number | null;
  riskAdjustedPaybackPeriodYears: number | null;
  cumulativeFreeCashFlow5Years: number;
  cumulativeFreeCashFlow10Years: number;
};

export type ScenarioName = "Conservative" | "Base" | "Optimistic";

export type ScenarioAdjustment = {
  name: ScenarioName;
  salaryMultiplier: SourcedNumber;
  employmentProbabilityDelta: SourcedNumber;
  livingCostMultiplier: SourcedNumber;
};

export type ScenarioResult = {
  name: ScenarioName;
  assumptions: RoiAssumptions;
  calculation: RoiCalculation;
};
