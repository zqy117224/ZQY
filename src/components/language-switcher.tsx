"use client";

import { useI18n, type Language } from "@/lib/i18n";

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "简体中文" }
];

export function LanguageSwitcher() {
  const { language, setLanguage, tx } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-md border border-stone-200 bg-white p-1 text-sm text-stone-700">
      <span className="sr-only">{tx("Language")}</span>
      {languages.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => setLanguage(item.value)}
          className={`rounded px-2 py-1 text-xs font-semibold transition ${
            language === item.value
              ? "bg-ink text-white"
              : "text-stone-600 hover:bg-stone-100 hover:text-ink"
          }`}
          aria-label={tx("Language")}
          aria-pressed={language === item.value}
        >
            {item.label}
        </button>
      ))}
    </div>
  );
}
