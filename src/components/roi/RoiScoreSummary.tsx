"use client";

import Link from "next/link";
import { getRoiProfile } from "@/data/roiDefaults";
import { useI18n } from "@/lib/i18n";
import {
  buildInitialAssumptions,
  calculateRoi,
  formatCurrency,
  formatPayback,
  formatPercent,
  ROI_INVESTMENT_RETURN_RATE
} from "@/lib/roi";

export function RoiScoreSummary({ pathwayId }: { pathwayId: string }) {
  const { tx } = useI18n();
  const profile = getRoiProfile(pathwayId);
  const assumptions = buildInitialAssumptions(profile);
  const calculation = calculateRoi(assumptions);
  const hasSalary = profile.startingSalary.value !== null;
  const hasTuition = profile.tuitionPerYear.value !== null;
  const payback = !hasTuition
    ? tx("Payback unavailable — tuition assumption needed.")
    : hasSalary
      ? tx(
          formatPayback(
            calculation.riskAdjustedPaybackPeriodYears,
            "Not recovered after risk adjustment."
          )
        )
      : tx("Salary assumption needed");

  return (
    <div className="rounded-md border border-leaf/25 bg-leaf/10 p-3 sm:p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase text-leaf">{tx("Default ROI snapshot")}</p>
        <p className="text-xs leading-5 text-stone-600">
          {tx(profile.startingSalary.dataLabel ?? "No source attached")}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
        <Metric
          label="Total tuition"
          value={hasTuition ? formatCurrency(calculation.tuitionCost) : tx("Tuition assumption needed")}
          note="Tuition compounded to the graduation-date starting balance at the 10% annual model rate."
        />
        <Metric
          label="Total study cost"
          value={hasTuition ? formatCurrency(calculation.totalStudyCost) : tx("Tuition assumption needed")}
          note="Graduation-date starting balance. During payback, this balance keeps compounding at 10% until recovered."
        />
        <Metric
          label="After-tax income"
          value={hasSalary ? formatCurrency(calculation.afterTaxIncome) : tx("Salary assumption needed")}
        />
        <Metric
          label="Annual free cash flow"
          value={hasSalary ? formatCurrency(calculation.annualFreeCashFlow) : tx("Salary assumption needed")}
          note="Uses AUD 45,000 per year as a conservative Sydney living-cost model assumption."
        />
        <Metric
          label="Risk-adjusted payback"
          value={payback}
          note={`The study-cost balance keeps growing at ${formatPercent(ROI_INVESTMENT_RETURN_RATE)} until free cash flow clears it.`}
        />
        <Metric
          label="Graduate salary"
          value={
            profile.startingSalary.value !== null
              ? formatCurrency(profile.startingSalary.value)
              : tx("Salary assumption needed")
          }
        />
        <Metric
          label="Employment rate"
          value={
            profile.employmentProbability.value !== null
              ? formatPercent(profile.employmentProbability.value)
              : tx("Employment assumption needed")
          }
        />
      </div>
      <Link
        href={`/roi?pathway=${pathwayId}`}
        className="mt-2 inline-block text-xs font-semibold text-leaf underline underline-offset-2"
      >
        {tx("Edit assumptions in ROI calculator")}
      </Link>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  const { tx } = useI18n();

  return (
    <div className="min-w-0 rounded bg-white p-2">
      <p className="text-[11px] font-semibold leading-4 text-stone-500">{tx(label)}</p>
      <p className="mt-1 break-words text-sm font-bold leading-5 text-ink">{value}</p>
      {note ? <p className="mt-1 text-[10px] leading-4 text-stone-500">{tx(note)}</p> : null}
    </div>
  );
}
