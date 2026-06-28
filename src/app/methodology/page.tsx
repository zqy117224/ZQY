"use client";

import { SectionHeader } from "@/components/section-header";
import { useI18n } from "@/lib/i18n";
import { ROI_CONFIG } from "@/lib/roiConfig";
import { formatPercent } from "@/lib/roi";

const sections = [
  {
    title: "Opportunity Cost Rate",
    body:
      "This model uses a 7% real annual return as the opportunity cost baseline, representing the S&P 500 inflation-adjusted historical return (1928-2024, including dividend reinvestment). A real rate is used because Australian graduate real wage growth has been approximately zero in recent years, making a nominal-vs-nominal comparison misleading. Using the nominal rate (~10%) instead would improve payback outputs by approximately 2-3 percentage points per year."
  },
  {
    title: "Tuition Fee Escalation",
    body:
      "International student tuition fees at Australian universities rose by about 5.1% per year in nominal terms between 2018 and 2025 (Studymove, 2025). Because this is a real model, it uses 2% annual tuition escalation above inflation for the full duration of the degree."
  },
  {
    title: "Living Costs",
    body:
      "Living costs represent the full opportunity cost of funds remitted to Australia, not an incremental cost above domestic alternatives. The comparison in this model is studying abroad versus investing the same capital; therefore all Australian living expenditure is included. The default figure of AUD 40,000 reflects typical international student expenditure in Melbourne (shared housing, self-catering). The visa financial requirement of AUD 29,710 is a government administrative threshold and does not reflect realistic student expenditure."
  },
  {
    title: "Salary Data",
    body:
      "Graduate salary figures are sourced from QILT median salary data. Occupational salary benchmarks are drawn from JSA occupation median earnings. Employment probability uses QILT full-time employment rates by field of study. The time taken to move from graduate salary to the occupation median is a user-editable modelling assumption, not a sourced forecast; the default is 10 years."
  },
  {
    title: "Limitations",
    body:
      "1. This model assumes zero real wage growth after reaching the occupation median. 2. Exchange rate risk (AUD/CNY) is not modelled. 3. Migration pathways, professional networks, credential signalling, and personal value are not assigned a monetary value. 4. Modelled cash flows use real (inflation-adjusted) rates; source values retain their stated source-year scope."
  }
];

export default function MethodologyPage() {
  const { tx } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionHeader
        eyebrow="Methodology"
        title="How the payback model works"
        description="The calculator is a planning model, not financial advice. These assumptions make the comparison explicit so families can edit inputs instead of treating outputs as predictions."
      />

      <div className="mt-6 rounded-lg border border-coral/30 bg-coral/10 p-5 text-sm leading-7 text-stone-700">
        <p className="font-semibold text-ink">{tx("Financial scope only")}</p>
        <p className="mt-1">
          {tx("This model does not place a monetary value on migration pathways, professional networks, credential signalling, or personal value. Treat the result as a financial-only estimate, not the complete value of studying in Australia.")}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MethodMetric label="Opportunity cost rate" value={formatPercent(ROI_CONFIG.opportunityCostRate)} />
        <MethodMetric label="Tuition escalation" value={formatPercent(ROI_CONFIG.tuitionEscalationRate)} />
        <MethodMetric label="Living cost escalation" value={formatPercent(ROI_CONFIG.livingCostEscalationRate)} />
      </div>

      <div className="mt-8 space-y-5">
        {sections.map((section) => (
          <section key={section.title} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">{tx(section.title)}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-700">{tx(section.body)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

function MethodMetric({ label, value }: { label: string; value: string }) {
  const { tx } = useI18n();

  return (
    <div className="rounded-lg border border-stone-200 bg-skywash p-4">
      <p className="text-xs font-semibold uppercase text-stone-500">{tx(label)}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
