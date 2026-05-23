import { majors, type Major, type SourceMetadata } from "@/data/majors";
import {
  type PathwayFinancialProfile,
  type ScenarioAdjustment,
  type SourceMeta,
  type SourcedNumber
} from "@/types/roi";

const checkedDate = "2026-05-22";
const assumptionNote = "User-editable assumption - not sourced.";

const studyAustraliaLivingCostSource: SourceMeta = {
  sourceName: "Study Australia visa application process: financial capacity requirement",
  sourceUrl: "https://www.studyaustralia.gov.au/en/plan-your-move/visa-application-process",
  sourceDate: "2025",
  lastUpdated: checkedDate,
  scope: "International student financial capacity planning",
  note:
    "Study Australia states international student visa applicants must show at least AUD 29,710. Actual living costs vary by city, lifestyle, rent, family situation, and inflation."
};

const scenarioAssumptionSource: SourceMeta = {
  sourceName: "VCE Pathway Compass scenario stress-test settings",
  lastUpdated: checkedDate,
  scope: "User-editable scenario assumptions",
  note:
    "Scenario adjustments are not official forecasts. They are simple stress-test assumptions used to compare sensitivity."
};

const miningEngineeringSalarySource: SourceMeta = {
  sourceName: "Engineers Australia summary of Jobs and Skills Australia Higher Education Outcomes Report",
  sourceUrl:
    "https://www.engineersaustralia.org.au/news-and-media/2025/11/value-engineering-degree-engineers-lead-graduate-earnings",
  sourceDate: "2025",
  lastUpdated: checkedDate,
  scope: "Mining Engineering graduate earnings, Year 1 and Year 5 median salaries",
  note:
    "Reports Mining Engineering median salary of AUD 113,380 in Year 1 and AUD 152,000 in Year 5, citing Jobs and Skills Australia higher education outcomes data. The ROI model uses the Year 1 median as the starting salary default, not the fifth-year salary. Jobs and Skills Australia Mining Engineers occupation profile also reports AUD 3,518/week median full-time earnings: https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2336-mining-engineers."
};

type SalaryReference = {
  qiltField: string;
  qiltFullTimeEmployment: number;
  qiltGraduateMedianSalary?: number;
  specificGraduateYear1Salary?: number;
  specificGraduateYear5Salary?: number;
  jsaOccupationProxy: string;
  jsaMedianWeeklyEarnings: number;
  annualisedJsaGross: number;
  qiltNote?: string;
  note?: string;
};

const salaryReferences: Record<string, SalaryReference> = {
  "computer-science": {
    qiltField: "Computing and information systems",
    qiltFullTimeEmployment: 0.678,
    qiltGraduateMedianSalary: 75_300,
    jsaOccupationProxy: "Software and Applications Programmers",
    jsaMedianWeeklyEarnings: 2_537,
    annualisedJsaGross: 131_924
  },
  "software-engineering": {
    qiltField: "Computing and information systems",
    qiltFullTimeEmployment: 0.678,
    qiltGraduateMedianSalary: 75_300,
    jsaOccupationProxy: "Software and Applications Programmers",
    jsaMedianWeeklyEarnings: 2_537,
    annualisedJsaGross: 131_924,
    note:
      "Same occupation proxy is acceptable because JSA groups Software Engineers under Software and Applications Programmers."
  },
  "electrical-engineering": {
    qiltField: "Engineering",
    qiltFullTimeEmployment: 0.855,
    specificGraduateYear1Salary: 74_180,
    specificGraduateYear5Salary: 106_500,
    jsaOccupationProxy: "Electrical Engineers",
    jsaMedianWeeklyEarnings: 2_553,
    annualisedJsaGross: 132_756
  },
  "mechanical-engineering": {
    qiltField: "Engineering",
    qiltFullTimeEmployment: 0.855,
    specificGraduateYear1Salary: 69_790,
    specificGraduateYear5Salary: 96_490,
    jsaOccupationProxy: "Industrial, Mechanical and Production Engineers",
    jsaMedianWeeklyEarnings: 2_614,
    annualisedJsaGross: 135_928
  },
  "civil-engineering": {
    qiltField: "Engineering",
    qiltFullTimeEmployment: 0.855,
    specificGraduateYear1Salary: 69_100,
    specificGraduateYear5Salary: 97_850,
    jsaOccupationProxy: "Civil Engineering Professionals",
    jsaMedianWeeklyEarnings: 2_217,
    annualisedJsaGross: 115_284
  },
  "mining-engineering": {
    qiltField: "Engineering / JSA HEO specific",
    qiltFullTimeEmployment: 0.855,
    specificGraduateYear1Salary: 113_380,
    specificGraduateYear5Salary: 152_000,
    jsaOccupationProxy: "Mining Engineers",
    jsaMedianWeeklyEarnings: 3_518,
    annualisedJsaGross: 182_936
  },
  commerce: {
    qiltField: "Business and management",
    qiltFullTimeEmployment: 0.785,
    qiltGraduateMedianSalary: 72_000,
    jsaOccupationProxy: "Accountants",
    jsaMedianWeeklyEarnings: 2_003,
    annualisedJsaGross: 104_156
  },
  finance: {
    qiltField: "Business and management",
    qiltFullTimeEmployment: 0.785,
    qiltGraduateMedianSalary: 72_000,
    jsaOccupationProxy: "Financial Dealers",
    jsaMedianWeeklyEarnings: 2_651,
    annualisedJsaGross: 137_852
  },
  economics: {
    qiltField: "Humanities, culture and social sciences",
    qiltFullTimeEmployment: 0.667,
    qiltGraduateMedianSalary: 73_100,
    jsaOccupationProxy: "Economists",
    jsaMedianWeeklyEarnings: 2_862,
    annualisedJsaGross: 148_824
  },
  mathematics: {
    qiltField: "Science and mathematics",
    qiltFullTimeEmployment: 0.636,
    qiltGraduateMedianSalary: 72_400,
    jsaOccupationProxy: "Actuaries, Mathematicians and Statisticians",
    jsaMedianWeeklyEarnings: 2_072,
    annualisedJsaGross: 107_744,
    note:
      "Same JSA occupation group is acceptable because JSA combines actuaries, mathematicians and statisticians."
  },
  "statistics-data-science": {
    qiltField: "Science and mathematics",
    qiltFullTimeEmployment: 0.636,
    qiltGraduateMedianSalary: 72_400,
    jsaOccupationProxy: "Actuaries, Mathematicians and Statisticians",
    jsaMedianWeeklyEarnings: 2_072,
    annualisedJsaGross: 107_744
  },
  physics: {
    qiltField: "Science and mathematics",
    qiltFullTimeEmployment: 0.636,
    qiltGraduateMedianSalary: 72_400,
    jsaOccupationProxy: "Other Natural and Physical Science Professionals",
    jsaMedianWeeklyEarnings: 1_848,
    annualisedJsaGross: 96_096
  },
  nursing: {
    qiltField: "Nursing",
    qiltFullTimeEmployment: 0.855,
    qiltGraduateMedianSalary: 72_000,
    jsaOccupationProxy: "Registered Nurses",
    jsaMedianWeeklyEarnings: 2_192,
    annualisedJsaGross: 113_984
  },
  teaching: {
    qiltField: "Teacher education",
    qiltFullTimeEmployment: 0.868,
    qiltGraduateMedianSalary: 78_800,
    jsaOccupationProxy: "Secondary School Teachers",
    jsaMedianWeeklyEarnings: 2_322,
    annualisedJsaGross: 120_744
  },
  law: {
    qiltField: "Law and paralegal studies",
    qiltFullTimeEmployment: 0.793,
    qiltGraduateMedianSalary: 76_000,
    jsaOccupationProxy: "Solicitors",
    jsaMedianWeeklyEarnings: 2_070,
    annualisedJsaGross: 107_640
  }
};

function monashSource(sourceName: string, sourceUrl: string, scope: string, note: string): SourceMeta {
  return {
    sourceName,
    sourceUrl,
    sourceDate: "2026",
    lastUpdated: checkedDate,
    scope,
    note
  };
}

const courseSources = {
  computerScience: monashSource(
    "Monash Bachelor of Computer Science course page",
    "https://www.monash.edu/study/courses/find-a-course/computer-science-c2001?international=true",
    "Monash Bachelor of Computer Science, 2026 international course fee and duration",
    "Representative Monash course page. Fee is per 48 credit points and changes annually; verify against the official offer and student type."
  ),
  engineering: monashSource(
    "Monash Bachelor of Engineering (Honours) course page",
    "https://www.monash.edu/study/courses/find-a-course/engineering-e3001?international=true",
    "Monash Bachelor of Engineering (Honours), 2026 international course fee and duration",
    "Representative engineering pathway for software, electrical, mechanical, civil, and mining engineering. Specialisations and campuses can differ."
  ),
  commerce: monashSource(
    "Monash Bachelor of Commerce course page",
    "https://www.monash.edu/study/courses/find-a-course/commerce-b2001",
    "Monash Bachelor of Commerce, 2026 full-fee value shown on course page",
    "Representative commerce pathway for commerce, finance, and economics. This is not a guarantee of the fee for every student type."
  ),
  science: monashSource(
    "Monash Bachelor of Science course page",
    "https://www.monash.edu/study/courses/find-a-course/science-s2000",
    "Monash Bachelor of Science, 2026 full-fee value shown on course page",
    "Representative science pathway for mathematics and physics. This is not a guarantee of the fee for every student type."
  ),
  dataScience: monashSource(
    "Monash Bachelor of Applied Data Science course page",
    "https://www.monash.edu/study/courses/find-a-course/applied-data-science-s2010",
    "Monash Bachelor of Applied Data Science, 2026 full-fee value shown on course page",
    "Representative data science pathway. This is not a guarantee of the fee for every student type."
  ),
  nursing: monashSource(
    "Monash undergraduate international course guide",
    "https://www.monash.edu/__data/assets/pdf_file/0005/3941744/undergraduate-international-course-guide.pdf",
    "Monash Bachelor of Nursing, 2026 international course guide fee and duration",
    "Representative Monash international guide value. Nursing also has placement, registration, English, and compliance costs not modelled here."
  ),
  education: monashSource(
    "Monash Bachelor of Education (Honours) course page",
    "https://www.monash.edu/study/courses/find-a-course/education-d3001",
    "Monash Bachelor of Education (Honours), 2026 full-fee value shown on course page",
    "Representative education pathway. The course is equivalent to 4.25 years and offered in accelerated mode to complete in 4 years."
  ),
  law: monashSource(
    "Monash Bachelor of Laws (Honours) course page",
    "https://www.monash.edu/study/courses/find-a-course/laws-l3001",
    "Monash Bachelor of Laws (Honours), 2026 full-fee value shown on course page",
    "Representative law pathway. Practical legal training, admission steps, and double-degree pathways are not modelled here."
  )
};

const courseDefaults: Record<
  string,
  {
    studyYears: SourcedNumber;
    tuitionPerYear: SourcedNumber;
  }
> = {
  "computer-science": {
    studyYears: sourceNumber(3, "years", courseSources.computerScience),
    tuitionPerYear: sourceNumber(55_500, "AUD/year", courseSources.computerScience)
  },
  "software-engineering": engineeringDefaults(),
  "electrical-engineering": engineeringDefaults(),
  "mechanical-engineering": engineeringDefaults(),
  "civil-engineering": engineeringDefaults(),
  "mining-engineering": engineeringDefaults(),
  commerce: commerceDefaults(),
  finance: commerceDefaults(),
  economics: commerceDefaults(),
  mathematics: {
    studyYears: sourceNumber(3, "years", courseSources.science),
    tuitionPerYear: sourceNumber(45_600, "AUD/year", courseSources.science)
  },
  "statistics-data-science": {
    studyYears: sourceNumber(3, "years", courseSources.dataScience),
    tuitionPerYear: sourceNumber(45_600, "AUD/year", courseSources.dataScience)
  },
  physics: {
    studyYears: sourceNumber(3, "years", courseSources.science),
    tuitionPerYear: sourceNumber(45_600, "AUD/year", courseSources.science)
  },
  nursing: {
    studyYears: sourceNumber(3, "years", courseSources.nursing),
    tuitionPerYear: sourceNumber(42_900, "AUD/year", courseSources.nursing)
  },
  teaching: {
    studyYears: sourceNumber(4, "years", courseSources.education),
    tuitionPerYear: sourceNumber(33_600, "AUD/year", courseSources.education)
  },
  law: {
    studyYears: sourceNumber(4.25, "years", courseSources.law),
    tuitionPerYear: sourceNumber(50_200, "AUD/year", courseSources.law)
  }
};

export const otherAnnualCostsAfterGraduationDefault: SourcedNumber = assumptionNumber(
  0,
  "AUD/year",
  "No default for transport, insurance, family support, visa costs, debt repayment, or other personal costs."
);

export const simpleEffectiveTaxRateDefault: SourcedNumber = assumptionNumber(
  0.25,
  "decimal",
  "Fallback tax setting for users who do not want to use resident or foreign resident bracket estimates."
);

export const scenarioAdjustments: ScenarioAdjustment[] = [
  {
    name: "Conservative",
    salaryMultiplier: scenarioNumber(0.9, "multiplier", "Starting salary reduced by 10% from the base input."),
    employmentProbabilityDelta: scenarioNumber(-0.1, "probability points", "Employment probability reduced by 10 percentage points."),
    salaryGrowthRateDelta: scenarioNumber(-0.01, "probability points", "Salary growth reduced by 1 percentage point."),
    livingCostMultiplier: scenarioNumber(1.1, "multiplier", "Living costs increased by 10% from the base input.")
  },
  {
    name: "Base",
    salaryMultiplier: scenarioNumber(1, "multiplier", "Uses the edited base starting salary."),
    employmentProbabilityDelta: scenarioNumber(0, "probability points", "Uses the edited base employment probability."),
    salaryGrowthRateDelta: scenarioNumber(0, "probability points", "Uses the edited base salary growth rate."),
    livingCostMultiplier: scenarioNumber(1, "multiplier", "Uses the edited base living costs.")
  },
  {
    name: "Optimistic",
    salaryMultiplier: scenarioNumber(1.1, "multiplier", "Starting salary increased by 10% from the base input."),
    employmentProbabilityDelta: scenarioNumber(0.05, "probability points", "Employment probability increased by 5 percentage points."),
    salaryGrowthRateDelta: scenarioNumber(0.01, "probability points", "Salary growth increased by 1 percentage point."),
    livingCostMultiplier: scenarioNumber(1, "multiplier", "Keeps living costs at the edited base input.")
  }
];

export const roiProfiles: PathwayFinancialProfile[] = majors.map((major) => {
  const defaults = courseDefaults[major.id] ?? missingCourseDefaults();

  return {
    pathwayId: major.id,
    studyYears: defaults.studyYears,
    tuitionPerYear: defaults.tuitionPerYear,
    livingCostPerYearWhileStudying: sourceNumber(
      29_710,
      "AUD/year",
      studyAustraliaLivingCostSource,
      "Used as a source-backed planning baseline for living costs while studying."
    ),
    otherStudyCosts: assumptionNumber(
      0,
      "AUD",
      "Books, equipment, placement checks, visas, OSHC, relocation, flights, and exam costs are not reliably available here."
    ),
    opportunityCostPerYear: assumptionNumber(
      0,
      "AUD/year",
      "Set this if studying replaces paid full-time work or another income path."
    ),
    startingSalary: salaryDefaultForMajor(major),
    laterCareerSalary: laterCareerSalaryForMajor(major),
    occupationMedianSalary: occupationMedianSalaryForMajor(major),
    employmentProbability: employmentDefaultForMajor(major),
    salaryGrowthRate: assumptionNumber(
      0,
      "decimal",
      "No official pathway-specific graduate salary growth default is included yet."
    ),
    annualLivingCostAfterGraduation: sourceNumber(
      29_710,
      "AUD/year",
      studyAustraliaLivingCostSource,
      "Used as an editable baseline after graduation. It is not graduate-specific and may be too low for some cities or family situations."
    ),
    fallbackIncomeIfNotEmployed: assumptionNumber(
      0,
      "AUD/year",
      "Conservative placeholder for the not-employed outcome in risk-adjusted payback."
    )
  };
});

export function getRoiProfile(pathwayId: string) {
  return roiProfiles.find((profile) => profile.pathwayId === pathwayId) ?? roiProfiles[0];
}

export function auditRoiSalaryDefaults() {
  const rows = roiProfiles.map((profile) => {
    const major = majors.find((item) => item.id === profile.pathwayId);

    return {
      pathwayId: profile.pathwayId,
      pathwayName: major?.name ?? profile.pathwayId,
      value: profile.startingSalary.value,
      unit: profile.startingSalary.unit,
      quality: profile.startingSalary.quality,
      dataLabel: profile.startingSalary.dataLabel,
      sourceName: profile.startingSalary.source?.sourceName,
      note: profile.startingSalary.note,
      employmentProbability: profile.employmentProbability.value,
      employmentQuality: profile.employmentProbability.quality,
      laterCareerSalary: profile.laterCareerSalary.value,
      occupationMedianSalary: profile.occupationMedianSalary.value
    };
  });
  const duplicateWarnings = Array.from(
    rows
      .filter((row) => row.value !== null)
      .reduce((groups, row) => {
        const key = `${row.value}-${row.unit}-${row.quality}-${row.sourceName ?? "no-source"}`;
        const existing = groups.get(key) ?? [];
        existing.push(row.pathwayName);
        groups.set(key, existing);
        return groups;
      }, new Map<string, string[]>())
      .entries()
  )
    .filter(([, pathwayNames]) => pathwayNames.length > 1)
    .map(([key, pathwayNames]) => ({
      key,
      pathwayNames,
      message: `Duplicate salary default ${key} is used by ${pathwayNames.join(", ")}. Verify this is intentional and source-specific.`
    }));

  return {
    rows,
    duplicateWarnings
  };
}

function engineeringDefaults() {
  return {
    studyYears: sourceNumber(4, "years", courseSources.engineering),
    tuitionPerYear: sourceNumber(59_600, "AUD/year", courseSources.engineering)
  };
}

function commerceDefaults() {
  return {
    studyYears: sourceNumber(3, "years", courseSources.commerce),
    tuitionPerYear: sourceNumber(38_000, "AUD/year", courseSources.commerce)
  };
}

function missingCourseDefaults() {
  return {
    studyYears: missingNumber("years", "Course duration is not sourced yet."),
    tuitionPerYear: missingNumber("AUD/year", "Tuition is not sourced yet.")
  };
}

function sourceNumber(
  value: number,
  unit: string,
  source: SourceMeta,
  note = "Source-backed value. Verify before making a financial decision."
): SourcedNumber {
  return {
    value,
    unit,
    quality: "source-backed",
    source,
    note
  };
}

function assumptionNumber(value: number, unit: string, note: string): SourcedNumber {
  return {
    value,
    unit,
    quality: "user-assumption",
    note: `${assumptionNote} ${note}`
  };
}

function scenarioNumber(value: number, unit: string, note: string): SourcedNumber {
  return {
    value,
    unit,
    quality: "user-assumption",
    source: scenarioAssumptionSource,
    note: `${assumptionNote} ${note}`
  };
}

function missingNumber(unit: string, note: string): SourcedNumber {
  return {
    value: null,
    unit,
    quality: "missing",
    note
  };
}

function salaryDefaultForMajor(major: Major): SourcedNumber {
  const reference = salaryReferences[major.id];

  if (!reference || (!reference.qiltGraduateMedianSalary && !reference.specificGraduateYear1Salary)) {
    return missingNumber("AUD/year", "Salary assumption needed. No graduate salary default is mapped for this pathway.");
  }
  const hasSpecificGraduateSalary = reference.specificGraduateYear1Salary !== undefined;
  const salaryValue = reference.specificGraduateYear1Salary ?? reference.qiltGraduateMedianSalary!;

  return {
    value: salaryValue,
    unit: "AUD/year",
    quality: "source-backed",
    dataLabel: hasSpecificGraduateSalary ? "specific graduate data" : "broad field estimate",
    source:
      hasSpecificGraduateSalary
        ? miningEngineeringSalarySource
        : major.graduateOutcomes.sources[0]
          ? convertMajorSource(
              major.graduateOutcomes.sources[0],
              `QILT ${reference.qiltField} graduate median salary`
            )
          : undefined,
    note:
      hasSpecificGraduateSalary
        ? `${major.name} specific graduate salary: Year 1 median gross salary before tax. QILT ${reference.qiltField} employment is still a broad graduate field employment estimate.${reference.note ? ` ${reference.note}` : ""}`
        : `${reference.qiltField}: broad graduate field estimate from QILT domestic undergraduate short-term outcomes by study area, surveyed about 4-6 months after completion. This is not discipline-specific and should not be read as a ${major.name}-specific graduate salary.${reference.qiltNote ? ` ${reference.qiltNote}` : ""}${reference.note ? ` ${reference.note}` : ""}`
  };
}

function laterCareerSalaryForMajor(major: Major): SourcedNumber {
  const reference = salaryReferences[major.id];

  if (!reference) {
    return missingNumber("AUD/year", "No later-career salary reference is mapped for this pathway.");
  }

  const hasSpecificYear5Salary = reference.specificGraduateYear5Salary !== undefined;
  const source = hasSpecificYear5Salary ? miningEngineeringSalarySource : occupationSourceForMajor(major);
  const value = reference.specificGraduateYear5Salary ?? reference.annualisedJsaGross;

  return {
    value,
    unit: "AUD/year",
    quality: "source-backed",
    dataLabel: hasSpecificYear5Salary ? "specific graduate data" : "specific occupation data",
    source,
    note: hasSpecificYear5Salary
      ? `${major.name} specific Year 5 graduate salary. Later-career scenario reference, not graduate starting salary.`
      : `JSA occupation median earnings for ${reference.jsaOccupationProxy}, annualised from AUD ${reference.jsaMedianWeeklyEarnings.toLocaleString("en-AU")}/week. This is before tax and is not a graduate starting salary.${reference.note ? ` ${reference.note}` : ""}`
  };
}

function occupationMedianSalaryForMajor(major: Major): SourcedNumber {
  const reference = salaryReferences[major.id];

  if (!reference) {
    return missingNumber("AUD/year", "No JSA occupation median earnings reference is mapped for this pathway.");
  }

  return {
    value: reference.annualisedJsaGross,
    unit: "AUD/year",
    quality: "source-backed",
    dataLabel: "specific occupation data",
    source: occupationSourceForMajor(major),
    note: `Jobs and Skills Australia occupation median earnings for ${reference.jsaOccupationProxy}: AUD ${reference.jsaMedianWeeklyEarnings.toLocaleString("en-AU")}/week, annualised to AUD ${reference.annualisedJsaGross.toLocaleString("en-AU")}. Before tax; not a graduate salary.`
  };
}

function employmentDefaultForMajor(major: Major): SourcedNumber {
  const reference = salaryReferences[major.id];
  const source = major.graduateOutcomes.sources[0];

  if (!reference) {
    return missingNumber("decimal", "No QILT full-time employment default is mapped for this pathway.");
  }

  return {
    value: reference.qiltFullTimeEmployment,
    unit: "decimal",
    quality: "source-backed",
    dataLabel: "broad field estimate",
    source: source ? convertMajorSource(source, `QILT ${reference.qiltField} full-time employment`) : undefined,
    note: `${reference.qiltField}: QILT domestic undergraduate full-time employment, surveyed about 4-6 months after completion. This is not international-student-specific.`
  };
}

function occupationSourceForMajor(major: Major): SourceMeta | undefined {
  const reference = salaryReferences[major.id];
  const existingSource = major.occupationOutcomes.sources[0];

  if (!reference) {
    return existingSource ? convertMajorSource(existingSource, "JSA occupation median earnings") : undefined;
  }

  return {
    sourceName: `Jobs and Skills Australia: ${reference.jsaOccupationProxy}`,
    sourceUrl: existingSource?.url,
    lastUpdated: checkedDate,
    scope: "Occupation median weekly earnings before tax",
    note: `Supplied JSA proxy for this pathway. Median weekly earnings: AUD ${reference.jsaMedianWeeklyEarnings.toLocaleString("en-AU")}; annualised gross: AUD ${reference.annualisedJsaGross.toLocaleString("en-AU")}.`
  };
}

function convertMajorSource(source: SourceMetadata, scope: string): SourceMeta {
  return {
    sourceName: source.label,
    sourceUrl: source.url,
    lastUpdated: source.lastUpdated,
    scope,
    note: source.note
  };
}
