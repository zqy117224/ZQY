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
      "International student tuition fees at Australian universities have risen at an average of ~5.1% per annum between 2018 and 2025 (Studymove, 2025), representing a real escalation of approximately 2% above CPI. This model applies 5% annual tuition escalation for the full duration of the degree."
  },
  {
    title: "Living Costs",
    body:
      "Living costs represent the full opportunity cost of funds remitted to Australia, not an incremental cost above domestic alternatives. The comparison in this model is studying abroad versus investing the same capital; therefore all Australian living expenditure is included. The default figure of AUD 40,000 reflects typical international student expenditure in Melbourne (shared housing, self-catering). The visa financial requirement of AUD 29,710 is a government administrative threshold and does not reflect realistic student expenditure."
  },
  {
    title: "Salary Data",
    body:
      "Graduate salary figures are sourced from QILT (Quality Indicators for Learning and Teaching) median salary data. Occupational salary benchmarks are drawn from JSA (Jobs and Skills Australia) occupational median earnings. Employment probability is adjusted using QILT full-time employment rates by field of study."
  },
  {
    title: "Limitations",
    body:
      "1. This model assumes zero real wage growth for graduates, consistent with recent Australian labour market conditions. If real wage growth resumes, payback outputs will improve. 2. Exchange rate risk (AUD/CNY) is not modeled. 3. Non-financial returns (network, immigration pathways, credential signalling) are excluded by design. 4. All figures are in real (inflation-adjusted) AUD unless otherwise stated."
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
