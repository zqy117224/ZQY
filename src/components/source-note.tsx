type SourceNoteItem = {
  label: string;
  url: string;
  lastUpdated: string;
  note: string;
};

export function SourceNote({
  title,
  sources,
  compact = false
}: {
  title: string;
  sources: SourceNoteItem[];
  compact?: boolean;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className={`mt-3 ${compact ? "space-y-2" : "space-y-3"} text-sm leading-6 text-stone-700`}>
        {sources.map((source) => (
          <div key={`${source.label}-${source.url}`}>
            <a href={source.url} className="font-medium text-leaf underline underline-offset-2">
              {source.label}
            </a>
            <p className="text-stone-500">Checked {source.lastUpdated}</p>
            <p className="text-stone-600">{source.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
