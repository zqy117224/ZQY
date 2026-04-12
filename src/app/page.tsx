import Link from "next/link";

const highlights = [
  "Check broad eligibility signals from VCE-style prerequisites",
  "Compare salaries, working hours, work settings, and risks",
  "Use sourced recommendations as a starting point for family discussion"
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80"
          alt="Students walking through a university campus"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-ink/28" />
        <div className="relative mx-auto flex min-h-[calc(100svh-120px)] max-w-6xl flex-col justify-center px-4 py-14">
          <p className="mb-3 text-sm font-semibold uppercase text-coral">
            MVP for Australian students
          </p>
          <h1 className="max-w-3xl text-4xl font-bold text-white sm:text-5xl">
            Compare university majors with the career realities attached.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
            A simple decision-support tool for VCE students, international
            students, and Chinese-speaking families who want a practical first
            look at pathways before speaking with a school or university adviser.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/questionnaire"
              className="rounded-md bg-coral px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-coral/90"
            >
              Start questionnaire
            </Link>
            <Link
              href="/comparison"
              className="rounded-md border border-white/70 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white hover:text-ink"
            >
              Compare majors
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <h2 className="text-2xl font-bold text-ink">How it helps</h2>
          <p className="mt-3 text-stone-700">
            It gives an early, practical comparison. The next version can replace
            the source list with more universities and labour-market sources.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-5">
              <span className="mb-4 block h-1.5 w-12 rounded-md bg-leaf" />
              <p className="text-sm leading-6 text-stone-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-lg bg-skywash p-5 text-sm leading-6 text-stone-700">
          Data uses representative source-backed values. This is not admission,
          migration, career, salary, or financial advice.
        </div>
      </section>
    </div>
  );
}
