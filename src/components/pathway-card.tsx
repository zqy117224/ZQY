import { ScoreBar } from "@/components/score-bar";

export function PathwayCard({
  title,
  verdict,
  score,
  upside,
  risk,
  bestFor,
  notIdealIf
}: {
  title: string;
  verdict: string;
  score: number;
  upside: string;
  risk: string;
  bestFor: string;
  notIdealIf: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-stone-700">{verdict}</p>
        </div>
        <div className="w-full md:w-44">
          <ScoreBar label="Fit score" score={Math.max(1, Math.min(5, Math.round(score / 20)))} />
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md bg-stone-50 p-3">
          <p className="text-sm font-semibold text-ink">Main upside</p>
          <p className="mt-1 text-sm leading-6 text-stone-700">{upside}</p>
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <p className="text-sm font-semibold text-ink">Main risk</p>
          <p className="mt-1 text-sm leading-6 text-stone-700">{risk}</p>
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <p className="text-sm font-semibold text-ink">Best suited for</p>
          <p className="mt-1 text-sm leading-6 text-stone-700">{bestFor}</p>
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <p className="text-sm font-semibold text-ink">Not ideal if</p>
          <p className="mt-1 text-sm leading-6 text-stone-700">{notIdealIf}</p>
        </div>
      </div>
    </div>
  );
}
