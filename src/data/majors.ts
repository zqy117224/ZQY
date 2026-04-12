export type InterestArea = "maths" | "physics" | "chemistry" | "coding" | "business";
export type DifficultyLevel = "Low" | "Medium" | "High" | "Very high";

export type SourceMetadata = {
  label: string;
  url: string;
  lastUpdated: string;
  note: string;
};

export type Go8Entry = {
  university: string;
  courseName: string;
  atarValue: string;
  atarType: string;
  year: number;
  subjectRequirements: string[];
  requirementType: "formal prerequisite" | "assumed knowledge";
  notes: string;
  sourceLink: string;
  lastChecked: string;
};

export type GraduateOutcomes = {
  typicalGraduateRoles: string[];
  salaryRange: string;
  employmentOutlook: string;
  furtherStudyCommon: boolean;
  notes: string;
  sources: SourceMetadata[];
};

export type OccupationOutcomes = {
  relatedOccupations: string[];
  workStyle: string;
  workingHours: string;
  jobEnvironment: string;
  typicalTasks: string;
  tradeOffs: string;
  riskNotes: string;
  sources: SourceMetadata[];
};

export type ScoringProfile = {
  salaryPotential: number;
  workLifeBalance: number;
  codingIntensity: number;
  mathsPhysicsFit: number;
  competitionLevel: number;
  riskLevel: number;
  remoteWorkFit: number;
  stabilityLevel: number;
  flexibilityLevel: number;
  peopleFacingLevel: number;
  technicalLevel: number;
  interestFit: Record<InterestArea, number>;
};

export type Major = {
  id: string;
  name: string;
  summary: string;
  go8Entries: Go8Entry[];
  graduateOutcomes: GraduateOutcomes;
  occupationOutcomes: OccupationOutcomes;
  scoringProfile: ScoringProfile;
  overallNotes: string;
};

const checkedDate = "2026-04-13";

const sources = {
  monashComputerScience: {
    label: "Monash Bachelor of Computer Science 2026 entry requirements",
    url: "https://www.monash.edu/study/courses/find-a-course/computer-science-c2001",
    lastUpdated: checkedDate,
    note: "Representative Victorian course page: English Units 3&4 score 25 and Mathematical Methods or Specialist Mathematics Units 3&4 score 25."
  },
  monashEngineering: {
    label: "Monash Bachelor of Engineering (Honours) 2026 entry requirements",
    url: "https://www.monash.edu/study/courses/find-a-course/engineering-e3001",
    lastUpdated: checkedDate,
    note: "Representative Victorian engineering course page: English score 25, Mathematical Methods or Specialist Mathematics score 25, and Chemistry or Physics score 25."
  },
  monashCommerce: {
    label: "Monash Bachelor of Commerce 2026 entry requirements",
    url: "https://www.monash.edu/study/courses/find-a-course/commerce-b2001",
    lastUpdated: checkedDate,
    note: "Representative Victorian commerce course page: English score 25 and Mathematical Methods or Specialist Mathematics score 25."
  },
  monashScience: {
    label: "Monash Bachelor of Science 2026 entry requirements",
    url: "https://www.monash.edu/study/courses/find-a-course/science-s2000",
    lastUpdated: checkedDate,
    note: "Representative Victorian science course page: English score 25 and one approved science/other subject score 25."
  },
  monashAppliedDataScience: {
    label: "Monash Bachelor of Applied Data Science 2026 entry requirements",
    url: "https://www.monash.edu/study/courses/find-a-course/applied-data-science-s2010",
    lastUpdated: checkedDate,
    note: "Representative Victorian data science course page: English score 25 and Mathematical Methods or Specialist Mathematics score 25."
  },
  monashNursing: {
    label: "Monash Bachelor of Nursing 2026 entry requirements",
    url: "https://www.monash.edu/study/courses/find-a-course/nursing-m2006",
    lastUpdated: checkedDate,
    note: "Representative Victorian nursing course page: English score 25, VCE maths completion requirement, and additional English proficiency requirements."
  },
  monashEducation: {
    label: "Monash Bachelor of Education (Honours) 2026 entry requirements",
    url: "https://www.monash.edu/education/future-students/courses/teacher-education/bachelor-of-education-honours",
    lastUpdated: checkedDate,
    note: "Representative Victorian education course page: English score 30 EAL or 25 other English, plus VCE maths completion requirement."
  },
  monashLaw: {
    label: "Monash Bachelor of Laws (Honours) 2026 entry requirements",
    url: "https://www.monash.edu/study/courses/find-a-course/laws-l3001",
    lastUpdated: checkedDate,
    note: "Representative Victorian law course page: English score 35 EAL or 30 other English; no maths prerequisite."
  },
  qilt: {
    label: "QILT 2024 Graduate Outcomes Survey National Report",
    url: "https://www.qilt.edu.au/docs/default-source/default-document-library/2024-gos-national-report.pdf?sfvrsn=9f40f76_1",
    lastUpdated: checkedDate,
    note: "National domestic undergraduate outcomes by study area, surveyed about 4-6 months after course completion. Not institution-specific."
  },
  jsaSoftware: {
    label: "Jobs and Skills Australia: Software and Applications Programmers",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2613-software-and-applications-programmers",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 203,200 employed, median full-time earnings $2,537/week, average full-time hours 41/week."
  },
  jsaElectrical: {
    label: "Jobs and Skills Australia: Electrical Engineers",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2333-electrical-engineers",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 33,100 employed, median full-time earnings $2,553/week, average full-time hours 43/week."
  },
  jsaMechanical: {
    label: "Jobs and Skills Australia: Industrial, Mechanical and Production Engineers",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2335-industrial-mechanical-and-production-engineers",
    lastUpdated: checkedDate,
    note: "Occupation group profile using ABS/JSA data: 42,000 employed and median full-time earnings $2,614/week."
  },
  jsaCivil: {
    label: "Jobs and Skills Australia: Civil Engineering Professionals",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2332-civil-engineering-professionals",
    lastUpdated: checkedDate,
    note: "Occupation group profile using ABS/JSA data: 76,800 employed and median full-time earnings $2,217/week."
  },
  jsaMining: {
    label: "Jobs and Skills Australia: Mining Engineers",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2336-mining-engineers",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 17,300 employed, median full-time earnings $3,518/week, average full-time hours 50/week."
  },
  jsaAccountants: {
    label: "Jobs and Skills Australia: Accountants",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2211-accountants",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 215,500 employed, median full-time earnings $2,003/week, average full-time hours 43/week."
  },
  jsaFinance: {
    label: "Jobs and Skills Australia: Financial Investment Advisers and Managers",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2223-financial-investment-advisers-and-managers",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 63,400 employed, median full-time earnings $2,582/week, average full-time hours 45/week."
  },
  jsaEconomists: {
    label: "Jobs and Skills Australia: Economists",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2243-economists",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 4,600 employed, median full-time earnings $2,862/week, average full-time hours 43/week."
  },
  jsaMathStats: {
    label: "Jobs and Skills Australia: Actuaries, Mathematicians and Statisticians",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2241-actuaries-mathematicians-and-statisticians",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 12,600 employed, median full-time earnings $2,072/week, average full-time hours 42/week."
  },
  jsaData: {
    label: "Jobs and Skills Australia: ICT Business and Systems Analysts",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2611-ict-business-and-systems-analysts",
    lastUpdated: checkedDate,
    note: "Occupation profile used as a data/analytics proxy: 51,000 employed, median full-time earnings $2,697/week, average full-time hours 41/week."
  },
  jsaPhysics: {
    label: "Jobs and Skills Australia: Physicists (including Astronomers)",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/234914-physicists-including-astronomers",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 1,500 employed; median weekly earnings not published for this 6-digit occupation."
  },
  jsaNursing: {
    label: "Jobs and Skills Australia: Registered Nurses",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2544-registered-nurses",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 366,200 employed, median full-time earnings $2,192/week, average full-time hours 41/week."
  },
  jsaTeaching: {
    label: "Jobs and Skills Australia: Secondary School Teachers",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2414-secondary-school-teachers",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 161,400 employed, median full-time earnings $2,322/week, average full-time hours 45/week."
  },
  jsaLaw: {
    label: "Jobs and Skills Australia: Solicitors",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2713-solicitors",
    lastUpdated: checkedDate,
    note: "Occupation profile using ABS/JSA data: 106,100 employed, median full-time earnings $2,070/week, average full-time hours 46/week."
  }
};

type MajorInput = {
  id: string;
  name: string;
  summary: string;
  go8Entries: Go8Entry[];
  graduateRoles: string[];
  salaryRange: string;
  employmentOutlook: string;
  furtherStudyCommon?: boolean;
  graduateNotes: string;
  graduateSources: SourceMetadata[];
  occupations: string[];
  workStyle: string;
  workingHours: string;
  jobEnvironment: string;
  typicalTasks: string;
  tradeOffs: string;
  riskNotes: string;
  occupationSources: SourceMetadata[];
  scoringProfile: ScoringProfile;
  overallNotes: string;
};

function makeMajor(input: MajorInput): Major {
  return {
    id: input.id,
    name: input.name,
    summary: input.summary,
    go8Entries: input.go8Entries,
    graduateOutcomes: {
      typicalGraduateRoles: input.graduateRoles,
      salaryRange: input.salaryRange,
      employmentOutlook: input.employmentOutlook,
      furtherStudyCommon: input.furtherStudyCommon ?? false,
      notes: input.graduateNotes,
      sources: input.graduateSources
    },
    occupationOutcomes: {
      relatedOccupations: input.occupations,
      workStyle: input.workStyle,
      workingHours: input.workingHours,
      jobEnvironment: input.jobEnvironment,
      typicalTasks: input.typicalTasks,
      tradeOffs: input.tradeOffs,
      riskNotes: input.riskNotes,
      sources: input.occupationSources
    },
    scoringProfile: input.scoringProfile,
    overallNotes: input.overallNotes
  };
}

const qiltComputing =
  "QILT 2024 Computing and information systems: 67.8% full-time employment, 80.4% overall employment, $75,300 median full-time salary.";
const qiltEngineering =
  "QILT 2024 Engineering: 85.5% full-time employment, 89.5% overall employment, $80,000 median full-time salary.";
const qiltBusiness =
  "QILT 2024 Business and management: 78.5% full-time employment, 88.7% overall employment, $72,000 median full-time salary.";
const qiltScience =
  "QILT 2024 Science and mathematics: 63.6% full-time employment, 82.5% overall employment, $72,400 median full-time salary.";
const qiltNursing =
  "QILT 2024 Nursing: 85.5% full-time employment, 91.7% overall employment, $72,000 median full-time salary.";
const qiltTeaching =
  "QILT 2024 Teacher education: 86.8% full-time employment, 92.5% overall employment, $78,800 median full-time salary.";
const qiltLaw =
  "QILT 2024 Law and paralegal studies: 79.3% full-time employment, 88.5% overall employment, $76,000 median full-time salary.";

const go8 = {
  monashComputerScience: {
    university: "Monash University",
    courseName: "Bachelor of Computer Science",
    atarValue: "80.15",
    atarType: "2026 lowest ATAR to which an offer was made",
    year: 2026,
    subjectRequirements: [
      "English Units 3&4 study score at least 25",
      "Mathematical Methods or Specialist Mathematics Units 3&4 study score at least 25"
    ],
    requirementType: "formal prerequisite",
    notes: "Monash course page also lists a 2026 lowest selection rank of 84.05 and Monash Guarantee of 75.",
    sourceLink: sources.monashComputerScience.url,
    lastChecked: checkedDate
  },
  monashEngineering: {
    university: "Monash University",
    courseName: "Bachelor of Engineering (Honours)",
    atarValue: "82.00",
    atarType: "2026 lowest ATAR to which an offer was made",
    year: 2026,
    subjectRequirements: [
      "English Units 3&4 study score at least 25",
      "Mathematical Methods or Specialist Mathematics Units 3&4 study score at least 25",
      "Chemistry or Physics Units 3&4 study score at least 25"
    ],
    requirementType: "formal prerequisite",
    notes: "Use the specific engineering specialisation page before decisions; ATAR can vary by specialisation and pathway.",
    sourceLink: sources.monashEngineering.url,
    lastChecked: checkedDate
  },
  monashCommerce: {
    university: "Monash University",
    courseName: "Bachelor of Commerce",
    atarValue: "84.45",
    atarType: "2026 lowest ATAR to which an offer was made",
    year: 2026,
    subjectRequirements: [
      "English Units 3&4 study score at least 25",
      "Mathematical Methods or Specialist Mathematics Units 3&4 study score at least 25"
    ],
    requirementType: "formal prerequisite",
    notes: "Commerce prerequisites are course-level; majors such as Finance and Economics may recommend stronger quantitative preparation.",
    sourceLink: sources.monashCommerce.url,
    lastChecked: checkedDate
  },
  monashScience: {
    university: "Monash University",
    courseName: "Bachelor of Science",
    atarValue: "82.00",
    atarType: "2026 lowest ATAR to which an offer was made",
    year: 2026,
    subjectRequirements: [
      "English Units 3&4 study score at least 25",
      "One approved science/other VCE subject Units 3&4 study score at least 25"
    ],
    requirementType: "formal prerequisite",
    notes: "Specific majors can require or strongly recommend particular first-year sequences.",
    sourceLink: sources.monashScience.url,
    lastChecked: checkedDate
  },
  monashAppliedDataScience: {
    university: "Monash University",
    courseName: "Bachelor of Applied Data Science",
    atarValue: "83.50",
    atarType: "2026 lowest ATAR to which an offer was made",
    year: 2026,
    subjectRequirements: [
      "English Units 3&4 study score at least 25",
      "Mathematical Methods or Specialist Mathematics Units 3&4 study score at least 25"
    ],
    requirementType: "formal prerequisite",
    notes: "Course is a direct data science pathway; compare with science, IT, commerce analytics, and computer science pathways.",
    sourceLink: sources.monashAppliedDataScience.url,
    lastChecked: checkedDate
  },
  monashNursing: {
    university: "Monash University",
    courseName: "Bachelor of Nursing",
    atarValue: "70.05",
    atarType: "2026 lowest ATAR to which an offer was made",
    year: 2026,
    subjectRequirements: [
      "English Units 3&4 study score at least 25",
      "VCE mathematics completion requirement"
    ],
    requirementType: "formal prerequisite",
    notes: "Nursing also has professional placement, registration, and English language requirements.",
    sourceLink: sources.monashNursing.url,
    lastChecked: checkedDate
  },
  monashEducation: {
    university: "Monash University",
    courseName: "Bachelor of Education (Honours)",
    atarValue: "70.00",
    atarType: "2026 lowest ATAR to which an offer was made",
    year: 2026,
    subjectRequirements: [
      "English Units 3&4 study score at least 30 EAL or 25 other English",
      "VCE mathematics completion requirement"
    ],
    requirementType: "formal prerequisite",
    notes: "Teacher education also requires placement readiness and later teacher registration.",
    sourceLink: sources.monashEducation.url,
    lastChecked: checkedDate
  },
  monashLaw: {
    university: "Monash University",
    courseName: "Bachelor of Laws (Honours)",
    atarValue: "90.05",
    atarType: "2026 lowest ATAR to which an offer was made",
    year: 2026,
    subjectRequirements: [
      "English Units 3&4 study score at least 35 EAL or 30 other English"
    ],
    requirementType: "formal prerequisite",
    notes: "No VCE maths prerequisite is listed on the representative Monash course page.",
    sourceLink: sources.monashLaw.url,
    lastChecked: checkedDate
  },
  melbourneScience: {
    university: "University of Melbourne",
    courseName: "Bachelor of Science",
    atarValue: "91.00",
    atarType: "2026 guaranteed ATAR",
    year: 2026,
    subjectRequirements: [
      "Course prerequisites must be satisfied",
      "Mathematics and science preparation depends on the intended major and subject sequence"
    ],
    requirementType: "formal prerequisite",
    notes: "Melbourne publishes a guaranteed ATAR and detailed prerequisite checks through the course page; confirm the intended major sequence.",
    sourceLink: "https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-science/entry-requirements/",
    lastChecked: checkedDate
  },
  melbourneDesign: {
    university: "University of Melbourne",
    courseName: "Bachelor of Design",
    atarValue: "85.00",
    atarType: "2026 guaranteed ATAR",
    year: 2026,
    subjectRequirements: [
      "Course prerequisites must be satisfied",
      "Engineering systems pathways may require careful subject planning for later engineering study"
    ],
    requirementType: "formal prerequisite",
    notes: "Used here for design/engineering-system style pathways, not as a direct professional engineering degree.",
    sourceLink: "https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-design/entry-requirements",
    lastChecked: checkedDate
  },
  melbourneCommerce: {
    university: "University of Melbourne",
    courseName: "Bachelor of Commerce",
    atarValue: "93.00",
    atarType: "2026 guaranteed ATAR",
    year: 2026,
    subjectRequirements: [
      "Course prerequisites must be satisfied",
      "Quantitative majors require appropriate mathematics preparation"
    ],
    requirementType: "formal prerequisite",
    notes: "Use the course page prerequisite checker for the exact VCE English and mathematics combination.",
    sourceLink: "https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-commerce/entry-requirements/",
    lastChecked: checkedDate
  },
  melbourneArts: {
    university: "University of Melbourne",
    courseName: "Bachelor of Arts",
    atarValue: "88.00",
    atarType: "2026 guaranteed ATAR",
    year: 2026,
    subjectRequirements: [
      "Course prerequisites must be satisfied",
      "No single VCE subject set should be treated as a universal law or economics pathway"
    ],
    requirementType: "formal prerequisite",
    notes: "Useful comparison entry for humanities, policy, economics-adjacent, and law-graduate pathway planning.",
    sourceLink: "https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-arts/entry-requirements/",
    lastChecked: checkedDate
  },
  unswEngineering: {
    university: "UNSW Sydney",
    courseName: "Bachelor of Engineering (Honours)",
    atarValue: "92.00",
    atarType: "2025 lowest selection rank",
    year: 2025,
    subjectRequirements: ["Mathematics Extension 1", "Physics"],
    requirementType: "assumed knowledge",
    notes: "UNSW states ATAR varies by specialisation; source page lists 2025 lowest ATAR 80.4 for the broad engineering course and assumed knowledge in Maths Extension 1 and Physics.",
    sourceLink: "https://www.unsw.edu.au/study/undergraduate/bachelor-of-engineering-honours",
    lastChecked: checkedDate
  },
  unswComputerScience: {
    university: "UNSW Sydney",
    courseName: "Bachelor of Computer Science",
    atarValue: "90.00",
    atarType: "2025 lowest selection rank",
    year: 2025,
    subjectRequirements: ["Mathematics Extension 1"],
    requirementType: "assumed knowledge",
    notes: "UNSW commonly lists assumed knowledge rather than VCE-style formal prerequisites for NSW applicants; verify current admissions data.",
    sourceLink: "https://www.unsw.edu.au/study/undergraduate/bachelor-of-computer-science",
    lastChecked: checkedDate
  }
} satisfies Record<string, Go8Entry>;

export const majors: Major[] = [
  makeMajor({
    id: "computer-science",
    name: "Computer Science",
    summary: "Computing pathway focused on software, algorithms, systems, data, security, and AI foundations.",
    go8Entries: [go8.monashComputerScience, go8.unswComputerScience, go8.melbourneScience],
    graduateRoles: ["Software developer", "Data analyst", "Technology consultant"],
    salaryRange: "$75,300 median annual full-time salary for domestic undergraduates in QILT Computing and information systems, 2024.",
    employmentOutlook: qiltComputing,
    graduateNotes: "QILT is a broad study-area benchmark, not a guarantee for a Computer Science graduate or any individual university.",
    graduateSources: [sources.qilt],
    occupations: ["Software and applications programmer", "Developer programmer", "Systems analyst"],
    workStyle: "Technical project work: analysing requirements, designing systems, programming, testing, debugging, and maintaining software.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 41 per week for Software and Applications Programmers.",
    jobEnvironment: "Computer systems design, professional services, finance, public administration, education, and other organisations that run software systems.",
    typicalTasks: "Researching, analysing and evaluating system requirements; writing and maintaining code; testing software; preparing technical documentation.",
    tradeOffs: "Good flexibility and broad demand, but junior roles can be competitive and practical project evidence matters.",
    riskNotes: "Technology stacks change quickly; students need ongoing self-learning, portfolio work, and interview preparation.",
    occupationSources: [sources.jsaSoftware],
    scoringProfile: {
      salaryPotential: 4, workLifeBalance: 4, codingIntensity: 5, mathsPhysicsFit: 4,
      competitionLevel: 4, riskLevel: 3, remoteWorkFit: 2, stabilityLevel: 4,
      flexibilityLevel: 5, peopleFacingLevel: 2, technicalLevel: 5,
      interestFit: { maths: 4, physics: 2, chemistry: 1, coding: 5, business: 2 }
    },
    overallNotes: "Best suited to students who genuinely enjoy coding, abstract problem solving, and continuous technical learning."
  }),
  makeMajor({
    id: "software-engineering",
    name: "Software Engineering",
    summary: "Engineering-style software pathway focused on reliable software systems, teamwork, testing, architecture, and delivery.",
    go8Entries: [go8.monashEngineering, go8.unswEngineering, go8.melbourneScience],
    graduateRoles: ["Graduate software engineer", "Application developer", "DevOps associate"],
    salaryRange: "$80,000 median annual full-time salary for domestic undergraduates in QILT Engineering, 2024.",
    employmentOutlook: qiltEngineering,
    graduateNotes: "Engineering QILT outcomes cover all engineering fields, so they are broader than software engineering alone.",
    graduateSources: [sources.qilt],
    occupations: ["Software and applications programmer", "Software engineer", "Application developer"],
    workStyle: "Technical build-and-maintain work with planning, code review, testing, documentation, and team delivery.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 41 per week for Software and Applications Programmers.",
    jobEnvironment: "Technology teams in software companies, consultancies, banks, government, health, education, and infrastructure businesses.",
    typicalTasks: "Translating requirements into software, writing and testing code, maintaining systems, reviewing designs, and resolving defects.",
    tradeOffs: "Applied and employable, but students need sustained coding practice outside class.",
    riskNotes: "Junior hiring can be selective; technical interviews, internships, and portfolio quality can strongly affect outcomes.",
    occupationSources: [sources.jsaSoftware],
    scoringProfile: {
      salaryPotential: 4, workLifeBalance: 4, codingIntensity: 5, mathsPhysicsFit: 4,
      competitionLevel: 4, riskLevel: 3, remoteWorkFit: 2, stabilityLevel: 4,
      flexibilityLevel: 5, peopleFacingLevel: 3, technicalLevel: 5,
      interestFit: { maths: 4, physics: 2, chemistry: 1, coding: 5, business: 2 }
    },
    overallNotes: "A strong pathway for students who want software plus a more structured engineering identity."
  }),
  makeMajor({
    id: "electrical-engineering",
    name: "Electrical Engineering",
    summary: "Engineering pathway for electronics, power systems, telecommunications, control systems, sensors, and embedded hardware.",
    go8Entries: [go8.monashEngineering, go8.unswEngineering, go8.melbourneScience],
    graduateRoles: ["Graduate electrical engineer", "Power systems analyst", "Electronics engineer"],
    salaryRange: "$80,000 median annual full-time salary for domestic undergraduates in QILT Engineering, 2024.",
    employmentOutlook: qiltEngineering,
    graduateNotes: "The graduate outcome source is the broad Engineering study area, not electrical engineering alone.",
    graduateSources: [sources.qilt],
    occupations: ["Electrical engineer", "Electronics engineer", "Control systems engineer"],
    workStyle: "Technical design, modelling, testing, fault finding, compliance, documentation, and project delivery.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 43 per week for Electrical Engineers.",
    jobEnvironment: "Utilities, energy, infrastructure, manufacturing, transport, mining, defence, telecommunications, and consulting engineering.",
    typicalTasks: "Designing electrical systems, preparing specifications, supervising installation, testing equipment, and investigating faults.",
    tradeOffs: "Strong technical depth and infrastructure relevance, but university maths and physics load is heavy.",
    riskNotes: "Some roles require site work, safety obligations, professional accreditation, or specialised hardware knowledge.",
    occupationSources: [sources.jsaElectrical],
    scoringProfile: {
      salaryPotential: 4, workLifeBalance: 3, codingIntensity: 3, mathsPhysicsFit: 5,
      competitionLevel: 3, riskLevel: 3, remoteWorkFit: 3, stabilityLevel: 4,
      flexibilityLevel: 3, peopleFacingLevel: 2, technicalLevel: 5,
      interestFit: { maths: 5, physics: 5, chemistry: 1, coding: 3, business: 1 }
    },
    overallNotes: "A strong fit for students who enjoy physics, systems, hardware, and real-world infrastructure."
  }),
  makeMajor({
    id: "mechanical-engineering",
    name: "Mechanical Engineering",
    summary: "Engineering pathway for machines, materials, thermodynamics, manufacturing, robotics, energy, and product design.",
    go8Entries: [go8.monashEngineering, go8.unswEngineering, go8.melbourneScience],
    graduateRoles: ["Graduate mechanical engineer", "Design engineer", "Manufacturing engineer"],
    salaryRange: "$80,000 median annual full-time salary for domestic undergraduates in QILT Engineering, 2024.",
    employmentOutlook: qiltEngineering,
    graduateNotes: "The graduate outcome source is the broad Engineering study area, not mechanical engineering alone.",
    graduateSources: [sources.qilt],
    occupations: ["Mechanical engineer", "Industrial engineer", "Production engineer"],
    workStyle: "Design, analysis, modelling, testing, documentation, and practical engineering problem solving.",
    workingHours: "Jobs and Skills Australia reports median full-time earnings of $2,614/week for Industrial, Mechanical and Production Engineers; hours vary by role and site.",
    jobEnvironment: "Manufacturing, transport, energy, defence, resources, construction, product design, consulting, and operations.",
    typicalTasks: "Analysing plant, processes and components; establishing work standards; improving equipment efficiency; supporting manufacturing and maintenance.",
    tradeOffs: "Broad engineering base with many industries, but job location and salary can vary more than software.",
    riskNotes: "Some roles are site-based, cyclical, or tied to manufacturing and resources investment.",
    occupationSources: [sources.jsaMechanical],
    scoringProfile: {
      salaryPotential: 4, workLifeBalance: 3, codingIntensity: 2, mathsPhysicsFit: 5,
      competitionLevel: 3, riskLevel: 3, remoteWorkFit: 3, stabilityLevel: 4,
      flexibilityLevel: 3, peopleFacingLevel: 2, technicalLevel: 5,
      interestFit: { maths: 5, physics: 5, chemistry: 2, coding: 2, business: 1 }
    },
    overallNotes: "Good for students who like physics, machines, design, and tangible systems."
  }),
  makeMajor({
    id: "civil-engineering",
    name: "Civil Engineering",
    summary: "Engineering pathway for infrastructure: buildings, roads, bridges, transport, water, geotechnical systems, and construction.",
    go8Entries: [go8.monashEngineering, go8.unswEngineering, go8.melbourneDesign],
    graduateRoles: ["Graduate civil engineer", "Structural engineering assistant", "Transport planner"],
    salaryRange: "$80,000 median annual full-time salary for domestic undergraduates in QILT Engineering, 2024.",
    employmentOutlook: qiltEngineering,
    graduateNotes: "The graduate outcome source is the broad Engineering study area, not civil engineering alone.",
    graduateSources: [sources.qilt],
    occupations: ["Civil engineer", "Structural engineer", "Geotechnical engineer"],
    workStyle: "A mix of technical design, project coordination, standards, site visits, documentation, and stakeholder work.",
    workingHours: "Jobs and Skills Australia reports median full-time earnings of $2,217/week for Civil Engineering Professionals; project and site roles can vary.",
    jobEnvironment: "Consulting engineering, construction, councils, infrastructure agencies, water authorities, transport projects, and construction sites.",
    typicalTasks: "Planning and designing civil systems, analysing structural behaviour, preparing specifications, estimating costs, and supervising construction work.",
    tradeOffs: "Stable infrastructure demand, but project pressure and site work can be demanding.",
    riskNotes: "Work conditions vary by employer; site roles can have early starts, travel, weather exposure, and safety obligations.",
    occupationSources: [sources.jsaCivil],
    scoringProfile: {
      salaryPotential: 4, workLifeBalance: 3, codingIntensity: 2, mathsPhysicsFit: 4,
      competitionLevel: 3, riskLevel: 3, remoteWorkFit: 3, stabilityLevel: 5,
      flexibilityLevel: 3, peopleFacingLevel: 3, technicalLevel: 4,
      interestFit: { maths: 4, physics: 4, chemistry: 1, coding: 1, business: 2 }
    },
    overallNotes: "Often attractive for students who want visible public infrastructure impact and relatively stable demand."
  }),
  makeMajor({
    id: "mining-engineering",
    name: "Mining Engineering",
    summary: "Engineering pathway for mine planning, extraction, safety, resources operations, and mineral production systems.",
    go8Entries: [go8.unswEngineering, go8.monashEngineering, go8.melbourneScience],
    graduateRoles: ["Graduate mining engineer", "Mine planning engineer", "Operations engineer"],
    salaryRange: "$80,000 median annual full-time salary for domestic undergraduates in QILT Engineering, 2024.",
    employmentOutlook: qiltEngineering,
    graduateNotes: "The graduate outcome source is the broad Engineering study area; mining-specific roles may pay differently and are more location-dependent.",
    graduateSources: [sources.qilt],
    occupations: ["Mining engineer", "Mine planning engineer", "Drill and blast engineer"],
    workStyle: "Technical operations work involving mine planning, extraction systems, safety, production monitoring, and site coordination.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 50 per week for Mining Engineers.",
    jobEnvironment: "Mines, remote operations centres, regional areas, FIFO/DIDO worksites, resources companies, and engineering consultancies.",
    typicalTasks: "Planning and directing mine construction and operation, coordinating extraction, monitoring safety, and analysing production performance.",
    tradeOffs: "Very strong earnings signal, but the work can involve remote locations, long rosters, and exposure to commodity cycles.",
    riskNotes: "Lifestyle disruption, safety risk, resources-market cycles, and regional or FIFO expectations are central risks.",
    occupationSources: [sources.jsaMining],
    scoringProfile: {
      salaryPotential: 5, workLifeBalance: 2, codingIntensity: 2, mathsPhysicsFit: 4,
      competitionLevel: 2, riskLevel: 5, remoteWorkFit: 5, stabilityLevel: 3,
      flexibilityLevel: 2, peopleFacingLevel: 3, technicalLevel: 4,
      interestFit: { maths: 4, physics: 4, chemistry: 3, coding: 1, business: 2 }
    },
    overallNotes: "High-income potential is real, but students should treat location and roster lifestyle as a primary decision factor."
  }),
  makeMajor({
    id: "commerce",
    name: "Commerce",
    summary: "Business pathway covering accounting, economics, finance, management, marketing, analytics, and commercial decision making.",
    go8Entries: [go8.monashCommerce, go8.melbourneCommerce],
    graduateRoles: ["Graduate accountant", "Business analyst", "Management consultant"],
    salaryRange: "$72,000 median annual full-time salary for domestic undergraduates in QILT Business and management, 2024.",
    employmentOutlook: qiltBusiness,
    graduateNotes: "Business and management outcomes are broad; actual outcomes depend strongly on major, internships, grades, communication, and technical skills.",
    graduateSources: [sources.qilt],
    occupations: ["Accountant", "Business analyst", "Management consultant"],
    workStyle: "Commercial analysis, reporting, stakeholder communication, presentations, compliance, budgeting, and business problem solving.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 43 per week for Accountants.",
    jobEnvironment: "Professional services, banks, corporate offices, government, consulting, startups, and internal finance or operations teams.",
    typicalTasks: "Preparing financial statements, analysing business performance, advising on costs and compliance, and supporting management decisions.",
    tradeOffs: "Very flexible degree, but broad pathways require deliberate skill building and internships.",
    riskNotes: "Students can drift without a specialisation; graduate roles are more competitive when practical skills are weak.",
    occupationSources: [sources.jsaAccountants],
    scoringProfile: {
      salaryPotential: 3, workLifeBalance: 3, codingIntensity: 1, mathsPhysicsFit: 2,
      competitionLevel: 4, riskLevel: 3, remoteWorkFit: 1, stabilityLevel: 4,
      flexibilityLevel: 4, peopleFacingLevel: 4, technicalLevel: 2,
      interestFit: { maths: 2, physics: 1, chemistry: 1, coding: 1, business: 5 }
    },
    overallNotes: "A flexible starting point for students who want business exposure before choosing a narrower career lane."
  }),
  makeMajor({
    id: "finance",
    name: "Finance",
    summary: "Business pathway focused on investment, banking, valuation, risk, markets, financial modelling, and capital allocation.",
    go8Entries: [go8.monashCommerce, go8.melbourneCommerce],
    graduateRoles: ["Finance analyst", "Risk analyst", "Investment banking analyst"],
    salaryRange: "$72,000 median annual full-time salary for domestic undergraduates in QILT Business and management, 2024.",
    employmentOutlook: qiltBusiness,
    graduateNotes: "QILT is broad business data; high-end finance roles can pay more but are also more selective and hours-intensive.",
    graduateSources: [sources.qilt],
    occupations: ["Financial investment adviser", "Financial investment manager", "Finance analyst"],
    workStyle: "Analytical and commercial work involving financial modelling, market research, risk review, client materials, and investment decisions.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 45 per week for Financial Investment Advisers and Managers.",
    jobEnvironment: "Banks, funds, advisory firms, fintech, corporate finance teams, wealth management, and transaction advisory.",
    typicalTasks: "Analysing financial status and objectives, developing investment strategies, monitoring performance, and advising on financial options.",
    tradeOffs: "Higher earnings ceiling than many business paths, but competition and workload can be intense.",
    riskNotes: "Networking, internships, grades, modelling skills, and market cycles can strongly affect early-career options.",
    occupationSources: [sources.jsaFinance],
    scoringProfile: {
      salaryPotential: 4, workLifeBalance: 2, codingIntensity: 2, mathsPhysicsFit: 3,
      competitionLevel: 5, riskLevel: 4, remoteWorkFit: 1, stabilityLevel: 3,
      flexibilityLevel: 3, peopleFacingLevel: 4, technicalLevel: 3,
      interestFit: { maths: 4, physics: 1, chemistry: 1, coding: 2, business: 5 }
    },
    overallNotes: "Most attractive for students who are income-focused and comfortable with pressure, networking, and competition."
  }),
  makeMajor({
    id: "economics",
    name: "Economics",
    summary: "Analytical pathway for markets, policy, incentives, data interpretation, social systems, and decision making.",
    go8Entries: [go8.monashCommerce, go8.melbourneCommerce, go8.melbourneArts],
    graduateRoles: ["Economic analyst", "Policy analyst", "Research assistant"],
    salaryRange: "$72,000 median annual full-time salary for domestic undergraduates in QILT Business and management, 2024.",
    employmentOutlook: qiltBusiness,
    graduateNotes: "Economics can sit across commerce, business, policy, and social science degrees; outcomes depend on quantitative depth and experience.",
    graduateSources: [sources.qilt],
    occupations: ["Economist", "Policy analyst", "Market analyst"],
    workStyle: "Analytical reading, data work, modelling, policy interpretation, writing, briefing, and explaining trade-offs.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 43 per week for Economists.",
    jobEnvironment: "Government, banks, consulting, research organisations, think tanks, regulators, universities, and corporates.",
    typicalTasks: "Analysing economic data, researching market conditions, forecasting trends, evaluating policy, and preparing reports.",
    tradeOffs: "Good analytical foundation, but specialist economist roles often reward honours, postgraduate study, or strong data skills.",
    riskNotes: "The career path can feel indirect without statistics, coding, policy, finance, or research experience.",
    occupationSources: [sources.jsaEconomists],
    scoringProfile: {
      salaryPotential: 4, workLifeBalance: 4, codingIntensity: 2, mathsPhysicsFit: 3,
      competitionLevel: 3, riskLevel: 3, remoteWorkFit: 1, stabilityLevel: 4,
      flexibilityLevel: 4, peopleFacingLevel: 3, technicalLevel: 3,
      interestFit: { maths: 4, physics: 1, chemistry: 1, coding: 2, business: 4 }
    },
    overallNotes: "A good bridge for students interested in maths, policy, business, and society."
  }),
  makeMajor({
    id: "mathematics",
    name: "Mathematics",
    summary: "Quantitative pathway for abstract reasoning, proof, modelling, optimisation, statistics, and analytical problem solving.",
    go8Entries: [go8.monashScience, go8.melbourneScience],
    graduateRoles: ["Data analyst", "Quantitative analyst assistant", "Research assistant"],
    salaryRange: "$72,400 median annual full-time salary for domestic undergraduates in QILT Science and mathematics, 2024.",
    employmentOutlook: qiltScience,
    furtherStudyCommon: true,
    graduateNotes: "Science and mathematics graduates had lower full-time employment than vocational fields in QILT 2024; applied skills can improve employability.",
    graduateSources: [sources.qilt],
    occupations: ["Mathematician", "Statistician", "Actuary"],
    workStyle: "Deep technical thinking, modelling, proof, statistical analysis, optimisation, coding, and quantitative explanation.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 42 per week for Actuaries, Mathematicians and Statisticians.",
    jobEnvironment: "Finance, insurance, consulting, government, universities, analytics teams, research, technology, and education.",
    typicalTasks: "Applying mathematical principles, preparing models, analysing data, estimating risk, and interpreting quantitative results.",
    tradeOffs: "Powerful foundation, but the career path is clearer when combined with statistics, coding, finance, teaching, or research.",
    riskNotes: "Pure mathematics can feel abstract to employers unless paired with practical evidence of applied skills.",
    occupationSources: [sources.jsaMathStats],
    scoringProfile: {
      salaryPotential: 3, workLifeBalance: 4, codingIntensity: 3, mathsPhysicsFit: 5,
      competitionLevel: 3, riskLevel: 3, remoteWorkFit: 1, stabilityLevel: 4,
      flexibilityLevel: 4, peopleFacingLevel: 2, technicalLevel: 5,
      interestFit: { maths: 5, physics: 3, chemistry: 1, coding: 3, business: 1 }
    },
    overallNotes: "A strong option for students who love maths and are willing to build an applied skill set alongside it."
  }),
  makeMajor({
    id: "statistics-data-science",
    name: "Statistics / Data Science",
    summary: "Quantitative pathway for data analysis, statistics, machine learning, experimentation, modelling, and decision support.",
    go8Entries: [go8.monashAppliedDataScience, go8.monashScience, go8.melbourneScience],
    graduateRoles: ["Data analyst", "Business intelligence analyst", "Junior data scientist"],
    salaryRange: "$75,300 median annual full-time salary for QILT Computing and information systems; $72,400 for Science and mathematics, 2024.",
    employmentOutlook: "QILT 2024: Computing and information systems recorded 67.8% full-time employment and Science and mathematics recorded 63.6%; data science sits across both fields.",
    graduateNotes: "Data science outcomes vary depending on whether the course sits in IT, science, commerce, or mathematics and on the student's portfolio.",
    graduateSources: [sources.qilt],
    occupations: ["ICT business analyst", "Data analyst", "Statistician"],
    workStyle: "Technical analysis mixed with business framing, data cleaning, coding, modelling, dashboards, experiments, and communication.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 41 per week for ICT Business and Systems Analysts.",
    jobEnvironment: "Technology, finance, health, consulting, government, retail, education, research, and corporate analytics teams.",
    typicalTasks: "Investigating business needs, analysing data and systems, specifying requirements, building reports, and supporting evidence-based decisions.",
    tradeOffs: "Useful across many industries, but entry-level roles often expect SQL, Python or R, statistics, projects, and communication.",
    riskNotes: "The title 'data scientist' can be competitive for graduates; practical portfolio evidence matters.",
    occupationSources: [sources.jsaData, sources.jsaMathStats],
    scoringProfile: {
      salaryPotential: 4, workLifeBalance: 4, codingIntensity: 4, mathsPhysicsFit: 5,
      competitionLevel: 4, riskLevel: 3, remoteWorkFit: 1, stabilityLevel: 4,
      flexibilityLevel: 5, peopleFacingLevel: 3, technicalLevel: 5,
      interestFit: { maths: 5, physics: 2, chemistry: 1, coding: 4, business: 3 }
    },
    overallNotes: "A practical option for students who like maths and coding and want broad industry flexibility."
  }),
  makeMajor({
    id: "physics",
    name: "Physics",
    summary: "Science pathway focused on matter, energy, measurement, experimentation, modelling, and physical systems.",
    go8Entries: [go8.monashScience, go8.melbourneScience],
    graduateRoles: ["Research assistant", "Laboratory technician", "Data analyst"],
    salaryRange: "$72,400 median annual full-time salary for domestic undergraduates in QILT Science and mathematics, 2024.",
    employmentOutlook: qiltScience,
    furtherStudyCommon: true,
    graduateNotes: "Specialist physics careers often require honours, postgraduate study, or pairing physics with coding/data/engineering skills.",
    graduateSources: [sources.qilt],
    occupations: ["Physicist", "Research scientist", "Medical physicist pathway"],
    workStyle: "Experimental and theoretical problem solving, measurement, modelling, simulation, research reading, and technical communication.",
    workingHours: "Jobs and Skills Australia publishes a Physicists occupation profile but suppresses median earnings for this detailed occupation.",
    jobEnvironment: "Universities, laboratories, medical physics settings, defence, engineering, technology, data teams, and research organisations.",
    typicalTasks: "Designing experiments, analysing measurements, developing models, using instruments, writing reports, and interpreting physical systems.",
    tradeOffs: "Excellent intellectual and technical training, but direct physics jobs are fewer than broader engineering or IT roles.",
    riskNotes: "Students should plan for honours/postgraduate study or develop applied skills such as coding, data analysis, instrumentation, or teaching.",
    occupationSources: [sources.jsaPhysics],
    scoringProfile: {
      salaryPotential: 3, workLifeBalance: 4, codingIntensity: 3, mathsPhysicsFit: 5,
      competitionLevel: 3, riskLevel: 4, remoteWorkFit: 1, stabilityLevel: 3,
      flexibilityLevel: 4, peopleFacingLevel: 2, technicalLevel: 5,
      interestFit: { maths: 5, physics: 5, chemistry: 1, coding: 3, business: 1 }
    },
    overallNotes: "Best for students with deep curiosity about physical systems who are open to further study or adjacent technical careers."
  }),
  makeMajor({
    id: "nursing",
    name: "Nursing",
    summary: "Health pathway focused on patient care, clinical judgement, communication, documentation, safety, and healthcare teamwork.",
    go8Entries: [go8.monashNursing],
    graduateRoles: ["Registered nurse graduate", "Aged care nurse", "Community health nurse"],
    salaryRange: "$72,000 median annual full-time salary for domestic undergraduates in QILT Nursing, 2024.",
    employmentOutlook: qiltNursing,
    graduateNotes: "Nursing outcomes are relatively strong in QILT, but professional registration, placements, and English language standards are central.",
    graduateSources: [sources.qilt],
    occupations: ["Registered nurse", "Mental health nurse", "Community nurse"],
    workStyle: "Hands-on patient care, clinical assessment, medication support, documentation, communication, and healthcare coordination.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 41 per week for Registered Nurses; shift work is common.",
    jobEnvironment: "Hospitals, aged care, clinics, community health, mental health services, regional services, and specialist health settings.",
    typicalTasks: "Assessing patients, planning and implementing nursing care, monitoring treatment responses, educating patients, and coordinating with health teams.",
    tradeOffs: "Strong stability and public need, but physically and emotionally demanding work.",
    riskNotes: "Shift work, night/weekend work, placement demands, registration requirements, and workplace stress are important risks.",
    occupationSources: [sources.jsaNursing],
    scoringProfile: {
      salaryPotential: 3, workLifeBalance: 2, codingIntensity: 1, mathsPhysicsFit: 1,
      competitionLevel: 3, riskLevel: 3, remoteWorkFit: 2, stabilityLevel: 5,
      flexibilityLevel: 4, peopleFacingLevel: 5, technicalLevel: 3,
      interestFit: { maths: 1, physics: 1, chemistry: 3, coding: 1, business: 1 }
    },
    overallNotes: "A stable and practical pathway for students who can handle direct care, responsibility, and shift-based work."
  }),
  makeMajor({
    id: "teaching",
    name: "Teaching",
    summary: "Education pathway focused on lesson planning, classroom practice, child development, communication, assessment, and student support.",
    go8Entries: [go8.monashEducation],
    graduateRoles: ["Graduate teacher", "Tutor", "Education support officer"],
    salaryRange: "$78,800 median annual full-time salary for domestic undergraduates in QILT Teacher education, 2024.",
    employmentOutlook: qiltTeaching,
    graduateNotes: "Teacher education has strong QILT employment outcomes, but subject area, region, registration, and placement experience matter.",
    graduateSources: [sources.qilt],
    occupations: ["Secondary school teacher", "Primary school teacher", "Education coordinator"],
    workStyle: "Highly people-facing work involving lesson planning, teaching, assessment, classroom management, reporting, and family communication.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 45 per week for Secondary School Teachers.",
    jobEnvironment: "Schools, tutoring organisations, education departments, curriculum teams, and community education settings.",
    typicalTasks: "Preparing lessons, teaching classes, marking work, assessing progress, managing behaviour, and supporting student wellbeing.",
    tradeOffs: "Stable and meaningful work, but workload often extends beyond class time.",
    riskNotes: "Classroom management, marking, reporting, emotional labour, burnout, and registration requirements need serious consideration.",
    occupationSources: [sources.jsaTeaching],
    scoringProfile: {
      salaryPotential: 3, workLifeBalance: 3, codingIntensity: 1, mathsPhysicsFit: 2,
      competitionLevel: 2, riskLevel: 2, remoteWorkFit: 2, stabilityLevel: 5,
      flexibilityLevel: 3, peopleFacingLevel: 5, technicalLevel: 2,
      interestFit: { maths: 2, physics: 1, chemistry: 1, coding: 1, business: 1 }
    },
    overallNotes: "A strong option for students who enjoy explaining ideas, working with young people, and handling structured responsibility."
  }),
  makeMajor({
    id: "law",
    name: "Law",
    summary: "Professional pathway focused on legal reasoning, reading, writing, advocacy, negotiation, ethics, and regulatory systems.",
    go8Entries: [go8.monashLaw, go8.melbourneArts],
    graduateRoles: ["Law graduate", "Paralegal", "Policy officer"],
    salaryRange: "$76,000 median annual full-time salary for domestic undergraduates in QILT Law and paralegal studies, 2024.",
    employmentOutlook: qiltLaw,
    furtherStudyCommon: true,
    graduateNotes: "Legal practice usually requires practical legal training and admission steps beyond the degree.",
    graduateSources: [sources.qilt],
    occupations: ["Solicitor", "Barrister pathway", "Legal policy adviser"],
    workStyle: "Reading-heavy and writing-heavy work with client contact, research, negotiation, drafting, evidence review, and structured argument.",
    workingHours: "Jobs and Skills Australia reports average full-time hours of 46 per week for Solicitors.",
    jobEnvironment: "Law firms, courts, government, community legal centres, corporate legal teams, regulators, and policy organisations.",
    typicalTasks: "Preparing legal documents, advising clients, researching legislation and cases, negotiating settlements, and representing clients.",
    tradeOffs: "Respected and versatile qualification, but legal graduate jobs and commercial pathways can be very competitive.",
    riskNotes: "Heavy reading, long deadlines, professional admission steps, emotional stress, and high competition are major risks.",
    occupationSources: [sources.jsaLaw],
    scoringProfile: {
      salaryPotential: 4, workLifeBalance: 2, codingIntensity: 1, mathsPhysicsFit: 1,
      competitionLevel: 5, riskLevel: 4, remoteWorkFit: 1, stabilityLevel: 3,
      flexibilityLevel: 3, peopleFacingLevel: 5, technicalLevel: 3,
      interestFit: { maths: 1, physics: 1, chemistry: 1, coding: 1, business: 3 }
    },
    overallNotes: "Best suited to students with strong English, patience for dense reading, and interest in argument, detail, and people-facing work."
  })
];

export const vceSubjects = [
  "English",
  "Mathematical Methods",
  "Specialist Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computing",
  "Business Management",
  "Accounting",
  "Economics",
  "Legal Studies",
  "Psychology"
];

