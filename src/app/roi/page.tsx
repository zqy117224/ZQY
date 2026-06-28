"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { useI18n } from "@/lib/i18n";
import { type RoiAssumptions, type RoiInputKey } from "@/types/roi";

type RoiPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function RoiPage({ searchParams }: RoiPageProps) {
  const { tx } = useI18n();
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
  const tuitionAssumptionNeeded = profile.tuitionPerYear.value === null && assumptions.tuitionPerYear <= 0;
  const salaryAudit = useMemo(() => auditRoiSalaryDefaults(), []);

  useEffect(() => {
    setPathwayId(initialPathwayId);
    setAssumptions(buildInitialAssumptions(getRoiProfile(initialPathwayId)));
  }, [initialPathwayId]);

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
          title="Education Payback Calculator"
          description="Estimate study cost, after-tax income, free cash flow, and payback time using source-backed data and editable assumptions."
        />
        <Link
          href={`/comparison?majors=${pathwayId}`}
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-center text-sm font-semibold text-ink transition hover:border-leaf hover:text-leaf"
        >
          {tx("Compare this pathway")}
        </Link>
      </div>

      <div className="mb-8 rounded-lg border border-coral/30 bg-coral/10 p-5 text-sm leading-7 text-stone-700">
        <p className="font-semibold text-ink">{tx("Financial scope only")}</p>
        <p className="mt-1">
          {tx("This model does not place a monetary value on migration pathways, professional networks, credential signalling, or personal value. Treat the result as a financial-only estimate, not the complete value of studying in Australia.")}
        </p>
      </div>

      <div className="mb-8 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <label className="block">
          <span className="field-label">{tx("Pathway selector")}</span>
          <select
            className="input-box mt-2"
            value={pathwayId}
            onChange={(event) => handlePathwayChange(event.target.value)}
          >
            {majors.map((major) => (
              <option key={major.id} value={major.id}>
                {tx(major.name)}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          {tx(selectedMajor.summary)} {tx("Defaults use pathway-specific salary evidence where available, representative Monash course fee or duration data where sourced, and clearly labelled assumptions or missing states where no reliable pathway-specific salary default is available.")}
        </p>
        {profile.trainingNote ? (
          <div className="mt-4 rounded-lg border border-coral/30 bg-coral/10 p-4 text-sm leading-6 text-stone-700">
            <p className="font-semibold text-ink">{tx("Training and registration warning")}</p>
            <p className="mt-1">{tx(profile.trainingNote)}</p>
            <p className="mt-1">
              {tx("This version calculates high-school direct-entry pathways only. Graduate-entry pathways are not modelled.")}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <TrainingFact label="University study cost period" value={tx(`${profile.studyYears.value ?? "?"} years`)} />
              <TrainingFact
                label={
                  profile.professionalPathwayYears
                    ? "Professional pathway"
                    : "Time to general registration"
                }
                value={tx(formatProfessionalTime(profile))}
              />
              <TrainingFact
                label="Registration"
                value={profile.registrationRequired ? tx("Required for practice") : tx("Check pathway requirements")}
              />
            </div>
          </div>
        ) : null}
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
              title="Compounded study cost"
              value={tuitionAssumptionNeeded ? tx("Tuition assumption needed") : formatCurrency(calculation.totalStudyCost)}
              note="Tuition and study-period living costs are compounded to graduation using the model return rate."
              tone={tuitionAssumptionNeeded ? "warning" : "default"}
            />
            <RoiResultCard
              title="Estimated after-tax income"
              value={salaryAssumptionNeeded ? tx("Salary assumption needed") : formatCurrency(calculation.afterTaxIncome)}
              note={
                salaryAssumptionNeeded
                  ? "Enter a pathway-specific salary before using income, free cash flow, or payback outputs."
                  : `Tax model: ${taxResidencyLabel(assumptions.taxResidency)}. Salary data label: ${profile.startingSalary.dataLabel ?? "not labelled"}.`
              }
              tone={salaryAssumptionNeeded ? "warning" : "default"}
            />
            <RoiResultCard
              title="Annual free cash flow"
              value={salaryAssumptionNeeded ? tx("Salary assumption needed") : formatCurrency(calculation.annualFreeCashFlow)}
              note="After-tax income minus annual living costs and other annual costs."
              tone={salaryAssumptionNeeded || calculation.annualFreeCashFlow <= 0 ? "warning" : "default"}
            />
            <RoiResultCard
              title="Risk-adjusted payback"
              value={
                salaryAssumptionNeeded
                  ? tx("Salary assumption needed")
                  : tuitionAssumptionNeeded
                    ? tx("Payback unavailable — tuition assumption needed.")
                  : formatPayback(
                      calculation.riskAdjustedPaybackPeriodYears,
                      tx("Not recovered after risk adjustment.")
                    )
              }
              note="The study-cost balance keeps compounding each year, then risk-adjusted free cash flow is used to reduce it until recovered."
              tone={salaryAssumptionNeeded || tuitionAssumptionNeeded || calculation.riskAdjustedPaybackPeriodYears === null ? "warning" : "default"}
            />
            <EmploymentRatePanel value={assumptions.employmentProbability} />
            <RoiResultCard
              title="10-year risk-adjusted free cash flow"
              value={
                salaryAssumptionNeeded
                  ? tx("Salary assumption needed")
                  : formatCurrency(calculation.riskAdjustedCumulativeFreeCashFlow10Years)
              }
              note="Uses the same employment-probability adjustment as payback. Saved cash flow compounds at the model return rate, and the editable salary horizon controls progress toward the occupation median."
              tone={salaryAssumptionNeeded ? "warning" : "default"}
            />
          </div>

          <div className="rounded-lg border border-stone-200 bg-skywash p-5 text-sm leading-6 text-stone-700">
            {tx("This tool is for education planning only. It is not financial, tax, migration, admissions, or career advice. Outcomes vary by individual, visa status, labour market conditions, and location.")}
          </div>
        </div>
      </div>

      <section className="mt-10">
        {salaryAssumptionNeeded || tuitionAssumptionNeeded ? (
          <div className="rounded-lg border border-coral/30 bg-coral/10 p-5 text-sm leading-6 text-stone-700">
            <h2 className="text-lg font-semibold text-ink">{tx("Scenario comparison needs more inputs")}</h2>
            <p className="mt-2">
              {salaryAssumptionNeeded
                ? tx("Enter a salary in the income panel. ")
                : ""}
              {tuitionAssumptionNeeded
                ? tx("Payback unavailable — tuition assumption needed. Enter annual tuition before using study cost, payback, and scenario outputs. ")
                : ""}
              {tx("This version models high-school direct-entry pathways only, not graduate-entry pathways.")}
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

function TrainingFact({ label, value }: { label: string; value: string }) {
  const { tx } = useI18n();

  return (
    <div className="rounded-md bg-white p-3">
      <p className="text-xs font-semibold uppercase text-stone-500">{tx(label)}</p>
      <p className="mt-1 font-semibold text-ink">{tx(value)}</p>
    </div>
  );
}

function EmploymentRatePanel({ value }: { value: number }) {
  const { tx } = useI18n();
  const boundedValue = Math.min(1, Math.max(0, value));
  const isLow = boundedValue < 0.6;
  const isMedium = boundedValue >= 0.6 && boundedValue < 0.8;
  const showWarning = isLow || isMedium;
  const classes = isLow
    ? "border-red-300 bg-red-50 text-red-700"
    : isMedium
      ? "border-amber-300 bg-amber-50 text-amber-700"
      : "border-leaf/30 bg-leaf/10 text-leaf";

  return (
    <div
      className={`rounded-lg border p-4 ${classes}`}
      title={
        isLow
          ? tx("Less than 60% of graduates secure full-time employment (QILT). This significantly extends the real payback period.")
          : undefined
      }
    >
      <p className="text-xs font-semibold uppercase">{tx("QILT full-time employment rate")}</p>
      <p className="mt-1 text-2xl font-bold">
        {showWarning ? "⚠️ " : ""}
        {formatPercent(boundedValue)}
      </p>
      <p className="mt-1 text-xs leading-5">
        {tx("Shown separately because employment risk is one of the biggest drivers of payback time.")}
      </p>
    </div>
  );
}

function formatProfessionalTime(profile: ReturnType<typeof getRoiProfile>) {
  if (profile.professionalPathwayLabel) {
    return profile.professionalPathwayLabel;
  }

  if (profile.professionalPathwayYears?.value) {
    return `${profile.professionalPathwayYears.value} years`;
  }

  if (profile.yearsToGeneralRegistration?.value) {
    return `${profile.yearsToGeneralRegistration.value} years`;
  }

  return "Not separately modelled";
}

function SalaryAuditPanel({ audit }: { audit: ReturnType<typeof auditRoiSalaryDefaults> }) {
  const { tx } = useI18n();

  return (
    <details className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <summary className="cursor-pointer text-lg font-semibold text-ink">{tx("Salary default audit")}</summary>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        {tx("This check lists the salary input status for every pathway and flags duplicate salary defaults. Missing rows require a user-entered salary before income and payback outputs are meaningful.")}
      </p>

      {audit.duplicateWarnings.length > 0 ? (
        <div className="mt-4 rounded-lg border border-coral/30 bg-coral/10 p-4 text-sm leading-6 text-stone-700">
          {audit.duplicateWarnings.map((warning) => (
            <p key={warning.key}>{tx(warning.message)}</p>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-leaf/30 bg-leaf/10 p-4 text-sm leading-6 text-stone-700">
          {tx("No duplicate numeric salary defaults are currently active across pathways.")}
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-lg border border-stone-200">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-skywash">
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">{tx("Pathway")}</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">{tx("Salary input")}</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">{tx("Employment")}</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">{tx("Later-career / occupation")}</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">{tx("Quality")}</th>
              <th className="border-b border-stone-200 p-3 font-semibold text-ink">{tx("Source / note")}</th>
            </tr>
          </thead>
          <tbody>
            {audit.rows.map((row) => (
              <tr key={row.pathwayId} className="border-b border-stone-200 last:border-b-0">
                <td className="p-3 font-semibold text-ink">{tx(row.pathwayName)}</td>
                <td className="p-3 text-stone-700">
                  {row.value === null ? tx("Salary assumption needed") : formatCurrency(row.value)}
                </td>
                <td className="p-3 text-stone-700">
                  {row.employmentProbability === null ? tx("Missing") : formatPercent(row.employmentProbability)}
                </td>
                <td className="p-3 text-stone-700">
                  <p>{tx("Later-career")}: {row.laterCareerSalary === null ? tx("Missing") : formatCurrency(row.laterCareerSalary)}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-600">
                    {tx("JSA occupation median")}:{" "}
                    {row.occupationMedianSalary === null ? tx("Missing") : formatCurrency(row.occupationMedianSalary)}
                  </p>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${qualityClasses[row.quality]}`}
                  >
                    {tx(qualityLabels[row.quality])}
                  </span>
                  {row.dataLabel ? (
                    <span
                      className={`ml-2 inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${dataLabelClasses[row.dataLabel]}`}
                    >
                      {tx(row.dataLabel)}
                    </span>
                  ) : null}
                </td>
                <td className="p-3 text-stone-700">
                  <p>{row.sourceName ? tx(row.sourceName) : tx("No source attached")}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-600">{tx(row.note ?? "No source attached")}</p>
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
