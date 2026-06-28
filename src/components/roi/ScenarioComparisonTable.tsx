"use client";

import { formatCurrency, formatPayback } from "@/lib/roi";
import { useI18n } from "@/lib/i18n";
import { type ScenarioResult } from "@/types/roi";
import { type ReactNode } from "react";

type ScenarioComparisonTableProps = {
  scenarios: ScenarioResult[];
};

const rows: {
  label: string;
  getValue: (scenario: ScenarioResult, tx: (text: string) => string) => ReactNode;
}[] = [
  {
    label: "Gross salary used",
    getValue: (scenario: ScenarioResult) => formatCurrency(scenario.assumptions.startingSalary)
  },
  {
    label: "Compounded study cost",
    getValue: (scenario: ScenarioResult) => formatCurrency(scenario.calculation.totalStudyCost)
  },
  {
    label: "Estimated after-tax income",
    getValue: (scenario: ScenarioResult) => formatCurrency(scenario.calculation.afterTaxIncome)
  },
  {
    label: "Annual free cash flow",
    getValue: (scenario: ScenarioResult) => formatCurrency(scenario.calculation.annualFreeCashFlow)
  },
  {
    label: "Risk-adjusted payback",
    getValue: (scenario: ScenarioResult, tx: (text: string) => string) =>
      tx(formatPayback(
        scenario.calculation.riskAdjustedPaybackPeriodYears,
        "Not recovered after risk adjustment."
      ))
  },
  {
    label: "QILT full-time employment rate",
    getValue: (scenario: ScenarioResult, tx: (text: string) => string) => (
      <EmploymentRateValue value={scenario.assumptions.employmentProbability} tx={tx} />
    )
  },
  {
    label: "5-year risk-adjusted cumulative free cash flow",
    getValue: (scenario: ScenarioResult) => formatCurrency(scenario.calculation.riskAdjustedCumulativeFreeCashFlow5Years)
  },
  {
    label: "10-year risk-adjusted cumulative free cash flow",
    getValue: (scenario: ScenarioResult) => formatCurrency(scenario.calculation.riskAdjustedCumulativeFreeCashFlow10Years)
  }
];

export function ScenarioComparisonTable({ scenarios }: ScenarioComparisonTableProps) {
  const { tx } = useI18n();

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">{tx("Scenario comparison")}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-700">
        {tx("Each scenario uses the same employment-probability adjustment for payback and cumulative free cash flow. Saved cash flow compounds at the model return rate. These are sensitivity tests, not forecasts.")}
      </p>

      <div className="mt-5 grid gap-4 lg:hidden">
        {scenarios.map((scenario) => (
          <div key={scenario.name} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="font-semibold text-ink">{tx(scenario.name)}</h3>
            <dl className="mt-3 space-y-3 text-sm">
              {rows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4">
                  <dt className="text-stone-600">{tx(row.label)}</dt>
                  <dd className="text-right font-semibold text-ink">{row.getValue(scenario, tx)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-5 hidden overflow-x-auto rounded-lg border border-stone-200 lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-skywash">
              <th className="w-64 border-b border-stone-200 p-4 font-semibold text-ink">{tx("Metric")}</th>
              {scenarios.map((scenario) => (
                <th key={scenario.name} className="border-b border-stone-200 p-4 font-semibold text-ink">
                  {tx(scenario.name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-stone-200 last:border-b-0">
                <th className="bg-stone-50 p-4 align-top font-semibold text-ink">{tx(row.label)}</th>
                {scenarios.map((scenario) => (
                  <td key={`${scenario.name}-${row.label}`} className="p-4 align-top text-stone-700">
                    {row.getValue(scenario, tx)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmploymentRateValue({ value, tx }: { value: number; tx: (text: string) => string }) {
  const boundedValue = Math.min(1, Math.max(0, value));
  const isLow = boundedValue < 0.6;
  const isMedium = boundedValue >= 0.6 && boundedValue < 0.8;
  const showWarning = isLow || isMedium;
  const classes = isLow
    ? "text-red-700"
    : isMedium
      ? "text-amber-700"
      : "text-leaf";

  return (
    <span
      className={`font-semibold ${classes}`}
      title={
        isLow
          ? tx("Less than 60% of graduates secure full-time employment (QILT). This significantly extends the real payback period.")
          : undefined
      }
    >
      {showWarning ? "⚠️ " : ""}
      {Math.round(boundedValue * 1000) / 10}%
    </span>
  );
}
