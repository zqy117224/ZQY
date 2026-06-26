"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/questionnaire", label: "Start" },
  { href: "/comparison", label: "Compare" },
  { href: "/roi", label: "Payback Calculator" },
  { href: "/methodology", label: "Methodology" },
  { href: "/consultation", label: "Consultation" }
];

export function SiteHeader() {
  const { tx } = useI18n();

  return (
    <header className="border-b border-stone-200 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-lg font-bold text-ink">
          {tx("VCE Pathway Compass")}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-stone-700 transition hover:bg-skywash hover:text-ink"
              >
                {tx(item.label)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
