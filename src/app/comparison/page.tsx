import { majors, type Major } from "@/data/majors";
import { type SearchParams } from "@/lib/recommendations";
import type { ReactNode } from "react";

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
            <span className="font-semibold">ATAR:</span> {entry.atarValue} ({entry.atarType},{" "}
            {entry.year})
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
    label: "Formal prerequisite universities",
    getValue: (major) =>
      major.go8Entries
        .filter((entry) => entry.requirementType === "formal prerequisite")
        .map((entry) => entry.university)
        .join(", ") || "None listed"
  },
  {
    label: "Assumed knowledge universities",
    getValue: (major) =>
      major.go8Entries
        .filter((entry) => entry.requirementType === "assumed knowledge")
        .map((entry) => entry.university)
        .join(", ") || "None listed"
  },
  {
    label: "Graduate roles",
    getValue: (major) => major.graduateOutcomes.typicalGraduateRoles.join(", ")
  },
  { label: "Graduate salary evidence", getValue: (major) => major.graduateOutcomes.salaryRange },
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
  { label: "Risk notes", getValue: (major) => major.occupationOutcomes.riskNotes },
  {
    label: "Fit with maths / physics",
    getValue: (major) => `${major.scoringProfile.mathsPhysicsFit}/5`
  },
  {
    label: "Coding intensity",
    getValue: (major) => `${major.scoringProfile.codingIntensity}/5`
  },
  {
    label: "Salary potential score",
    getValue: (major) => `${major.scoringProfile.salaryPotential}/5`
  },
  {
    label: "Work-life balance score",
    getValue: (major) => `${major.scoringProfile.workLifeBalance}/5`
  },
  {
    label: "Competition level",
    getValue: (major) => `${major.scoringProfile.competitionLevel}/5`
  },
  { label: "Risk level", getValue: (major) => `${major.scoringProfile.riskLevel}/5` },
  {
    label: "Source metadata",
    getValue: (major) =>
      [
        ...major.graduateOutcomes.sources,
        ...major.occupationOutcomes.sources
      ].map((source) => (
        <p key={`${major.id}-${source.url}`} className="mb-2 last:mb-0">
          <a href={source.url} className="text-leaf underline underline-offset-2">
            {source.label}
          </a>
          <br />
          <span className="text-stone-500">Updated {source.lastUpdated}</span>
          <br />
          <span className="text-stone-500">{source.note}</span>
        </p>
      ))
  },
  { label: "Overall notes", getValue: (major) => major.overallNotes }
];

export default function ComparisonPage({ searchParams }: { searchParams: SearchParams }) {
  const selectedIds = getSelectedMajorIds(searchParams);
  const selectedMajors = majors.filter((major) => selectedIds.includes(major.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase text-coral">Compare majors</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
          Side-by-side pathway comparison
        </h1>
        <p className="mt-4 leading-7 text-stone-700">
          Select a few majors and compare university-specific Go8 course rows,
          ATAR labels, requirement types, graduate outcomes, occupation outcomes,
          scoring signals, and source metadata. Fewer columns are easier to read on mobile.
        </p>
      </div>

      <form action="/comparison" className="card mb-8">
        <h2 className="text-xl font-semibold text-ink">Choose majors</h2>
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

      <section className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-soft">
        <table className="min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-skywash">
              <th className="w-48 border-b border-stone-200 p-4 font-semibold text-ink">
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
      </section>
    </div>
  );
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
