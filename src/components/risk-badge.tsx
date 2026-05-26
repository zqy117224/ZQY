"use client";

import { useI18n } from "@/lib/i18n";

export function RiskBadge({
  label,
  level
}: {
  label: string;
  level: 1 | 2 | 3 | 4 | 5;
}) {
  const tone =
    level >= 4
      ? "bg-coral/12 text-coral border-coral/20"
      : level === 3
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-leaf/10 text-leaf border-leaf/20";
  const { tx } = useI18n();

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${tone}`}>
      {tx(label)}: {level}/5
    </span>
  );
}
