"use client";

import Link from "next/link";
import { getRoiProfile } from "@/data/roiDefaults";
import { useI18n } from "@/lib/i18n";
import {
  buildInitialAssumptions,
  calculateRoi,
  formatCurrency,
  formatPayback,
  formatPercent
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
        <p className="text-xs font-semibold uppercase text-leaf">{tx("Default financial snapshot")}</p>
        <p className="text-xs leading-5 text-stone-600">
          {tx(profile.startingSalary.dataLabel ?? "No source attached")}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
        <Metric
          label="Total tuition"
          value={hasTuition ? formatCurrency(calculation.tuitionCost) : tx("Tuition assumption needed")}
          note="Present value after 5% annual tuition escalation and 7% real discounting."
        />
        <Metric
          label="Total cost NPV"
          value={hasTuition ? formatCurrency(calculation.totalStudyCost) : tx("Tuition assumption needed")}
          note="Present value of tuition and study-period living costs."
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
        <Metric label="Risk-adjusted payback" value={payback} />
        <Metric
          label="Graduate salary"
          value={
            profile.startingSalary.value !== null
              ? formatCurrency(profile.startingSalary.value)
              : tx("Salary assumption needed")
          }
        />
        <EmploymentRateMetric value={profile.employmentProbability.value} />
      </div>
      <Link
        href={`/roi?pathway=${pathwayId}`}
        className="mt-2 inline-block text-xs font-semibold text-leaf underline underline-offset-2"
      >
        {tx("Edit assumptions in payback calculator")}
      </Link>
    </div>
  );
}

function EmploymentRateMetric({ value }: { value: number | null }) {
  const { tx } = useI18n();

  if (value === null) {
    return <Metric label="QILT full-time employment rate" value={tx("Employment assumption needed")} />;
  }

  const isLow = value < 0.6;
  const isMedium = value >= 0.6 && value < 0.8;
  const showWarning = isLow || isMedium;
  const classes = isLow
    ? "border border-red-300 bg-red-50 text-red-700"
    : isMedium
      ? "border border-amber-300 bg-amber-50 text-amber-700"
      : "border border-leaf/30 bg-leaf/10 text-leaf";

  return (
    <div
      className={`min-w-0 rounded p-2 ${classes}`}
      title={
        isLow
          ? tx("Less than 60% of graduates secure full-time employment (QILT). This significantly extends the real payback period.")
          : undefined
      }
    >
      <p className="text-[11px] font-semibold leading-4">{tx("QILT full-time employment rate")}</p>
      <p className="mt-1 break-words text-sm font-bold leading-5">
        {showWarning ? "⚠️ " : ""}
        {formatPercent(value)}
      </p>
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
