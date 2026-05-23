export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase text-coral">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 leading-7 text-stone-700">{description}</p>
      ) : null}
    </div>
  );
}
