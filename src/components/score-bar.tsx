export function ScoreBar({
  label,
  score,
  tone = "leaf"
}: {
  label: string;
  score: number;
  tone?: "leaf" | "coral" | "ink";
}) {
  const width = `${Math.max(0, Math.min(100, (score / 5) * 100))}%`;
  const toneClass =
    tone === "coral" ? "bg-coral" : tone === "ink" ? "bg-ink" : "bg-leaf";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-stone-600">{score}/5</span>
      </div>
      <div className="h-2 rounded-full bg-stone-200">
        <div className={`h-2 rounded-full ${toneClass}`} style={{ width }} />
      </div>
    </div>
  );
}
