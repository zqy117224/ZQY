"use client";

import { formatCurrency, formatPayback } from "@/lib/roi";
import { useI18n } from "@/lib/i18n";
import { type ScenarioResult } from "@/types/roi";

type ScenarioComparisonTableProps = {
  scenarios: ScenarioResult[];
};

const rows: {
  label: string;
  getValue: (scenario: ScenarioResult, tx: (text: string) => string) => string;
}[] = [
  {
    label: "Gross salary used",
    getValue: (scenario: ScenarioResult) => formatCurrency(scenario.assumptions.startingSalary)
  },
  {
    label: "Total study cost",
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
    label: "Payback period",
    getValue: (scenario: ScenarioResult, tx: (text: string) => string) =>
      tx(formatPayback(scenario.calculation.paybackPeriodYears, "Not recovered under current assumptions."))
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
    label: "5-year cumulative free cash flow",
    getValue: (scenario: ScenarioResult) => formatCurrency(scenario.calculation.cumulativeFreeCashFlow5Years)
  },
  {
    label: "10-year cumulative free cash flow",
    getValue: (scenario: ScenarioResult) => formatCurrency(scenario.calculation.cumulativeFreeCashFlow10Years)
  }
];

export function ScenarioComparisonTable({ scenarios }: ScenarioComparisonTableProps) {
  const { tx } = useI18n();

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">{tx("Scenario comparison")}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-700">
        {tx("Base uses the QILT graduate salary input. Optimistic uses the mapped later-career reference where available, usually JSA occupation median earnings before tax. These are sensitivity tests, not forecasts.")}
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
