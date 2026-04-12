import { vceSubjects } from "@/data/majors";

const schoolLevels = [
  ["year-10", "Year 10 or below"],
  ["year-11", "Year 11"],
  ["year-12", "Year 12"],
  ["graduate", "Finished high school"],
  ["parent", "Parent or guardian researching"]
];

const subjectHints = [
  "Select the VCE subjects you are taking or expect to take.",
  "Use strongest and weakest subjects as honest signals, not final judgments."
];

export default function QuestionnairePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase text-coral">Questionnaire</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
          Tell us what kind of pathway may fit.
        </h1>
        <p className="mt-4 leading-7 text-stone-700">
          Your answers are used by simple local rules only. They are visible in the URL
          so the recommendation logic stays transparent.
        </p>
      </div>

      <form action="/results" className="space-y-6">
        <section className="card">
          <h2 className="text-xl font-semibold text-ink">Student background</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <label className="space-y-2">
              <span className="field-label">Current stage</span>
              <select name="schoolLevel" defaultValue="year-12" className="input-box">
                {schoolLevels.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-2">
              <span className="field-label">Studying in Australia?</span>
              <RadioGroup
                name="studyingInAustralia"
                options={[
                  ["yes", "Yes"],
                  ["no", "No"],
                  ["planning", "Planning to"]
                ]}
                defaultValue="yes"
              />
            </div>

            <div className="space-y-2">
              <span className="field-label">Student type</span>
              <RadioGroup
                name="studentType"
                options={[
                  ["domestic", "Domestic"],
                  ["international", "International"],
                  ["unsure", "Unsure"]
                ]}
                defaultValue="domestic"
              />
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-ink">Subjects</h2>
          <p className="mt-2 field-help">{subjectHints.join(" ")}</p>
          <CheckboxGrid name="vceSubjects" label="VCE subjects" subjects={vceSubjects} />
          <CheckboxGrid name="strongestSubjects" label="Strongest subjects" subjects={vceSubjects} />
          <CheckboxGrid name="weakestSubjects" label="Weakest subjects" subjects={vceSubjects} />
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-ink">Work preferences</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <span className="field-label">Comfortable with high competition careers?</span>
              <RadioGroup
                name="highCompetition"
                options={[
                  ["yes", "Yes"],
                  ["unsure", "Unsure"],
                  ["no", "No"]
                ]}
                defaultValue="unsure"
              />
            </div>

            <div className="space-y-2">
              <span className="field-label">Can accept regional, remote, or FIFO work?</span>
              <RadioGroup
                name="remoteWork"
                options={[
                  ["yes", "Yes"],
                  ["sometimes", "Maybe"],
                  ["no", "No"]
                ]}
                defaultValue="sometimes"
              />
            </div>

            <label className="space-y-2">
              <span className="field-label">Preferred salary level</span>
              <select name="preferredSalary" defaultValue="flexible" className="input-box">
                <option value="flexible">Flexible</option>
                <option value="moderate">Moderate is fine</option>
                <option value="high">High</option>
                <option value="very-high">Very high</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="field-label">Preferred work-life balance</span>
              <select name="workLifeBalance" defaultValue="balanced" className="input-box">
                <option value="important">Very important</option>
                <option value="balanced">Balanced</option>
                <option value="career-first">Career growth first</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="field-label">Preferred work style</span>
              <select name="workPreference" defaultValue="mix" className="input-box">
                <option value="technical">Mostly technical work</option>
                <option value="people">Mostly people-facing work</option>
                <option value="mix">A mix of both</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="field-label">Main priority</span>
              <select name="priority" defaultValue="stability" className="input-box">
                <option value="income">Income</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="stability">Stability</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </label>
          </div>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-ink">Interest levels</h2>
          <p className="mt-2 field-help">1 means low interest. 5 means strong interest.</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <InterestSlider name="maths" label="Maths" />
            <InterestSlider name="physics" label="Physics" />
            <InterestSlider name="chemistry" label="Chemistry" />
            <InterestSlider name="coding" label="Coding" />
            <InterestSlider name="business" label="Business" />
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-md bg-leaf px-5 py-3 text-sm font-semibold text-white transition hover:bg-leaf/90"
          >
            See recommendations
          </button>
          <a
            href="/comparison"
            className="rounded-md border border-stone-300 bg-white px-5 py-3 text-center text-sm font-semibold text-ink transition hover:border-leaf hover:text-leaf"
          >
            Skip to comparison
          </a>
        </div>
      </form>
    </div>
  );
}

function RadioGroup({
  name,
  options,
  defaultValue
}: {
  name: string;
  options: string[][];
  defaultValue: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([value, label]) => (
        <label
          key={value}
          className="flex cursor-pointer items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
        >
          <input type="radio" name={name} value={value} defaultChecked={value === defaultValue} />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxGrid({
  name,
  label,
  subjects
}: {
  name: string;
  label: string;
  subjects: string[];
}) {
  return (
    <div className="mt-5">
      <span className="field-label">{label}</span>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <label
            key={`${name}-${subject}`}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            <input type="checkbox" name={name} value={subject} />
            <span>{subject}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function InterestSlider({ name, label }: { name: string; label: string }) {
  return (
    <label className="space-y-2">
      <span className="field-label">{label}</span>
      <div className="rounded-md border border-stone-300 bg-white p-3">
        <input
          type="range"
          name={name}
          min="1"
          max="5"
          step="1"
          defaultValue="3"
          className="w-full accent-leaf"
        />
        <div className="mt-1 flex justify-between text-xs text-stone-500">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </label>
  );
}
