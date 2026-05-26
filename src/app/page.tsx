"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { useI18n } from "@/lib/i18n";

const highlights = [
  {
    title: "Compare prerequisites and ATAR signals",
    body: "Review university-specific Go8 entries instead of treating one course rule as universal."
  },
  {
    title: "Understand salary, employment, workload, and risks",
    body: "See sourced graduate outcomes, work settings, hours, and practical downside before committing."
  },
  {
    title: "See trade-offs for international students and families",
    body: "Spot pathways where registration, placements, or competitive hiring deserve extra caution."
  },
  {
    title: "Generate a practical pathway shortlist",
    body: "Start with fit, then compare evidence side by side before spending more time or tuition dollars."
  },
  {
    title: "Estimate education ROI",
    body: "Estimate study cost, tax-adjusted income, free cash flow, and payback time under different scenarios."
  }
];

export default function HomePage() {
  const { tx } = useI18n();

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80"
          alt="Students walking through a university campus"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-ink/28" />
        <div className="relative mx-auto flex min-h-[calc(100svh-120px)] max-w-6xl flex-col justify-center px-4 py-14">
          <p className="mb-3 text-sm font-semibold uppercase text-coral">
            {tx("Practical pathway decision tool")}
          </p>
          <h1 className="max-w-4xl text-4xl font-bold text-white sm:text-5xl">
            {tx("Compare Australian university pathways by prerequisites, risk, salary, and career reality.")}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
            {tx("Built for VCE students, international students, and Chinese-speaking families who need a calmer, more analytical way to narrow major choices before applications, tuition commitments, or advice sessions.")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/questionnaire"
              className="rounded-md bg-coral px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-coral/90"
            >
              {tx("Start")}
            </Link>
            <Link
              href="/comparison"
              className="rounded-md border border-white/70 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white hover:text-ink"
            >
              {tx("Compare Majors")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeader
          eyebrow="What it helps with"
          title="Designed for difficult education decisions"
          description="Use the questionnaire to build a shortlist, then compare pathways against the evidence families actually care about: entry barriers, employment, workload, risk, and lifestyle trade-offs."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-lg border border-stone-200 bg-white p-5">
              <span className="mb-4 block h-1.5 w-12 rounded-md bg-leaf" />
              <h3 className="text-base font-semibold text-ink">{tx(item.title)}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-700">{tx(item.body)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid gap-8 rounded-lg border border-stone-200 bg-white p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="How to use this tool"
            title="A simple workflow for a high-stakes choice"
            description="The goal is not to promise a perfect answer. The goal is to help you compare realistic options with clearer evidence and fewer blind spots."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Fill in your subjects, strengths, and preferences",
              "Get a pathway profile and recommendations",
              "Compare majors side by side with source-backed evidence"
            ].map((item, index) => (
              <div key={item} className="rounded-lg bg-stone-50 p-4">
                <p className="text-sm font-semibold text-coral">
                  {tx("Step")} {index + 1}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">{tx(item)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-lg bg-skywash p-5 text-sm leading-6 text-stone-700">
          {tx("Source-backed guidance only. This tool does not provide admission, migration, salary, financial, or career advice.")}
        </div>
      </section>
    </div>
  );
}
