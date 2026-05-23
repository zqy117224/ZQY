"use client";

import { useMemo, useState } from "react";
import { ProfileSummaryCard } from "@/components/profile-summary-card";
import { SectionHeader } from "@/components/section-header";
import { vceSubjects } from "@/data/majors";

const schoolLevels = [
  ["year-10", "Year 10 or below"],
  ["year-11", "Year 11"],
  ["year-12", "Year 12"],
  ["graduate", "Finished high school"],
  ["parent", "Parent or guardian researching"]
];

export default function QuestionnairePage() {
  const [studentType, setStudentType] = useState("domestic");
  const [workPreference, setWorkPreference] = useState("mix");
  const [priority, setPriority] = useState("stability");
  const [remoteWork, setRemoteWork] = useState("sometimes");
  const [highCompetition, setHighCompetition] = useState("unsure");
  const [maths, setMaths] = useState(3);
  const [coding, setCoding] = useState(3);

  const profileBullets = useMemo(() => {
    const bullets: string[] = [];

    if (maths >= 4 || coding >= 4 || workPreference === "technical") {
      bullets.push("Quantitative / technical");
    }

    if (workPreference === "people") {
      bullets.push("People-facing preference");
    }

    if (priority === "income") {
      bullets.push("High income priority");
    }

    if (priority === "stability") {
      bullets.push("Stability-focused");
    }

    if (priority === "lifestyle") {
      bullets.push("Lifestyle-focused");
    }

    if (studentType === "international") {
      bullets.push("International-risk sensitive");
    }

    if (remoteWork === "no") {
      bullets.push("Not tolerant of remote / FIFO work");
    }

    if (remoteWork === "yes") {
      bullets.push("Remote / FIFO tolerant");
    }

    if (highCompetition === "yes") {
      bullets.push("Comfortable with competition");
    }

    if (highCompetition === "no") {
      bullets.push("Lower tolerance for high competition");
    }

    return bullets.slice(0, 6);
  }, [coding, highCompetition, maths, priority, remoteWork, studentType, workPreference]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeader
        eyebrow="Questionnaire"
        title="Build a pathway profile before you compare"
        description="Use this short questionnaire to combine subjects, strengths, work preferences, and risk tolerance. No account is required."
      />

      <div className="mt-4 rounded-lg border border-stone-200 bg-skywash p-4 text-sm leading-6 text-stone-700">
        Your answers are processed locally in your browser. Some selections may appear in the page URL so results can be shared or refreshed.
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <form action="/results" className="space-y-6">
          <section className="card">
            <h2 className="text-xl font-semibold text-ink">Student background</h2>
            <p className="mt-2 field-help">
              Start with your study stage and application context.
            </p>
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
                  onValueChange={setStudentType}
                />
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold text-ink">Subjects and academic signals</h2>
            <p className="mt-2 field-help">
              Select the subjects you are taking, then mark where you currently feel strongest and weakest.
            </p>
            <CheckboxGrid name="vceSubjects" label="VCE subjects" subjects={vceSubjects} />
            <CheckboxGrid name="strongestSubjects" label="Strongest subjects" subjects={vceSubjects} />
            <CheckboxGrid name="weakestSubjects" label="Weakest subjects" subjects={vceSubjects} />
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold text-ink">Work preferences and trade-offs</h2>
            <p className="mt-2 field-help">
              Tell the tool what kind of work pressure, location, and lifestyle trade-off you can accept.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <span className="field-label">Comfortable with competitive graduate paths?</span>
                <RadioGroup
                  name="highCompetition"
                  options={[
                    ["yes", "Yes"],
                    ["unsure", "Unsure"],
                    ["no", "No"]
                  ]}
                  defaultValue="unsure"
                  onValueChange={setHighCompetition}
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
                  onValueChange={setRemoteWork}
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
                <select
                  name="workPreference"
                  defaultValue="mix"
                  className="input-box"
                  onChange={(event) => setWorkPreference(event.target.value)}
                >
                  <option value="technical">Mostly technical work</option>
                  <option value="people">Mostly people-facing work</option>
                  <option value="mix">A mix of both</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="field-label">Main priority</span>
                <select
                  name="priority"
                  defaultValue="stability"
                  className="input-box"
                  onChange={(event) => setPriority(event.target.value)}
                >
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
            <p className="mt-2 field-help">Use 1 for low interest and 5 for strong interest.</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <InterestSlider name="maths" label="Maths" onValueChange={setMaths} />
              <InterestSlider name="physics" label="Physics" />
              <InterestSlider name="chemistry" label="Chemistry" />
              <InterestSlider name="coding" label="Coding" onValueChange={setCoding} />
              <InterestSlider name="business" label="Business" />
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-md bg-leaf px-5 py-3 text-sm font-semibold text-white transition hover:bg-leaf/90"
            >
              Generate decision report
            </button>
            <a
              href="/comparison"
              className="rounded-md border border-stone-300 bg-white px-5 py-3 text-center text-sm font-semibold text-ink transition hover:border-leaf hover:text-leaf"
            >
              Skip to comparison
            </a>
          </div>
        </form>

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <ProfileSummaryCard
            bullets={profileBullets.length > 0 ? profileBullets : ["Balanced preference profile"]}
          />
          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-ink">What the report will do</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
              <li>Rank pathways using transparent, rule-based scoring.</li>
              <li>Highlight likely upsides, workload, and risk trade-offs.</li>
              <li>Show Go8 course evidence and occupation sources for deeper comparison.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function RadioGroup({
  name,
  options,
  defaultValue,
  onValueChange
}: {
  name: string;
  options: string[][];
  defaultValue: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([value, label]) => (
        <label
          key={value}
          className="flex cursor-pointer items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
        >
          <input
            type="radio"
            name={name}
            value={value}
            defaultChecked={value === defaultValue}
            onChange={() => onValueChange?.(value)}
          />
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

function InterestSlider({
  name,
  label,
  onValueChange
}: {
  name: string;
  label: string;
  onValueChange?: (value: number) => void;
}) {
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
          onChange={(event) => onValueChange?.(Number(event.target.value))}
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
