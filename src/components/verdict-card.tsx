export function VerdictCard({
  title,
  verdict,
  tone = "neutral"
}: {
  title: string;
  verdict: string;
  tone?: "positive" | "caution" | "neutral";
}) {
  const toneClass =
    tone === "positive"
      ? "border-leaf/20 bg-leaf/5"
      : tone === "caution"
        ? "border-coral/20 bg-coral/5"
        : "border-stone-200 bg-white";

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-700">{verdict}</p>
    </div>
  );
}
