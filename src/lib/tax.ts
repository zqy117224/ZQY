import { type SourceMeta, type TaxResidency } from "@/types/roi";

type TaxBracket = {
  threshold: number;
  baseTax: number;
  rate: number;
};

export const atoTaxSource: SourceMeta = {
  sourceName: "Australian Taxation Office tax rates, 2025-26 income year",
  sourceUrl: "https://www.ato.gov.au/tax-rates-and-codes",
  sourceDate: "2025-26",
  lastUpdated: "2026-05-22",
  scope: "Australian individual income tax brackets",
  note:
    "Tax estimate only. This app excludes Medicare levy, offsets, deductions, HELP/HECS, superannuation, and individual circumstances."
};

const australianResidentBrackets2025: TaxBracket[] = [
  { threshold: 0, baseTax: 0, rate: 0 },
  { threshold: 18_200, baseTax: 0, rate: 0.16 },
  { threshold: 45_000, baseTax: 4_288, rate: 0.3 },
  { threshold: 135_000, baseTax: 31_288, rate: 0.37 },
  { threshold: 190_000, baseTax: 51_638, rate: 0.45 }
];

const foreignResidentBrackets2025: TaxBracket[] = [
  { threshold: 0, baseTax: 0, rate: 0.3 },
  { threshold: 135_000, baseTax: 40_500, rate: 0.37 },
  { threshold: 190_000, baseTax: 60_850, rate: 0.45 }
];

export function estimateIncomeTax(
  taxableIncome: number,
  taxResidency: TaxResidency,
  simpleEffectiveTaxRate = 0.25
) {
  const income = Math.max(0, taxableIncome);

  if (taxResidency === "simple-effective-rate") {
    return income * clamp(simpleEffectiveTaxRate, 0, 1);
  }

  const brackets =
    taxResidency === "foreign-resident" ? foreignResidentBrackets2025 : australianResidentBrackets2025;

  const activeBracket = [...brackets]
    .reverse()
    .find((bracket) => income > bracket.threshold);

  if (!activeBracket) {
    return 0;
  }

  return activeBracket.baseTax + (income - activeBracket.threshold) * activeBracket.rate;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
