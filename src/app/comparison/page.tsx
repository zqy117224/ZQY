import type { ReactNode } from "react";
import Link from "next/link";
import { PathwayCard } from "@/components/pathway-card";
import { RiskBadge } from "@/components/risk-badge";
import { ScoreBar } from "@/components/score-bar";
import { SectionHeader } from "@/components/section-header";
import { SourceNote } from "@/components/source-note";
import { majors, type Major } from "@/data/majors";
import { getRoiProfile } from "@/data/roiDefaults";
import { formatCurrency, formatPercent, qualityLabels } from "@/lib/roi";
import { type SearchParams } from "@/lib/recommendations";
import { type SourcedNumber } from "@/types/roi";

const defaultMajorIds = [
  "computer-science",
  "software-engineering",
  "statistics-data-science",
  "finance",
  "nursing"
];

const comparisonRows: {
  label: string;
  getValue: (major: Major) => ReactNode;
}[] = [
  {
    label: "Go8 entries",
    getValue: (major) =>
      major.go8Entries.map((entry) => (
        <div key={`${major.id}-${entry.university}`} className="mb-4 last:mb-0">
          <p className="font-semibold text-ink">{entry.university}</p>
          <p>{entry.courseName}</p>
          <p>
            <span className="font-semibold">ATAR:</span> {entry.atarValue} ({entry.atarType}, {entry.year})
          </p>
          <p>
            <span className="font-semibold">Requirement type:</span> {entry.requirementType}
          </p>
          <ul className="mt-1 list-inside list-disc">
            {entry.subjectRequirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
          <p className="mt-1">{entry.notes}</p>
          <a href={entry.sourceLink} className="text-leaf underline underline-offset-2">
            Source checked {entry.lastChecked}
          </a>
        </div>
      ))
  },
  {
    label: "Graduate roles",
    getValue: (major) => major.graduateOutcomes.typicalGraduateRoles.join(", ")
  },
  { label: "Graduate salary evidence", getValue: (major) => major.graduateOutcomes.salaryRange },
  {
    label: "ROI calculator defaults",
    getValue: (major) => {
      const profile = getRoiProfile(major.id);

      return (
        <div className="space-y-2">
          <p>Study years: {formatSourcedNumber(profile.studyYears)}</p>
          <p>Tuition per year: {formatSourcedNumber(profile.tuitionPerYear)}</p>
          <p>Starting salary: {formatSourcedNumber(profile.startingSalary, "salary")}</p>
          <p>Later-career salary reference: {formatSourcedNumber(profile.laterCareerSalary, "salary")}</p>
          <p>Employment probability: {formatSourcedNumber(profile.employmentProbability)}</p>
          <Link href={`/roi?pathway=${major.id}`} className="inline-block text-leaf underline underline-offset-2">
            Open ROI calculator
          </Link>
        </div>
      );
    }
  },
  { label: "Employment outlook", getValue: (major) => major.graduateOutcomes.employmentOutlook },
  {
    label: "Further study common?",
    getValue: (major) => (major.graduateOutcomes.furtherStudyCommon ? "Yes" : "Not usually")
  },
  {
    label: "Related occupations",
    getValue: (major) => major.occupationOutcomes.relatedOccupations.join(", ")
  },
  { label: "Work style", getValue: (major) => major.occupationOutcomes.workStyle },
  { label: "Working hours", getValue: (major) => major.occupationOutcomes.workingHours },
  { label: "Job environment", getValue: (major) => major.occupationOutcomes.jobEnvironment },
  { label: "Typical tasks", getValue: (major) => major.occupationOutcomes.typicalTasks },
  { label: "Trade-offs", getValue: (major) => major.occupationOutcomes.tradeOffs },
  { label: "Risk notes", getValue: (major) => major.occupationOutcomes.riskNotes }
];

export default function ComparisonPage({ searchParams }: { searchParams: SearchParams }) {
  const selectedIds = getSelectedMajorIds(searchParams);
  const selectedMajors = majors.filter((major) => selectedIds.includes(major.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeader
        eyebrow="Comparison"
        title="Compare shortlisted pathways at two levels"
        description="Use the summary layer first for quick judgement, then open the detailed evidence table when you want to pressure-test the shortlist."
      />

      <form action="/comparison" className="card mt-8">
        <h2 className="text-xl font-semibold text-ink">Choose majors</h2>
        <p className="mt-2 field-help">
          Fewer columns are easier to read on mobile and make trade-offs clearer.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {majors.map((major) => (
            <label
              key={major.id}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                name="majors"
                value={major.id}
                defaultChecked={selectedIds.includes(major.id)}
              />
              <span>{major.name}</span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="mt-5 rounded-md bg-leaf px-5 py-3 text-sm font-semibold text-white transition hover:bg-leaf/90"
        >
          Update comparison
        </button>
      </form>

      <section className="mt-10">
        <SectionHeader
          title="Quick comparison summary"
          description="Use this layer to see whether a major is technically demanding, lifestyle-heavy, high-risk, or attractive mainly for income."
        />
        <div className="mt-6 grid gap-5">
          {selectedMajors.map((major) => (
            <MajorSummaryCard key={major.id} major={major} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <details className="rounded-lg border border-stone-200 bg-white p-5" open>
          <summary className="cursor-pointer text-lg font-semibold text-ink">
            Detailed comparison table
          </summary>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            This layer keeps the raw evidence visible when you need depth. On small screens, scroll horizontally and focus on two or three majors at a time.
          </p>
          <div className="mt-6 overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-soft">
            <table className="min-w-[980px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-skywash">
                  <th className="w-52 border-b border-stone-200 p-4 font-semibold text-ink">
                    Criteria
                  </th>
                  {selectedMajors.map((major) => (
                    <th key={major.id} className="border-b border-stone-200 p-4 font-semibold text-ink">
                      {major.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-stone-200 last:border-b-0">
                    <th className="bg-stone-50 p-4 align-top font-semibold text-ink">{row.label}</th>
                    {selectedMajors.map((major) => (
                      <td key={`${major.id}-${row.label}`} className="max-w-xs p-4 align-top text-stone-700">
                        {row.getValue(major)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
    </div>
  );
}

function MajorSummaryCard({ major }: { major: Major }) {
  const roiProfile = getRoiProfile(major.id);

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <PathwayCard
        title={major.name}
        verdict={`${major.name}: ${major.occupationOutcomes.tradeOffs}`}
        score={buildSummaryScore(major)}
        upside={major.occupationOutcomes.tradeOffs}
        risk={major.occupationOutcomes.riskNotes}
        bestFor={buildBestFor(major)}
        notIdealIf={buildNotIdealIf(major)}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
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
            <ScoreBar label="Math / physics fit" score={major.scoringProfile.mathsPhysicsFit} />
            <ScoreBar label="Coding intensity" score={major.scoringProfile.codingIntensity} tone="ink" />
            <ScoreBar label="Work-life balance" score={major.scoringProfile.workLifeBalance} tone="coral" />
            <ScoreBar label="Competition" score={major.scoringProfile.competitionLevel} tone="coral" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
            <p className="font-semibold text-ink">Main trade-off</p>
            <p className="mt-2">{major.occupationOutcomes.tradeOffs}</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
            <p className="font-semibold text-ink">Main warning</p>
            <p className="mt-2">{major.occupationOutcomes.riskNotes}</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
            <p className="font-semibold text-ink">Financial defaults</p>
            <p className="mt-2">Study years: {formatSourcedNumber(roiProfile.studyYears)}</p>
            <p>Tuition per year: {formatSourcedNumber(roiProfile.tuitionPerYear)}</p>
            <p>Starting salary: {formatSourcedNumber(roiProfile.startingSalary, "salary")}</p>
            <p>Later-career salary reference: {formatSourcedNumber(roiProfile.laterCareerSalary, "salary")}</p>
            <Link href={`/roi?pathway=${major.id}`} className="mt-2 inline-block text-leaf underline underline-offset-2">
              Open ROI calculator
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-ink">Go8 course rows</h3>
          <div className="mt-3 space-y-3">
            {major.go8Entries.map((entry) => (
              <div key={`${entry.university}-${entry.courseName}`} className="rounded-md bg-stone-50 p-3 text-sm leading-6 text-stone-700">
                <p className="font-semibold text-ink">{entry.university}</p>
                <p>{entry.courseName}</p>
                <p>
                  ATAR signal: {entry.atarValue} ({entry.atarType}, {entry.year})
                </p>
                <p>Requirement type: {entry.requirementType}</p>
              </div>
            ))}
          </div>
        </div>

        <details className="rounded-lg border border-stone-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink">
            Source metadata
          </summary>
          <div className="mt-4 grid gap-4">
            <SourceNote
              title="Go8 course sources"
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
        </details>
      </div>
    </div>
  );
}

function buildBestFor(major: Major) {
  if (major.scoringProfile.technicalLevel >= 4) {
    return "Students who are comfortable with technical depth and structured problem solving.";
  }

  if (major.scoringProfile.peopleFacingLevel >= 4) {
    return "Students who prefer communication-heavy work and direct responsibility for people or clients.";
  }

  return "Students who want a balanced path without relying on just one strength area.";
}

function buildSummaryScore(major: Major) {
  const profile =
    major.scoringProfile.salaryPotential +
    major.scoringProfile.workLifeBalance +
    major.scoringProfile.mathsPhysicsFit +
    major.scoringProfile.flexibilityLevel +
    (6 - major.scoringProfile.riskLevel);

  return Math.round((profile / 25) * 100);
}

function buildNotIdealIf(major: Major) {
  if (major.scoringProfile.remoteWorkFit >= 4) {
    return "You want to avoid regional, remote, or FIFO-style work conditions.";
  }

  if (major.scoringProfile.workLifeBalance <= 2) {
    return "You care more about predictable hours than ceiling or pressure.";
  }

  if (major.scoringProfile.competitionLevel >= 4) {
    return "You want a lower-pressure graduate path with less competition risk.";
  }

  return "The practical downside or workload profile is not a good fit for your preferences.";
}

function getSelectedMajorIds(searchParams: SearchParams) {
  const raw = searchParams.majors;

  if (!raw) {
    return defaultMajorIds;
  }

  const values = Array.isArray(raw) ? raw : raw.split(",");
  const validIds = values.filter((id) => majors.some((major) => major.id === id));

  return validIds.length > 0 ? validIds : defaultMajorIds;
}

function formatSourcedNumber(value: SourcedNumber, context?: "salary") {
  if (value.value === null) {
    return context === "salary"
      ? `Salary assumption needed (${qualityLabels[value.quality]})`
      : `Missing (${qualityLabels[value.quality]})`;
  }

  if (value.unit.startsWith("AUD")) {
    return `${formatCurrency(value.value)} (${qualityLabels[value.quality]})`;
  }

  if (value.unit === "decimal") {
    return `${formatPercent(value.value)} (${qualityLabels[value.quality]})`;
  }

  return `${value.value} ${value.unit} (${qualityLabels[value.quality]})`;
}
