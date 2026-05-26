"use client";

import { findAssumptionWarnings, qualityClasses, qualityLabels } from "@/lib/roi";
import { useI18n } from "@/lib/i18n";
import { type PathwayFinancialProfile } from "@/types/roi";

type AssumptionNoticeProps = {
  profile: PathwayFinancialProfile;
};

export function AssumptionNotice({ profile }: AssumptionNoticeProps) {
  const { tx } = useI18n();
  const warnings = findAssumptionWarnings(profile);

  if (warnings.length === 0) {
    return null;
  }

  const shownWarnings = warnings.slice(0, 5);

  return (
    <div className="rounded-lg border border-coral/30 bg-coral/10 p-5 text-sm leading-6 text-stone-700">
      <h2 className="text-base font-semibold text-ink">{tx("Assumption warning")}</h2>
      <p className="mt-2">
        {tx("Some values are assumptions, so this result should be treated as a rough model, not a prediction.")}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {shownWarnings.map(({ field, meta }) => (
          <span
            key={field}
            className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${qualityClasses[meta.quality]}`}
          >
            {tx(field)}: {tx(qualityLabels[meta.quality])}
          </span>
        ))}
      </div>
    </div>
  );
}
