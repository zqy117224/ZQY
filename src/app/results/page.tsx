import Link from "next/link";
import type { ReactNode } from "react";
import {
  getRecommendations,
  parseQuestionnaireAnswers,
  type Recommendation,
  type SearchParams
} from "@/lib/recommendations";

export default function ResultsPage({ searchParams }: { searchParams: SearchParams }) {
  const answers = parseQuestionnaireAnswers(searchParams);
  const recommendations = getRecommendations(answers);
  const comparisonIds = recommendations
    .slice(0, 4)
    .map((item) => item.major.id)
    .join(",");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-coral">Source-backed results</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
            Recommended majors to explore
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-stone-700">
            Rankings come from a simple rules-based score using the sourced
            Go8 course entries, graduate outcome evidence, and occupation data
            below. Treat this as a conversation starter, then verify ATAR rules,
            fees, visa settings, and course details with the linked official sources.
          </p>
        </div>
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
            Compare top matches
          </Link>
        </div>
      </div>

      <section className="grid gap-5">
        {recommendations.map((recommendation, index) => (
          <ResultCard
            key={recommendation.major.id}
            recommendation={recommendation}
            rank={index + 1}
          />
        ))}
      </section>
    </div>
  );
}

function ResultCard({
  recommendation,
  rank
}: {
  recommendation: Recommendation;
  rank: number;
}) {
  const major = recommendation.major;

  return (
    <article className="card">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-coral">Rank {rank}</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">{major.name}</h2>
          <p className="mt-3 leading-7 text-stone-700">{recommendation.explanation}</p>
        </div>
        <div className="w-full rounded-md bg-skywash p-4 text-center md:w-36">
          <p className="text-xs font-semibold uppercase text-stone-600">Fit score</p>
          <p className="mt-1 text-3xl font-bold text-leaf">{recommendation.score}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InfoBlock title="Why it may suit">
          <ul className="space-y-2">
            {recommendation.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </InfoBlock>
        <InfoBlock title="Drawbacks or warnings">
          <ul className="space-y-2">
            {recommendation.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
            <li>{major.occupationOutcomes.riskNotes}</li>
          </ul>
        </InfoBlock>
        <InfoBlock title="Graduate outcomes">
          <p>{major.graduateOutcomes.salaryRange}</p>
          <p className="mt-2">{major.graduateOutcomes.employmentOutlook}</p>
          <p className="mt-2">
            Common roles: {major.graduateOutcomes.typicalGraduateRoles.join(", ")}
          </p>
          <p className="mt-2">{major.graduateOutcomes.notes}</p>
        </InfoBlock>
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold text-ink">Go8 course entries</h3>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {major.go8Entries.map((entry) => (
            <Go8EntryCard key={`${entry.university}-${entry.courseName}`} entry={entry} />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-stone-700 md:grid-cols-3">
        <MiniFact label="Working hours" value={major.occupationOutcomes.workingHours} />
        <MiniFact label="Job environment" value={major.occupationOutcomes.jobEnvironment} />
        <MiniFact label="Typical tasks" value={major.occupationOutcomes.typicalTasks} />
      </div>

      <div className="mt-5 grid gap-3 text-sm text-stone-700 md:grid-cols-2">
        <MiniFact label="Trade-offs" value={major.occupationOutcomes.tradeOffs} />
        <SourceList
          label="Graduate and occupation sources"
          sources={[
            ...major.graduateOutcomes.sources,
            ...major.occupationOutcomes.sources
          ]}
        />
        <MiniFact
          label="Scoring profile"
          value={`Salary ${major.scoringProfile.salaryPotential}/5, work-life balance ${major.scoringProfile.workLifeBalance}/5, coding ${major.scoringProfile.codingIntensity}/5, maths/physics ${major.scoringProfile.mathsPhysicsFit}/5, competition ${major.scoringProfile.competitionLevel}/5, risk ${major.scoringProfile.riskLevel}/5.`}
        />
      </div>
    </article>
  );
}

function Go8EntryCard({
  entry
}: {
  entry: {
    university: string;
    courseName: string;
    atarValue: string;
    atarType: string;
    year: number;
    subjectRequirements: string[];
    requirementType: string;
    notes: string;
    sourceLink: string;
    lastChecked: string;
  };
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-ink">{entry.university}</p>
          <p>{entry.courseName}</p>
        </div>
        <div className="rounded-md bg-white px-3 py-2 text-left sm:text-right">
          <p className="font-semibold text-ink">{entry.atarValue}</p>
          <p className="text-xs text-stone-500">{entry.atarType}</p>
        </div>
      </div>
      <p className="mt-3 font-semibold text-ink">Requirement type: {entry.requirementType}</p>
      <ul className="mt-2 list-inside list-disc">
        {entry.subjectRequirements.map((requirement) => (
          <li key={requirement}>{requirement}</li>
        ))}
      </ul>
      <p className="mt-2">{entry.notes}</p>
      <a href={entry.sourceLink} className="mt-2 inline-block text-leaf underline underline-offset-2">
        Source checked {entry.lastChecked}
      </a>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-paper p-4 text-sm leading-6 text-stone-700">
      <h3 className="mb-2 font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-stone-50 p-3">
      <p className="font-semibold text-ink">{label}</p>
      <p className="mt-1 leading-6">{value}</p>
    </div>
  );
}

function SourceList({
  label,
  sources
}: {
  label: string;
  sources: { label: string; url: string; lastUpdated: string; note: string }[];
}) {
  return (
    <div className="rounded-md bg-stone-50 p-3">
      <p className="font-semibold text-ink">{label}</p>
      <ul className="mt-1 space-y-1 leading-6">
        {sources.map((source) => (
          <li key={`${source.label}-${source.url}`}>
            <a href={source.url} className="text-leaf underline underline-offset-2">
              {source.label}
            </a>{" "}
            <span className="text-stone-500">Updated {source.lastUpdated}</span>
            <span className="mt-1 block text-stone-500">{source.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
