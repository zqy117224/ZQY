import Link from "next/link";
import { SectionHeader } from "@/components/section-header";

export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <SectionHeader
            eyebrow="Coming soon"
            title="Guided pathway reviews may be added later"
            description="For now, the questionnaire and comparison tool are the main way to evaluate majors, prerequisites, workload, ROI, and career trade-offs."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">What a future review could cover</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                <li>Shortlist review across majors and universities</li>
                <li>Subject strategy for VCE students who are still deciding</li>
                <li>Trade-off discussion for international families</li>
                <li>Workload, salary, and risk comparison before applications</li>
              </ul>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">Current status</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                No booking system or contact channel is active on this page yet.
                Use the questionnaire to generate a report, then compare a small
                shortlist in more detail.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-ink">Best next step today</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Start with your current subjects, strengths, and priorities, then use
            the comparison page to pressure-test the shortlist against sourced evidence.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/questionnaire"
              className="rounded-md bg-leaf px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-leaf/90"
            >
              Start questionnaire
            </Link>
            <Link
              href="/comparison"
              className="rounded-md border border-stone-300 bg-white px-5 py-3 text-center text-sm font-semibold text-ink transition hover:border-leaf hover:text-leaf"
            >
              Open comparison
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
