export function ProfileSummaryCard({
  title = "Your pathway profile",
  bullets
}: {
  title?: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-skywash p-5">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {bullets.map((item) => (
          <span
            key={item}
            className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
