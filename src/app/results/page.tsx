import Link from "next/link";
import { PathwayCard } from "@/components/pathway-card";
import { ProfileSummaryCard } from "@/components/profile-summary-card";
import { RiskBadge } from "@/components/risk-badge";
import { ScoreBar } from "@/components/score-bar";
import { SectionHeader } from "@/components/section-header";
import { SourceNote } from "@/components/source-note";
import { VerdictCard } from "@/components/verdict-card";
import { getRoiProfile } from "@/data/roiDefaults";
import {
  buildProfileSummary,
  collectMainRisks,
  getRecommendations,
  parseQuestionnaireAnswers,
  splitRecommendations,
  type Recommendation,
  type SearchParams
} from "@/lib/recommendations";
import {
  buildInitialAssumptions,
  calculateRoi,
  dataLabelClasses,
  formatCurrency,
  formatPayback,
  formatPercent
} from "@/lib/roi";

export default function ResultsPage({ searchParams }: { searchParams: SearchParams }) {
  const answers = parseQuestionnaireAnswers(searchParams);
  const recommendations = getRecommendations(answers);
  const comparisonIds = recommendations
    .slice(0, 4)
    .map((item) => item.major.id)
    .join(",");
  const profileBullets = buildProfileSummary(answers);
  const grouped = splitRecommendations(recommendations);
  const mainRisks = collectMainRisks(recommendations);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Decision report"
          title="Pathway recommendations and risk signals"
          description="This report combines your answers with sourced Go8 entry information, graduate outcome evidence, and occupation data. Use it to narrow options, then verify details before making a final decision."
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/questionnaire"
            className="rounded-md border border-stone-300 bg-white px-4 py-3 text-center text-sm font-semibold text-ink transition hover:border-leaf hover:text-leaf"
          >
            Change answers
          </Link>
          <Link
            href={`/comparison?majors=${comparisonIds}`}
            className="rounded-md bg-leaf px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-leaf/90"
          >
            Compare shortlist
          </Link>
          <Link
            href={`/roi?pathway=${recommendations[0]?.major.id ?? "computer-science"}`}
            className="rounded-md bg-coral px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-coral/90"
          >
            Open ROI calculator
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ProfileSummaryCard title="Your pathway profile" bullets={profileBullets} />
        <VerdictCard
          title="Important reminder"
          verdict="This is a transparent rules-based tool. It does not provide admission, migration, salary, financial, or career advice, and it should not be treated as a guarantee of course entry or job outcome."
        />
      </div>

      <section className="mt-10">
        <SectionHeader
          title="Top recommended pathways"
          description="These pathways currently look most aligned with your subjects, priorities, and work preferences."
        />
        <div className="mt-6 grid gap-5">
          {grouped.top.map((recommendation) => (
            <DecisionPathwayCard key={recommendation.major.id} recommendation={recommendation} />
          ))}
        </div>
      </section>

      {grouped.caution.length > 0 ? (
        <section className="mt-12">
          <SectionHeader
            title="Good options, but with caution"
            description="These pathways still have upside, but one or more trade-offs deserve closer attention."
          />
          <div className="mt-6 grid gap-5">
            {grouped.caution.map((recommendation) => (
              <DecisionPathwayCard key={recommendation.major.id} recommendation={recommendation} />
            ))}
          </div>
        </section>
      ) : null}

      {grouped.lowerPriority.length > 0 ? (
        <section className="mt-12">
          <SectionHeader
            title="Probably not first-choice options"
            description="These pathways may still be viable, but the current fit signals are weaker than your top shortlist."
          />
          <div className="mt-6 grid gap-5">
            {grouped.lowerPriority.map((recommendation) => (
              <DecisionPathwayCard key={recommendation.major.id} recommendation={recommendation} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeader
            title="Main risks to think about"
            description="These risks appeared repeatedly across the pathways in your shortlist."
          />
          <div className="mt-5 grid gap-3">
            {mainRisks.map((risk) => (
              <VerdictCard key={risk} title="Risk to pressure-test" verdict={risk} tone="caution" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-ink">How to use this report well</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
            <li>Use fit scores to narrow the field, not to choose blindly.</li>
            <li>Compare the top shortlist against ATAR signals, workload, and risk notes.</li>
            <li>Open the Go8 and occupation sources before making a high-cost education decision.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function DecisionPathwayCard({ recommendation }: { recommendation: Recommendation }) {
  const { major } = recommendation;
  const firstEntry = major.go8Entries[0];
  const roiProfile = getRoiProfile(major.id);
  const roiCalculation = calculateRoi(buildInitialAssumptions(roiProfile));
  const hasSalaryDefault = roiProfile.startingSalary.value !== null;
  const hasTuitionDefault = roiProfile.tuitionPerYear.value !== null;
  const evidence = [
    major.graduateOutcomes.salaryRange,
    major.graduateOutcomes.employmentOutlook,
    firstEntry
      ? `${firstEntry.university}: ${firstEntry.atarValue} (${firstEntry.atarType})`
      : "Course entry rows have not been added for this pathway yet; verify prerequisites on official university pages."
  ];

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <PathwayCard
        title={major.name}
        verdict={recommendation.verdict}
        score={recommendation.score}
        upside={recommendation.upside}
        risk={recommendation.risk}
        bestFor={recommendation.bestFor}
        notIdealIf={recommendation.notIdealIf}
      />

      <div className="mt-5 rounded-lg border border-leaf/20 bg-leaf/10 p-4">
        <h3 className="text-sm font-semibold text-ink">Summary</h3>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          {buildPlainEnglishVerdict(recommendation)}
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <h3 className="text-sm font-semibold text-ink">Why it fits</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
            {recommendation.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>

          <h3 className="mt-5 text-sm font-semibold text-ink">Key evidence from existing data</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
            {evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap gap-2">
              <RiskBadge label="Risk" level={major.scoringProfile.riskLevel as 1 | 2 | 3 | 4 | 5} />
              <RiskBadge
                label="Competition"
                level={major.scoringProfile.competitionLevel as 1 | 2 | 3 | 4 | 5}
              />
              <RiskBadge
                label="Salary"
                level={major.scoringProfile.salaryPotential as 1 | 2 | 3 | 4 | 5}
              />
            </div>
            <div className="mt-4 space-y-3">
              <ScoreBar label="Maths / physics fit" score={major.scoringProfile.mathsPhysicsFit} />
              <ScoreBar label="Coding intensity" score={major.scoringProfile.codingIntensity} tone="ink" />
              <ScoreBar
                label="Work-life balance"
                score={major.scoringProfile.workLifeBalance}
                tone="coral"
              />
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-ink">Go8 snapshot</h3>
            <div className="mt-3 space-y-3">
              {major.go8Entries.slice(0, 2).map((entry) => (
                <div key={`${entry.university}-${entry.courseName}`} className="rounded-md bg-stone-50 p-3 text-sm leading-6 text-stone-700">
                  <p className="font-semibold text-ink">{entry.university}</p>
                  <p>{entry.courseName}</p>
                  <p>
                    ATAR signal: {entry.atarValue} ({entry.atarType})
                  </p>
                  <p>Requirement type: {entry.requirementType}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-stone-200 bg-skywash p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">Default ROI snapshot</h3>
            <p className="mt-1 text-sm leading-6 text-stone-700">
              Uses the calculator&apos;s current source-backed and editable default inputs. Treat this as a rough planning signal.
            </p>
          </div>
          <Link
            href={`/roi?pathway=${major.id}`}
            className="w-fit rounded-md bg-coral px-4 py-3 text-sm font-semibold text-white transition hover:bg-coral/90"
          >
            Open advanced ROI calculator
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RoiMiniMetric
            label="Study years"
            value={
              roiProfile.studyYears.value !== null
                ? `${roiProfile.studyYears.value.toLocaleString("en-AU")} years`
                : "Duration assumption needed"
            }
          />
          <RoiMiniMetric
            label="Graduate salary"
            value={
              roiProfile.startingSalary.value !== null
                ? formatCurrency(roiProfile.startingSalary.value)
                : "Salary assumption needed"
            }
          />
          <RoiMiniMetric
            label="Occupation median"
            value={
              roiProfile.occupationMedianSalary.value !== null
                ? formatCurrency(roiProfile.occupationMedianSalary.value)
                : "Occupation salary needed"
            }
          />
          <RoiMiniMetric
            label="Employment rate"
            value={
              roiProfile.employmentProbability.value !== null
                ? formatPercent(roiProfile.employmentProbability.value)
                : "Employment assumption needed"
            }
          />
          <RoiMiniMetric
            label="University study cost"
            value={hasTuitionDefault ? formatCurrency(roiCalculation.totalStudyCost) : "Tuition assumption needed"}
          />
          <RoiMiniMetric
            label="After-tax income"
            value={hasSalaryDefault ? formatCurrency(roiCalculation.afterTaxIncome) : "Salary assumption needed"}
          />
          <RoiMiniMetric
            label="Free cash flow"
            value={hasSalaryDefault ? formatCurrency(roiCalculation.annualFreeCashFlow) : "Salary assumption needed"}
          />
          <RoiMiniMetric
            label="ROI status"
            value={
              !hasTuitionDefault
                ? "Payback unavailable — tuition assumption needed."
                : hasSalaryDefault
                ? formatPayback(
                    roiCalculation.riskAdjustedPaybackPeriodYears,
                    "Not recovered after risk adjustment."
                  )
                : "Salary assumption needed"
            }
          />
        </div>
        <p className="mt-3 text-xs leading-5 text-stone-600">
          {roiProfile.startingSalary.dataLabel ? (
            <span
              className={`mr-2 inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${dataLabelClasses[roiProfile.startingSalary.dataLabel]}`}
            >
              {roiProfile.startingSalary.dataLabel}
            </span>
          ) : null}
          Salary basis: {roiProfile.startingSalary.note}
        </p>
        <p className="mt-1 text-xs leading-5 text-stone-600">
          {roiProfile.laterCareerSalary.dataLabel ? (
            <span
              className={`mr-2 inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${dataLabelClasses[roiProfile.laterCareerSalary.dataLabel]}`}
            >
              {roiProfile.laterCareerSalary.dataLabel}
            </span>
          ) : null}
          Later-career reference: {roiProfile.laterCareerSalary.note}
        </p>
        {roiProfile.trainingNote ? (
          <p className="mt-2 rounded-md border border-coral/30 bg-coral/10 p-3 text-xs leading-5 text-stone-700">
            Registration/training warning: {roiProfile.trainingNote} This version models high-school direct-entry pathways only, not graduate-entry pathways.
          </p>
        ) : null}
      </div>

      <div className="mt-5 rounded-lg border border-stone-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-ink">Warnings you should not ignore</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
          {recommendation.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <SourceNote
          title="Go8 entry sources"
          sources={major.go8Entries.map((entry) => ({
            label: `${entry.university} - ${entry.courseName}`,
            url: entry.sourceLink,
            lastUpdated: entry.lastChecked,
            note: `${entry.atarType}; requirement type: ${entry.requirementType}. ${entry.notes}`
          }))}
          compact
        />
        <SourceNote
          title="Graduate and occupation sources"
          sources={[...major.graduateOutcomes.sources, ...major.occupationOutcomes.sources]}
          compact
        />
      </div>
    </div>
  );
}

function RoiMiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase text-stone-500">{label}</p>
      <p className="mt-2 text-base font-bold text-ink">{value}</p>
    </div>
  );
}

function buildPlainEnglishVerdict(recommendation: Recommendation) {
  const { major, score } = recommendation;

  if (score >= 85) {
    return `${major.name} looks like a strong fit, but the main risk is still worth checking before you commit.`;
  }

  if (score >= 70) {
    return `${major.name} is plausible, but it should be compared carefully against stronger-fit options.`;
  }

  return `${major.name} may be worth reading about, but it probably should not be your first shortlist option yet.`;
}
