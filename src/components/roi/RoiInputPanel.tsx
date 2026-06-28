"use client";

import type { ReactNode } from "react";
import { dataLabelClasses, getInputMeta, qualityClasses, qualityLabels } from "@/lib/roi";
import { ROI_CONFIG } from "@/lib/roiConfig";
import { useI18n } from "@/lib/i18n";
import { type PathwayFinancialProfile, type RoiAssumptions, type RoiInputKey } from "@/types/roi";

type FieldConfig = {
  key: RoiInputKey;
  label: string;
  help: string;
  inputMode?: "money" | "decimal" | "percent";
};

type RoiInputPanelProps = {
  assumptions: RoiAssumptions;
  profile: PathwayFinancialProfile;
  onNumberChange: (key: RoiInputKey, value: number) => void;
  onTaxResidencyChange: (value: RoiAssumptions["taxResidency"]) => void;
};

const studyCostFields: FieldConfig[] = [
  {
    key: "studyYears",
    label: "Study years",
    help: "Full-time equivalent years used in the cost model.",
    inputMode: "decimal"
  },
  {
    key: "tuitionPerYear",
    label: "Tuition per year",
    help: "Annual tuition or student contribution. Replace this with your offer/course page if needed.",
    inputMode: "money"
  },
  {
    key: "livingCostPerYearWhileStudying",
    label: "Living cost while studying",
    help: "Annual living-cost planning baseline while studying.",
    inputMode: "money"
  }
];

const incomeFields: FieldConfig[] = [
  {
    key: "startingSalary",
    label: "Starting salary",
    help: "Graduate full-time salary signal used as first-year gross income.",
    inputMode: "money"
  },
  {
    key: "yearsToOccupationMedian",
    label: "Years to occupation median",
    help: "Editable modelling horizon from graduate salary to the JSA occupation median. This is an assumption, not a forecast.",
    inputMode: "decimal"
  },
  {
    key: "employmentProbability",
    label: "Employment probability",
    help: "Probability used in the risk-adjusted free cash flow model.",
    inputMode: "percent"
  },
  {
    key: "fallbackIncomeIfNotEmployed",
    label: "Fallback income if not employed",
    help: "Annual income used in the not-employed branch of the risk-adjusted model.",
    inputMode: "money"
  }
];

const afterGraduationFields: FieldConfig[] = [
  {
    key: "annualLivingCostAfterGraduation",
    label: "Living cost after graduation",
    help: "Annual cost baseline after graduation.",
    inputMode: "money"
  },
  {
    key: "otherAnnualCostsAfterGraduation",
    label: "Other annual costs after graduation",
    help: "Transport, insurance, family support, visa costs, debt repayment, or other personal costs.",
    inputMode: "money"
  }
];

export function RoiInputPanel({
  assumptions,
  profile,
  onNumberChange,
  onTaxResidencyChange
}: RoiInputPanelProps) {
  const { tx } = useI18n();

  return (
    <div className="space-y-6">
      <InputSection
        title="Study cost inputs"
        fields={studyCostFields}
        assumptions={assumptions}
        profile={profile}
        onNumberChange={onNumberChange}
      >
        <LivingCostTierSelector
          value={assumptions.livingCostPerYearWhileStudying}
          onChange={(value) => onNumberChange("livingCostPerYearWhileStudying", value)}
        />
      </InputSection>

      <InputSection
        title="Income and employment inputs"
        fields={incomeFields}
        assumptions={assumptions}
        profile={profile}
        onNumberChange={onNumberChange}
      />

      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">{tx("Tax settings")}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          {tx("Tax estimate only. It excludes Medicare levy, offsets, deductions, HELP/HECS, superannuation, and individual circumstances.")}
        </p>
        <label className="mt-4 block">
          <span className="field-label">{tx("Tax residency model")}</span>
          <select
            className="input-box mt-2"
            value={assumptions.taxResidency}
            onChange={(event) =>
              onTaxResidencyChange(event.target.value as RoiAssumptions["taxResidency"])
            }
          >
            <option value="australian-resident">{tx("Australian resident tax brackets")}</option>
            <option value="foreign-resident">{tx("Foreign resident tax brackets")}</option>
            <option value="simple-effective-rate">{tx("Simple effective tax rate")}</option>
          </select>
        </label>
        {assumptions.taxResidency === "simple-effective-rate" ? (
          <InputRow
            field={{
              key: "simpleEffectiveTaxRate",
              label: "Simple effective tax rate",
              help: "Use this only if bracket-based tax is not appropriate for your situation.",
              inputMode: "percent"
            }}
            assumptions={assumptions}
            profile={profile}
            onNumberChange={onNumberChange}
          />
        ) : null}
      </div>

      <InputSection
        title="After-graduation cost inputs"
        fields={afterGraduationFields}
        assumptions={assumptions}
        profile={profile}
        onNumberChange={onNumberChange}
      />
    </div>
  );
}

function InputSection({
  title,
  fields,
  assumptions,
  profile,
  onNumberChange,
  children
}: {
  title: string;
  fields: FieldConfig[];
  assumptions: RoiAssumptions;
  profile: PathwayFinancialProfile;
  onNumberChange: (key: RoiInputKey, value: number) => void;
  children?: ReactNode;
}) {
  const { tx } = useI18n();

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">{tx(title)}</h2>
      {children}
      <div className="mt-5 grid gap-4">
        {fields.map((field) => (
          <InputRow
            key={field.key}
            field={field}
            assumptions={assumptions}
            profile={profile}
            onNumberChange={onNumberChange}
          />
        ))}
      </div>
    </div>
  );
}

function LivingCostTierSelector({
  value,
  onChange
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { tx } = useI18n();

  return (
    <div className="mt-4 rounded-lg border border-leaf/20 bg-leaf/10 p-4">
      <p className="text-sm font-semibold text-ink">{tx("Living cost tier")}</p>
      <p className="mt-1 text-sm leading-6 text-stone-700">
        {tx("Choose a quick living-cost assumption. You can still edit the amount manually below.")}
      </p>
      <div className="mt-3 grid gap-2">
        {ROI_CONFIG.livingCostTiers.map((tier) => {
          const selected = Math.round(value) === tier.value;

          return (
            <button
              key={tier.value}
              type="button"
              onClick={() => onChange(tier.value)}
              className={
                selected
                  ? "rounded-md border border-leaf bg-leaf px-3 py-2 text-left text-sm font-semibold text-white"
                  : "rounded-md border border-stone-300 bg-white px-3 py-2 text-left text-sm font-semibold text-ink transition hover:border-leaf hover:text-leaf"
              }
            >
              <span className="block">{tx(tier.label)}</span>
              <span className={selected ? "text-xs text-white/85" : "text-xs text-stone-600"}>
                A${tier.value.toLocaleString("en-AU")} / {tx("year")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InputRow({
  field,
  assumptions,
  profile,
  onNumberChange
}: {
  field: FieldConfig;
  assumptions: RoiAssumptions;
  profile: PathwayFinancialProfile;
  onNumberChange: (key: RoiInputKey, value: number) => void;
}) {
  const { tx } = useI18n();
  const meta = getInputMeta(profile, field.key);
  const storedValue = assumptions[field.key] ?? 0;
  const displayValue = field.inputMode === "percent" ? storedValue * 100 : storedValue;

  return (
    <label className="block rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="field-label">{tx(field.label)}</span>
          <p className="mt-1 text-sm leading-6 text-stone-600">{tx(field.help)}</p>
        </div>
        <span
          className={`w-fit rounded-md border px-2.5 py-1 text-xs font-semibold ${qualityClasses[meta.quality]}`}
        >
          {tx(qualityLabels[meta.quality])}
        </span>
        {meta.dataLabel ? (
          <span
            className={`w-fit rounded-md border px-2.5 py-1 text-xs font-semibold ${dataLabelClasses[meta.dataLabel]}`}
          >
            {tx(meta.dataLabel)}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {field.inputMode === "money" ? <span className="text-sm font-semibold text-stone-600">A$</span> : null}
        <input
          type="number"
          className="input-box"
          min={field.inputMode === "percent" ? -100 : 0}
          step={field.inputMode === "money" ? 100 : field.inputMode === "percent" ? 0.1 : 0.25}
          value={Number.isFinite(displayValue) ? displayValue : 0}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onNumberChange(field.key, field.inputMode === "percent" ? parsed / 100 : parsed);
          }}
        />
        {field.inputMode === "percent" ? <span className="text-sm font-semibold text-stone-600">%</span> : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-stone-600">
        {meta.source ? `${tx(meta.source.sourceName)}. ` : ""}
        {tx(meta.note ?? "No source attached")}
      </p>
    </label>
  );
}
