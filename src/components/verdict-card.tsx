"use client";

import { useI18n } from "@/lib/i18n";

export function VerdictCard({
  title,
  verdict,
  tone = "neutral"
}: {
  title: string;
  verdict: string;
  tone?: "positive" | "caution" | "neutral";
}) {
  const toneClass =
    tone === "positive"
      ? "border-leaf/20 bg-leaf/5"
      : tone === "caution"
        ? "border-coral/20 bg-coral/5"
        : "border-stone-200 bg-white";
  const { tx } = useI18n();

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <p className="text-sm font-semibold text-ink">{tx(title)}</p>
      <p className="mt-2 text-sm leading-6 text-stone-700">{tx(verdict)}</p>
    </div>
  );
}
