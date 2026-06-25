import { describe, expect, it } from "vitest";
import {
  buildProfileSummary,
  collectMainRisks,
  getRecommendations,
  parseQuestionnaireAnswers,
  scoreMajor,
  splitRecommendations,
  type Recommendation,
  type QuestionnaireAnswers
} from "@/lib/recommendations";
import { majors } from "@/data/majors";

const computerScience = majors.find((major) => major.id === "computer-science");
const nursing = majors.find((major) => major.id === "nursing");
if (!computerScience || !nursing) {
  throw new Error("Expected fixture majors 'computer-science' and 'nursing' to exist in src/data/majors.ts");
}

function baseAnswers(overrides: Partial<QuestionnaireAnswers> = {}): QuestionnaireAnswers {
  return {
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
    interests: { maths: 3, physics: 3, chemistry: 3, coding: 3, business: 3 },
    workPreference: "mix",
    priority: "stability",
    ...overrides
  };
}

describe("parseQuestionnaireAnswers", () => {
  it("fills in defaults when no search params are provided", () => {
    const answers = parseQuestionnaireAnswers({});
    expect(answers.schoolLevel).toBe("year-12");
    expect(answers.studentType).toBe("domestic");
    expect(answers.vceSubjects).toEqual([]);
    expect(answers.interests).toEqual({ maths: 3, physics: 3, chemistry: 3, coding: 3, business: 3 });
  });

  it("normalises single string params and array params for list fields", () => {
    const answers = parseQuestionnaireAnswers({
      vceSubjects: "Mathematical Methods",
      strongestSubjects: ["English", "Chemistry"]
    });
    expect(answers.vceSubjects).toEqual(["Mathematical Methods"]);
    expect(answers.strongestSubjects).toEqual(["English", "Chemistry"]);
  });

  it("takes the first value when a scalar field is passed as an array", () => {
    const answers = parseQuestionnaireAnswers({ priority: ["income", "stability"] });
    expect(answers.priority).toBe("income");
  });

  it("clamps interest levels into the 1-5 range and falls back to 3 for invalid input", () => {
    const answers = parseQuestionnaireAnswers({ maths: "9", physics: "-3", coding: "not-a-number" });
    expect(answers.interests.maths).toBe(5);
    expect(answers.interests.physics).toBe(1);
    expect(answers.interests.coding).toBe(3);
  });
});

describe("getRecommendations", () => {
  it("returns at most 8 recommendations sorted by descending score", () => {
    const recommendations = getRecommendations(baseAnswers());
    expect(recommendations.length).toBeLessThanOrEqual(8);
    for (let i = 1; i < recommendations.length; i += 1) {
      expect(recommendations[i - 1].score).toBeGreaterThanOrEqual(recommendations[i].score);
    }
  });

});

describe("scoreMajor", () => {
  it("rewards matching formal prerequisites and penalises missing ones", () => {
    const withSubjects = scoreMajor(
      computerScience,
      baseAnswers({ vceSubjects: ["Mathematical Methods", "English"] })
    );
    const withoutSubjects = scoreMajor(computerScience, baseAnswers({ vceSubjects: [] }));

    expect(withSubjects.score).toBeGreaterThan(withoutSubjects.score);
  });

  it("penalises low coding interest for a coding-intensive pathway", () => {
    const matchingSubjects = ["Mathematical Methods", "English"];
    const lowCoding = scoreMajor(
      computerScience,
      baseAnswers({
        vceSubjects: matchingSubjects,
        interests: { maths: 3, physics: 3, chemistry: 3, coding: 1, business: 3 }
      })
    );
    const highCoding = scoreMajor(
      computerScience,
      baseAnswers({
        vceSubjects: matchingSubjects,
        interests: { maths: 3, physics: 3, chemistry: 3, coding: 5, business: 3 }
      })
    );

    expect(highCoding.score).toBeGreaterThan(lowCoding.score);
    expect(
      lowCoding.warnings.some((warning) => warning.includes("a lot of coding"))
    ).toBe(true);
  });

  it("warns about registration and visa implications for international students in nursing", () => {
    const recommendation = scoreMajor(nursing, baseAnswers({ studentType: "international" }));
    expect(
      recommendation.warnings.some((warning) => warning.includes("registration, placement"))
    ).toBe(true);
  });

  it("does not raise the international registration warning for domestic students", () => {
    const recommendation = scoreMajor(nursing, baseAnswers({ studentType: "domestic" }));
    expect(
      recommendation.warnings.some((warning) => warning.includes("registration, placement"))
    ).toBe(false);
  });
});

describe("buildProfileSummary", () => {
  it("falls back to a balanced profile when no signal is strong enough", () => {
    const summary = buildProfileSummary(baseAnswers());
    expect(summary).toEqual(["Stability-focused"]);
  });

  it("flags a quantitative/technical profile for high maths or coding interest", () => {
    const summary = buildProfileSummary(
      baseAnswers({ interests: { maths: 5, physics: 3, chemistry: 3, coding: 3, business: 3 } })
    );
    expect(summary).toContain("Quantitative / technical");
  });

  it("caps the summary at 6 bullets", () => {
    const summary = buildProfileSummary(
      baseAnswers({
        workPreference: "technical",
        priority: "income",
        studentType: "international",
        remoteWork: "no",
        highCompetition: "no",
        interests: { maths: 5, physics: 5, chemistry: 5, coding: 5, business: 5 }
      })
    );
    expect(summary.length).toBeLessThanOrEqual(6);
  });
});

describe("splitRecommendations", () => {
  function makeRecommendation(score: number): Recommendation {
    return {
      major: majors[0],
      score,
      explanation: "",
      reasons: [],
      warnings: ["risk"],
      verdict: "",
      upside: "",
      risk: "",
      bestFor: "",
      notIdealIf: ""
    };
  }

  it("buckets recommendations into top, caution, and lower-priority tiers by score", () => {
    const recommendations = [90, 80, 60].map(makeRecommendation);
    const { top, caution, lowerPriority } = splitRecommendations(recommendations);

    expect(top.map((item) => item.score)).toEqual([90]);
    expect(caution.map((item) => item.score)).toEqual([80]);
    expect(lowerPriority.map((item) => item.score)).toEqual([60]);
  });

  it("falls back to the highest-scoring items when nothing clears the top threshold", () => {
    const recommendations = [78, 72, 65].map(makeRecommendation);
    const { top } = splitRecommendations(recommendations);
    expect(top.map((item) => item.score)).toEqual([78, 72, 65]);
  });
});

describe("collectMainRisks", () => {
  function makeRecommendation(warnings: string[]): Recommendation {
    return {
      major: majors[0],
      score: 0,
      explanation: "",
      reasons: [],
      warnings,
      verdict: "",
      upside: "",
      risk: "",
      bestFor: "",
      notIdealIf: ""
    };
  }

  it("deduplicates repeated warnings across recommendations", () => {
    const risks = collectMainRisks([
      makeRecommendation(["Same risk", "Other risk"]),
      makeRecommendation(["Same risk"])
    ]);
    expect(risks).toEqual(["Same risk", "Other risk"]);
  });

  it("caps the result at 6 risks", () => {
    const manyWarnings = Array.from({ length: 10 }, (_, index) => `Risk ${index}`);
    const risks = collectMainRisks([makeRecommendation(manyWarnings)]);
    expect(risks.length).toBeLessThanOrEqual(6);
  });
});
