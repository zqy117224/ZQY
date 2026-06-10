"use client";

import { scenarioAdjustments } from "@/data/roiDefaults";
import { dataLabelClasses, formatCurrency, getInputMeta, qualityClasses, qualityLabels } from "@/lib/roi";
import { useI18n } from "@/lib/i18n";
import { atoTaxSource } from "@/lib/tax";
import { type PathwayFinancialProfile, type RoiInputKey, type SourceMeta } from "@/types/roi";

type SourceEvidencePanelProps = {
  profile: PathwayFinancialProfile;
};

const fields: { key: RoiInputKey; label: string }[] = [
  { key: "studyYears", label: "Study years" },
  { key: "tuitionPerYear", label: "Tuition per year" },
  { key: "livingCostPerYearWhileStudying", label: "Living cost while studying" },
  { key: "otherStudyCosts", label: "Other study costs" },
  { key: "opportunityCostPerYear", label: "Opportunity cost" },
  { key: "startingSalary", label: "Starting salary" },
  { key: "employmentProbability", label: "Employment probability" },
  { key: "annualLivingCostAfterGraduation", label: "Living cost after graduation" },
  { key: "otherAnnualCostsAfterGraduation", label: "Other annual costs" },
  { key: "fallbackIncomeIfNotEmployed", label: "Fallback income" },
  { key: "simpleEffectiveTaxRate", label: "Simple effective tax rate" }
];

export function SourceEvidencePanel({ profile }: SourceEvidencePanelProps) {
  const { tx } = useI18n();
  const fieldItems = fields.map((field) => ({
    ...field,
    meta: getInputMeta(profile, field.key)
  }));
  const sources = collectSources([
    ...fieldItems.map((item) => item.meta.source),
    profile.laterCareerSalary.source,
    profile.occupationMedianSalary.source,
    atoTaxSource,
    ...scenarioAdjustments.flatMap((scenario) => [
      scenario.salaryMultiplier.source,
      scenario.employmentProbabilityDelta.source,
      scenario.livingCostMultiplier.source
    ])
  ]);

  return (
    <details className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft" open>
      <summary className="cursor-pointer text-lg font-semibold text-ink">{tx("Source evidence and assumptions")}</summary>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        {tx("This panel separates sourced values from assumptions. Replace course fees, living costs, and tax settings with the student's own official offer or advice before relying on the model.")}
      </p>

      <div className="mt-5 grid gap-3">
        {fieldItems.map((item) => (
          <div
            key={item.key}
            className="grid gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm md:grid-cols-[210px_1fr]"
          >
            <div>
              <p className="font-semibold text-ink">{tx(item.label)}</p>
              <span
                className={`mt-2 inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${qualityClasses[item.meta.quality]}`}
              >
                {tx(qualityLabels[item.meta.quality])}
              </span>
              {item.meta.dataLabel ? (
                <span
                  className={`ml-2 mt-2 inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${dataLabelClasses[item.meta.dataLabel]}`}
                >
                  {tx(item.meta.dataLabel)}
                </span>
              ) : null}
            </div>
            <div className="leading-6 text-stone-700">
              <p>{tx(item.meta.note ?? "No source attached")}</p>
              {item.meta.source ? (
                <p className="mt-1">
                  {tx("Source")}:{" "}
                  {item.meta.source.sourceUrl ? (
                    <a
                      href={item.meta.source.sourceUrl}
                      className="text-leaf underline underline-offset-2"
                    >
                      {tx(item.meta.source.sourceName)}
                    </a>
                  ) : (
                    tx(item.meta.source.sourceName)
                  )}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <SalaryReferenceCard title="Later-career scenario salary" value={profile.laterCareerSalary} />
        <SalaryReferenceCard title="JSA occupation median reference" value={profile.occupationMedianSalary} />
      </div>

      {profile.trainingNote ? (
        <div className="mt-6 rounded-lg border border-coral/30 bg-coral/10 p-4 text-sm leading-6 text-stone-700">
          <p className="font-semibold text-ink">{tx("Training and registration scope")}</p>
          <p className="mt-2">{tx(profile.trainingNote)}</p>
          <p className="mt-2">
            {tx("This version calculates university study cost separately from time to registration or full professional practice. Graduate-entry pathways are not modelled.")}
          </p>
        </div>
      ) : null}

      <div className="mt-6">
        <h3 className="text-base font-semibold text-ink">{tx("Sources used")}</h3>
        <div className="mt-3 grid gap-3">
          {sources.map((source) => (
            <div key={`${source.sourceName}-${source.scope}`} className="rounded-lg border border-stone-200 p-4">
              <p className="font-semibold text-ink">
                {source.sourceUrl ? (
                  <a href={source.sourceUrl} className="text-leaf underline underline-offset-2">
                    {tx(source.sourceName)}
                  </a>
                ) : (
                  tx(source.sourceName)
                )}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{tx("Scope")}: {tx(source.scope)}</p>
              <p className="text-sm leading-6 text-stone-700">
                {tx("Date")}: {source.sourceDate ?? source.lastUpdated ?? tx("Not specified")}
              </p>
              {source.note ? <p className="text-sm leading-6 text-stone-700">{tx("Limit")}: {tx(source.note)}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

function SalaryReferenceCard({ title, value }: { title: string; value: PathwayFinancialProfile["laterCareerSalary"] }) {
  const { tx } = useI18n();

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
      <p className="font-semibold text-ink">{tx(title)}</p>
      <span
        className={`mt-2 inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${qualityClasses[value.quality]}`}
      >
        {tx(qualityLabels[value.quality])}
      </span>
      {value.dataLabel ? (
        <span
          className={`ml-2 mt-2 inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${dataLabelClasses[value.dataLabel]}`}
        >
          {tx(value.dataLabel)}
        </span>
      ) : null}
      <p className="mt-3 text-lg font-bold text-ink">
        {value.value === null ? tx("Missing") : formatCurrency(value.value)}
      </p>
      <p className="mt-2">{tx(value.note ?? "No source attached")}</p>
      {value.source ? (
        <p className="mt-1">
          {tx("Source")}:{" "}
          {value.source.sourceUrl ? (
            <a href={value.source.sourceUrl} className="text-leaf underline underline-offset-2">
              {tx(value.source.sourceName)}
            </a>
          ) : (
            tx(value.source.sourceName)
          )}
        </p>
      ) : null}
    </div>
  );
}

function collectSources(sources: Array<SourceMeta | undefined>) {
  const byKey = new Map<string, SourceMeta>();

  for (const source of sources) {
    if (!source) {
      continue;
    }

    byKey.set(`${source.sourceName}-${source.scope}`, source);
  }

  return Array.from(byKey.values());
}
