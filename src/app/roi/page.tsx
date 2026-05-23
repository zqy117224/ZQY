"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AssumptionNotice } from "@/components/roi/AssumptionNotice";
import { RoiInputPanel } from "@/components/roi/RoiInputPanel";
import { RoiResultCard } from "@/components/roi/RoiResultCard";
import { ScenarioComparisonTable } from "@/components/roi/ScenarioComparisonTable";
import { SourceEvidencePanel } from "@/components/roi/SourceEvidencePanel";
import { SectionHeader } from "@/components/section-header";
import { majors } from "@/data/majors";
import { auditRoiSalaryDefaults, getRoiProfile } from "@/data/roiDefaults";
import {
  buildInitialAssumptions,
  buildScenarioResults,
  calculateRoi,
  formatCurrency,
  formatPayback,
  formatPercent,
  dataLabelClasses,
  qualityClasses,
  qualityLabels
} from "@/lib/roi";
import { type RoiAssumptions, type RoiInputKey } from "@/types/roi";

type RoiPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function RoiPage({ searchParams }: RoiPageProps) {
  const initialPathwayId = getInitialPathwayId(searchParams.pathway);
  const [pathwayId, setPathwayId] = useState(initialPathwayId);
  const [assumptions, setAssumptions] = useState(() =>
    buildInitialAssumptions(getRoiProfile(initialPathwayId))
  );
  const profile = getRoiProfile(pathwayId);
  const selectedMajor = majors.find((major) => major.id === pathwayId) ?? majors[0];
  const calculation = useMemo(() => calculateRoi(assumptions), [assumptions]);
  const scenarios = useMemo(() => buildScenarioResults(assumptions, profile), [assumptions, profile]);
  const salaryAssumptionNeeded = profile.startingSalary.value === null && assumptions.startingSalary <= 0;
  const salaryAudit = useMemo(() => auditRoiSalaryDefaults(), []);

  function handlePathwayChange(nextPathwayId: string) {
    setPathwayId(nextPathwayId);
    setAssumptions(buildInitialAssumptions(getRoiProfile(nextPathwayId)));
  }

  function handleNumberChange(key: RoiInputKey, value: number) {
    setAssumptions((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? value : 0
    }));
  }

  function handleTaxResidencyChange(value: RoiAssumptions["taxResidency"]) {
    setAssumptions((current) => ({
      ...current,
      taxResidency: value
    }));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Financial planning model"
          title="Education ROI Calculator"
          description="Estimate study cost, after-tax income, free cash flow, and payback time using source-backed data and editable assumptions."
        />
        <Link
          href={`/comparison?majors=${pathwayId}`}
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-center text-sm font-semibold text-ink transition hover:border-leaf hover:text-leaf"
        >
          Compare this pathway
        </Link>
      </div>

      <div className="mb-8 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <label className="block">
          <span className="field-label">Pathway selector</span>
          <select
            className="input-box mt-2"
            value={pathwayId}
            onChange={(event) => handlePathwayChange(event.target.value)}
          >
            {majors.map((major) => (
              <option key={major.id} value={major.id}>
                {major.name}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          {selectedMajor.summary} Defaults use pathway-specific salary evidence where available,
          representative Monash course fee or duration data where sourced, and clearly labelled
          assumptions or missing states where no reliable pathway-specific salary default is available.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <RoiInputPanel
          assumptions={assumptions}
          profile={profile}
          onNumberChange={handleNumberChange}
          onTaxResidencyChange={handleTaxResidencyChange}
        />

        <div className="space-y-6">
          <AssumptionNotice profile={profile} />

          <div className="grid gap-4 sm:grid-cols-2">
            <RoiResultCard
              title="Total study cost"
              value={formatCurrency(calculation.totalStudyCost)}
              note="Tuition, study-period living costs, other study costs, and opportunity cost."
            />
            <RoiResultCard
              title="Estimated after-tax income"
              value={salaryAssumptionNeeded ? "Salary assumption needed" : formatCurrency(calculation.afterTaxIncome)}
              note={
                salaryAssumptionNeeded
                  ? "Enter a pathway-specific salary before using income, free cash flow, or payback outputs."
                  : `Tax model: ${taxResidencyLabel(assumptions.taxResidency)}. Salary data label: ${profile.startingSalary.dataLabel ?? "not labelled"}.`
              }
              tone={salaryAssumptionNeeded ? "warning" : "default"}
            />
            <RoiResultCard
              title="Annual free cash flow"
              value={salaryAssumptionNeeded ? "Salary assumption needed" : formatCurrency(calculation.annualFreeCashFlow)}
              note="After-tax income minus annual living costs and other annual costs."
              tone={salaryAssumptionNeeded || calculation.annualFreeCashFlow <= 0 ? "warning" : "default"}
            />
            <RoiResultCard
              title="Payback period"
              value={
                salaryAssumptionNeeded
                  ? "Salary assumption needed"
                  : formatPayback(calculation.paybackPeriodYears, "Not recovered under current assumptions.")
              }
              note="Total study cost divided by annual free cash flow."
              tone={salaryAssumptionNeeded || calculation.paybackPeriodYears === null ? "warning" : "default"}
            />
            <RoiResultCard
              title="Risk-adjusted payback"
              value={
                salaryAssumptionNeeded
                  ? "Salary assumption needed"
                  : formatPayback(
                      calculation.riskAdjustedPaybackPeriodYears,
                      "Not recovered after risk adjustment."
                    )
              }
              note={`Uses ${formatPercent(assumptions.employmentProbability)} employment probability and fallback income.`}
              tone={salaryAssumptionNeeded || calculation.riskAdjustedPaybackPeriodYears === null ? "warning" : "default"}
            />
            <RoiResultCard
              title="10-year free cash flow"
              value={
                salaryAssumptionNeeded
                  ? "Salary assumption needed"
                  : formatCurrency(calculation.cumulativeFreeCashFlow10Years)
              }
              note="Cumulative employed free cash flow after graduation using the salary growth input."
              tone={salaryAssumptionNeeded ? "warning" : "default"}
            />
          </div>

          <div className="rounded-lg border border-stone-200 bg-skywash p-5 text-sm leading-6 text-stone-700">
            This tool is for education planning only. It is not financial, tax, migration,
            admissions, or career advice. Outcomes vary by individual, visa status, labour market
            conditions, and location.
          </div>
        </div>
      </div>

      <section className="mt-10">
          {salaryAssumptionNeeded ? (
          <div className="rounded-lg border border-coral/30 bg-coral/10 p-5 text-sm leading-6 text-stone-700">
            <h2 className="text-lg font-semibold text-ink">Scenario comparison needs a salary input</h2>
            <p className="mt-2">
              This pathway does not have a pathway-specific salary default yet. Enter a salary in the
              income panel to calculate conservative, base, and optimistic scenarios.
            </p>
          </div>
        ) : (
          <ScenarioComparisonTable scenarios={scenarios} />
        )}
      </section>

      <section className="mt-10">
        <SourceEvidencePanel profile={profile} />
      </section>

      <section className="mt-10">
        <SalaryAuditPanel audit={salaryAudit} />
      </section>
    </div>
  );
}

function SalaryAuditPanel({ audit }: { audit: ReturnType<typeof auditRoiSalaryDefaults> }) {
  return (
    <details className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <summary className="cursor-pointer text-lg font-semibold text-ink">Salary default audit</summary>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        This check lists the salary input status for every pathway and flags duplicate salary defaults.
        Missing rows require a user-entered salary before ROI income and payback outputs are meaningful.
      </p>

      {audit.duplicateWarnings.length > 0 ? (
        <div className="mt-4 rounded-lg border border-coral/30 bg-coral/10 p-4 text-sm leading-6 text-stone-700">
          {audit.duplicateWarnings.map((warning) => (
            <p key={warning.key}>{warning.message}</p>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-leaf/30 bg-leaf/10 p-4 text-sm leading-6 text-stone-700">
          No duplicate numeric salary defaults are currently active across pathways.
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-lg border border-stone-200">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-skywash">
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">Pathway</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">Salary input</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">Employment</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">Later-career / occupation</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">Quality</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">Source / note</th>
            </tr>
          </thead>
          <tbody>
            {audit.rows.map((row) => (
              <tr key={row.pathwayId} className="border-b border-stone-200 last:border-b-0">
                <td className="p-3 font-semibold text-ink">{row.pathwayName}</td>
                <td className="p-3 text-stone-700">
                  {row.value === null ? "Salary assumption needed" : formatCurrency(row.value)}
                </td>
                <td className="p-3 text-stone-700">
                  {row.employmentProbability === null ? "Missing" : formatPercent(row.employmentProbability)}
                </td>
                <td className="p-3 text-stone-700">
                  <p>Later-career: {row.laterCareerSalary === null ? "Missing" : formatCurrency(row.laterCareerSalary)}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-600">
                    JSA occupation median:{" "}
                    {row.occupationMedianSalary === null ? "Missing" : formatCurrency(row.occupationMedianSalary)}
                  </p>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${qualityClasses[row.quality]}`}
                  >
                    {qualityLabels[row.quality]}
                  </span>
                  {row.dataLabel ? (
                    <span
                      className={`ml-2 inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${dataLabelClasses[row.dataLabel]}`}
                    >
                      {row.dataLabel}
                    </span>
                  ) : null}
                </td>
                <td className="p-3 text-stone-700">
                  <p>{row.sourceName ?? "No source attached"}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-600">{row.note}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function getInitialPathwayId(value: string | string[] | undefined) {
  const pathwayId = Array.isArray(value) ? value[0] : value;
  return majors.some((major) => major.id === pathwayId) ? pathwayId! : majors[0].id;
}

function taxResidencyLabel(value: RoiAssumptions["taxResidency"]) {
  if (value === "foreign-resident") {
    return "foreign resident brackets";
  }

  if (value === "simple-effective-rate") {
    return "simple effective rate";
  }

  return "Australian resident brackets";
}
