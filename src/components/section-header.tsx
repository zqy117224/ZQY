"use client";

import { useI18n } from "@/lib/i18n";

export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const { tx } = useI18n();

  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase text-coral">{tx(eyebrow)}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{tx(title)}</h2>
      {description ? (
        <p className="mt-3 leading-7 text-stone-700">{tx(description)}</p>
      ) : null}
    </div>
  );
}
