import { type InterestArea, type Major, majors } from "@/data/majors";

export type SearchParams = Record<string, string | string[] | undefined>;

export type QuestionnaireAnswers = {
  schoolLevel: string;
  studyingInAustralia: string;
  studentType: string;
  vceSubjects: string[];
  strongestSubjects: string[];
  weakestSubjects: string[];
  highCompetition: string;
  remoteWork: string;
  preferredSalary: string;
  workLifeBalance: string;
  interests: Record<InterestArea, number>;
  workPreference: string;
  priority: string;
};

export type Recommendation = {
  major: Major;
  score: number;
  explanation: string;
  reasons: string[];
  warnings: string[];
};

const emptyAnswers: QuestionnaireAnswers = {
  schoolLevel: "year-12",
  studyingInAustralia: "yes",
  studentType: "domestic",
  vceSubjects: [],
  strongestSubjects: [],
  weakestSubjects: [],
  highCompetition: "unsure",
  remoteWork: "sometimes",
  preferredSalary: "flexible",
  workLifeBalance: "balanced",
  interests: {
    maths: 3,
    physics: 3,
    chemistry: 3,
    coding: 3,
    business: 3
  },
  workPreference: "mix",
  priority: "stability"
};

function asSingleValue(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function asArray(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function asInterest(value: string | string[] | undefined) {
  const parsed = Number(asSingleValue(value, "3"));
  return Number.isFinite(parsed) ? Math.min(5, Math.max(1, parsed)) : 3;
}

export function parseQuestionnaireAnswers(searchParams: SearchParams): QuestionnaireAnswers {
  return {
    ...emptyAnswers,
    schoolLevel: asSingleValue(searchParams.schoolLevel, emptyAnswers.schoolLevel),
    studyingInAustralia: asSingleValue(
      searchParams.studyingInAustralia,
      emptyAnswers.studyingInAustralia
    ),
    studentType: asSingleValue(searchParams.studentType, emptyAnswers.studentType),
    vceSubjects: asArray(searchParams.vceSubjects),
    strongestSubjects: asArray(searchParams.strongestSubjects),
    weakestSubjects: asArray(searchParams.weakestSubjects),
    highCompetition: asSingleValue(searchParams.highCompetition, emptyAnswers.highCompetition),
    remoteWork: asSingleValue(searchParams.remoteWork, emptyAnswers.remoteWork),
    preferredSalary: asSingleValue(searchParams.preferredSalary, emptyAnswers.preferredSalary),
    workLifeBalance: asSingleValue(searchParams.workLifeBalance, emptyAnswers.workLifeBalance),
    interests: {
      maths: asInterest(searchParams.maths),
      physics: asInterest(searchParams.physics),
      chemistry: asInterest(searchParams.chemistry),
      coding: asInterest(searchParams.coding),
      business: asInterest(searchParams.business)
    },
    workPreference: asSingleValue(searchParams.workPreference, emptyAnswers.workPreference),
    priority: asSingleValue(searchParams.priority, emptyAnswers.priority)
  };
}

export function getRecommendations(answers: QuestionnaireAnswers): Recommendation[] {
  return majors
    .map((major) => scoreMajor(major, answers))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function scoreMajor(major: Major, answers: QuestionnaireAnswers): Recommendation {
  let score = 50;
  const reasons: string[] = [];
  const warnings: string[] = [];
  const scoring = major.scoringProfile;
  const formalRequirements = major.go8Entries
    .filter((entry) => entry.requirementType === "formal prerequisite")
    .flatMap((entry) => entry.subjectRequirements);
  const assumedKnowledge = major.go8Entries
    .filter((entry) => entry.requirementType === "assumed knowledge")
    .flatMap((entry) => entry.subjectRequirements);
  const allRequirements = [...formalRequirements, ...assumedKnowledge];

  // Go8 entries are university-specific. Matching here is only a fit signal, not an admission decision.
  for (const subject of formalRequirements) {
    if (answers.vceSubjects.some((selectedSubject) => subject.includes(selectedSubject))) {
      score += 8;
    } else {
      score -= 10;
      warnings.push(`Check formal prerequisite carefully: ${subject}.`);
    }
  }

  const helpfulMatches = assumedKnowledge.filter((subject) =>
    answers.vceSubjects.some((selectedSubject) => subject.includes(selectedSubject))
  );
  score += helpfulMatches.length * 4;
  if (helpfulMatches.length > 0) {
    reasons.push(`Your subjects align with assumed knowledge: ${helpfulMatches.join(", ")}.`);
  }

  const strongMatches = answers.strongestSubjects.filter(
    (subject) => allRequirements.some((requirement) => requirement.includes(subject))
  );
  score += strongMatches.length * 5;
  if (strongMatches.length > 0) {
    reasons.push(`Your stronger subjects line up with this pathway.`);
  }

  const weakMatches = answers.weakestSubjects.filter(
    (subject) => allRequirements.some((requirement) => requirement.includes(subject))
  );
  score -= weakMatches.length * 5;
  if (weakMatches.length > 0) {
    warnings.push(`Some weaker subjects are important here: ${weakMatches.join(", ")}.`);
  }

  for (const area of Object.keys(answers.interests) as InterestArea[]) {
    score += (answers.interests[area] - 3) * scoring.interestFit[area] * 1.6;
  }

  if (answers.interests.coding <= 2 && scoring.codingIntensity >= 4) {
    score -= 14;
    warnings.push("This option uses a lot of coding, which may feel frustrating if coding interest is low.");
  }

  if (answers.interests.maths <= 2 && scoring.mathsPhysicsFit >= 4) {
    score -= 12;
    warnings.push("This pathway is maths-heavy, so low maths interest is a real warning sign.");
  }

  if (answers.preferredSalary === "high") {
    score += scoring.salaryPotential * 2;
  }

  if (answers.preferredSalary === "very-high") {
    score += scoring.salaryPotential * 3;
    if (scoring.salaryPotential <= 3) {
      warnings.push("Salary potential may be lower than your preferred level based on the sourced outcome profile.");
    }
  }

  if (answers.workLifeBalance === "important") {
    score += scoring.workLifeBalance * 3;
    if (scoring.workLifeBalance <= 2) {
      warnings.push("Work-life balance may be difficult in this pathway.");
    }
  }

  if (answers.workLifeBalance === "career-first") {
    score += scoring.salaryPotential * 2;
  }

  if (answers.highCompetition === "no") {
    score -= scoring.competitionLevel * 3;
    if (scoring.competitionLevel >= 4) {
      warnings.push("Competition can be high for internships or early-career roles.");
    }
  }

  if (answers.highCompetition === "yes") {
    score += scoring.competitionLevel * 1.5;
  }

  if (answers.remoteWork === "no") {
    score -= scoring.remoteWorkFit * 4;
    if (scoring.remoteWorkFit >= 4) {
      warnings.push("This pathway may involve regional, remote, or FIFO work.");
    }
  }

  if (answers.remoteWork === "yes") {
    score += scoring.remoteWorkFit * 2;
  }

  if (
    answers.studentType === "international" &&
    ["nursing", "teaching", "law"].includes(major.id)
  ) {
    warnings.push("International students should check registration, placement, and visa implications early.");
  }

  if (answers.workPreference === "technical") {
    score += scoring.technicalLevel * 3 - scoring.peopleFacingLevel;
  }

  if (answers.workPreference === "people") {
    score += scoring.peopleFacingLevel * 3 - scoring.technicalLevel;
  }

  if (answers.workPreference === "mix") {
    score += 8 - Math.abs(scoring.peopleFacingLevel - scoring.technicalLevel);
  }

  if (answers.priority === "income") {
    score += scoring.salaryPotential * 3;
  }

  if (answers.priority === "lifestyle") {
    score += scoring.workLifeBalance * 3;
  }

  if (answers.priority === "stability") {
    score += scoring.stabilityLevel * 3;
  }

  if (answers.priority === "flexibility") {
    score += scoring.flexibilityLevel * 3;
  }

  if (scoring.salaryPotential >= 4 && answers.priority === "income") {
    reasons.push("The salary potential score aligns with your income priority.");
  }

  if (scoring.workLifeBalance >= 4 && answers.priority === "lifestyle") {
    reasons.push("The work-life balance score is stronger than many alternatives.");
  }

  if (scoring.stabilityLevel >= 4 && answers.priority === "stability") {
    reasons.push("This pathway scores well for stability based on the sourced profile.");
  }

  if (scoring.flexibilityLevel >= 4 && answers.priority === "flexibility") {
    reasons.push("This pathway may offer stronger flexibility than more site-based options.");
  }

  if (reasons.length === 0) {
    reasons.push("This option has a balanced match across your answers.");
  }

  if (warnings.length === 0) {
    warnings.push("No major red flag from these rules, but verify prerequisites and job outcomes before making decisions.");
  }

  return {
    major,
    score: Math.round(score),
    explanation: buildExplanation(major, answers),
    reasons: reasons.slice(0, 3),
    warnings: warnings.slice(0, 3)
  };
}

function buildExplanation(major: Major, answers: QuestionnaireAnswers) {
  const interestLabels: Record<InterestArea, string> = {
    maths: "maths",
    physics: "physics",
    chemistry: "chemistry",
    coding: "coding",
    business: "business"
  };
  const highInterestAreas = (Object.keys(answers.interests) as InterestArea[])
    .filter((area) => answers.interests[area] >= 4 && major.scoringProfile.interestFit[area] >= 3)
    .map((area) => interestLabels[area]);

  if (highInterestAreas.length > 0) {
    return `${major.name} may suit you because it connects with your interest in ${highInterestAreas.join(
      ", "
    )}.`;
  }

  if (answers.priority === "income" && major.scoringProfile.salaryPotential >= 4) {
    return `${major.name} may suit you because the sourced outcome profile supports a relatively strong income score.`;
  }

  if (answers.priority === "stability" && major.scoringProfile.stabilityLevel >= 4) {
    return `${major.name} may suit you because it has a stronger stability signal in the sourced profile.`;
  }

  return `${major.name} is worth exploring because it has a reasonable overall fit across your answers.`;
}
