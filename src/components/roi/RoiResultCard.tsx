"use client";

import { type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

type RoiResultCardProps = {
  title: string;
  value: ReactNode;
  note: string;
  tone?: "default" | "warning";
};

export function RoiResultCard({ title, value, note, tone = "default" }: RoiResultCardProps) {
  const { tx } = useI18n();
  const displayValue = typeof value === "string" ? tx(value) : value;

  return (
    <div
      className={
        tone === "warning"
          ? "rounded-lg border border-coral/30 bg-coral/10 p-5"
          : "rounded-lg border border-stone-200 bg-white p-5 shadow-soft"
      }
    >
      <p className="text-sm font-semibold text-stone-600">{tx(title)}</p>
      <p className="mt-3 text-2xl font-bold text-ink">{displayValue}</p>
      <p className="mt-3 text-sm leading-6 text-stone-700">{tx(note)}</p>
    </div>
  );
}
