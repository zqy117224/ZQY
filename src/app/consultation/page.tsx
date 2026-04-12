export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase text-coral">Consultation</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
            Future pathway consultation service
          </h1>
          <p className="mt-4 leading-7 text-stone-700">
            Consultation booking can later support families who want a guided
            conversation about subjects, university choices, and career trade-offs.
            Enquiries are not submitted or stored in version 1.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">Future service ideas</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                <li>Subject selection discussion for VCE students</li>
                <li>Major comparison for international families</li>
                <li>University course shortlist review</li>
                <li>Career trade-off discussion before applications</li>
              </ul>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">Contact placeholder</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Email: hello@example.com
                <br />
                WeChat: pathway-demo
                <br />
                Location: Melbourne / online
              </p>
            </div>
          </div>
        </div>

        <form className="card">
          <h2 className="text-xl font-semibold text-ink">Placeholder enquiry form</h2>
          <p className="mt-2 field-help">Demo only. Messages are not submitted yet.</p>

          <label className="mt-5 block space-y-2">
            <span className="field-label">Name</span>
            <input className="input-box" placeholder="Student or parent name" />
          </label>

          <label className="mt-4 block space-y-2">
            <span className="field-label">Email or WeChat</span>
            <input className="input-box" placeholder="Your contact detail" />
          </label>

          <label className="mt-4 block space-y-2">
            <span className="field-label">What do you want help with?</span>
            <textarea
              className="input-box min-h-32"
              placeholder="Example: comparing engineering, commerce, and data science"
            />
          </label>

          <button
            type="button"
            className="mt-5 w-full rounded-md bg-leaf px-5 py-3 text-sm font-semibold text-white"
          >
            Placeholder button
          </button>
        </form>
      </section>
    </div>
  );
}
