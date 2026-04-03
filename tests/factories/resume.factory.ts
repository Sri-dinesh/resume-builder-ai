import type { ResumeValues } from "@/lib/validation";

export interface TestUser {
  id: string;
  email: string;
  tier: "free" | "pro" | "pro_plus";
}

export interface JobDescriptionFixture {
  id: string;
  title: string;
  content: string;
}

export interface PaymentScenarioFixture {
  id: string;
  type: "success" | "failure" | "refund" | "chargeback";
  amount: number;
  currency: string;
}

const INDUSTRIES = [
  "Software",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Operations",
  "Product",
  "Marketing",
  "Design",
  "Data",
];

const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Product Manager",
  "Data Analyst",
  "UX Designer",
  "Sales Manager",
  "Marketing Specialist",
  "Operations Lead",
  "Technical Recruiter",
];

const SKILL_SETS = [
  ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"],
  ["Python", "SQL", "Tableau", "Excel", "Power BI"],
  ["Figma", "UX Research", "Accessibility", "Design Systems", "Prototyping"],
  ["SEO", "Analytics", "Content Strategy", "A/B Testing", "HubSpot"],
  ["AWS", "Docker", "CI/CD", "Terraform", "Kubernetes"],
];

export function buildResumeFactory(index = 1): ResumeValues {
  const role = ROLES[index % ROLES.length];
  const skillSet = SKILL_SETS[index % SKILL_SETS.length];

  return {
    id: `resume-${index}`,
    title: `${role} Resume ${index}`,
    description: `Targeted ${role.toLowerCase()} resume for ${INDUSTRIES[index % INDUSTRIES.length]}.`,
    firstName: `Candidate${index}`,
    lastName: "SparkCV",
    jobTitle: role,
    city: "Bengaluru",
    country: "India",
    phone: "9876543210",
    email: `candidate${index}@example.com`,
    linkedin: `https://linkedin.com/in/candidate${index}`,
    website: `https://portfolio${index}.example.com`,
    websiteName: `Portfolio ${index}`,
    summary:
      "Results-driven professional with measurable impact across delivery, automation, and stakeholder management.",
    workExperiences: [
      {
        position: role,
        company: `Company ${index}`,
        startDate: "2023-01-01",
        endDate: "2025-03-01",
        description:
          "\u2022 Built features used by 25k users\n\u2022 Improved conversion by 18%\n\u2022 Reduced release time by 40%",
        locationType: "Hybrid",
      },
    ],
    projects: [
      {
        ProjectName: `Project ${index}`,
        toolsUsed: skillSet.join(", "),
        startDate: "2024-02-01",
        endDate: "2024-10-01",
        description:
          "Developed an internal platform with analytics dashboards and automation workflows.",
        demoLink: `https://demo${index}.example.com`,
      },
    ],
    educations: [
      {
        degree: "B.Tech",
        school: `University ${index}`,
        startDate: "2018-06-01",
        endDate: "2022-05-01",
      },
    ],
    certifications: [
      {
        certificationName: `Certification ${index}`,
        awardedBy: "SparkCV Academy",
        awardedDate: "2024-06-01",
      },
    ],
    skills: skillSet,
    borderStyle: "squircle",
    colorHex: "#0F172A",
    fontFamily: "Arial",
    photo: undefined,
  };
}

export function buildResumeText(index = 1) {
  const resume = buildResumeFactory(index);
  return [
    `${resume.firstName} ${resume.lastName}`,
    resume.email,
    resume.phone,
    resume.linkedin,
    resume.jobTitle,
    "Summary",
    resume.summary,
    "Experience",
    ...(resume.workExperiences ?? []).flatMap((exp) => [
      `${exp.position} | ${exp.company}`,
      `${exp.startDate} - ${exp.endDate}`,
      ...(exp.description?.split("\n") ?? []),
    ]),
    "Education",
    ...(resume.educations ?? []).map((edu) => `${edu.degree} - ${edu.school}`),
    "Skills",
    ...(resume.skills ?? []),
  ].join("\n");
}

export function buildSampleResumes(count = 60) {
  return Array.from({ length: count }, (_, idx) => buildResumeFactory(idx + 1));
}

export function buildSampleResumeTexts(count = 60) {
  return Array.from({ length: count }, (_, idx) => buildResumeText(idx + 1));
}

export function buildTestUsers(): TestUser[] {
  return Array.from({ length: 24 }, (_, idx) => ({
    id: `user-${idx + 1}`,
    email: `user${idx + 1}@example.com`,
    tier: idx < 8 ? "free" : idx < 16 ? "pro" : "pro_plus",
  }));
}

export function buildJobDescriptions(): JobDescriptionFixture[] {
  return [
    {
      id: "jd-001",
      title: "Frontend Engineer",
      content:
        "Seeking a frontend engineer with React, Next.js, TypeScript, accessibility, performance optimization, and testing experience.",
    },
    {
      id: "jd-002",
      title: "Backend Engineer",
      content:
        "Looking for Node.js, PostgreSQL, API design, observability, security, and cloud deployment experience.",
    },
    {
      id: "jd-003",
      title: "Product Manager",
      content:
        "Need product discovery, roadmap planning, analytics, experimentation, stakeholder management, and delivery leadership.",
    },
    {
      id: "jd-004",
      title: "Data Analyst",
      content:
        "Requires SQL, Python, dashboards, business intelligence, experimentation analysis, and communication skills.",
    },
    {
      id: "jd-005",
      title: "UX Designer",
      content:
        "Must have design systems, Figma, prototyping, research synthesis, accessibility, and cross-functional collaboration.",
    },
    {
      id: "jd-006",
      title: "DevOps Engineer",
      content:
        "Experience with AWS, Docker, CI/CD, Terraform, Kubernetes, monitoring, and incident response required.",
    },
    {
      id: "jd-007",
      title: "Marketing Specialist",
      content:
        "SEO, campaign management, analytics, content strategy, conversion optimization, and reporting experience needed.",
    },
    {
      id: "jd-008",
      title: "Sales Manager",
      content:
        "Pipeline management, revenue forecasting, CRM, customer relationships, negotiation, and coaching required.",
    },
    {
      id: "jd-009",
      title: "Recruiter",
      content:
        "Requires sourcing, interviewing, stakeholder alignment, reporting, candidate experience, and hiring operations.",
    },
    {
      id: "jd-010",
      title: "Operations Lead",
      content:
        "Seeks process improvement, vendor management, KPIs, reporting, workflow automation, and team leadership.",
    },
  ];
}

export function buildPaymentScenarios(): PaymentScenarioFixture[] {
  return [
    { id: "pay-001", type: "success", amount: 2900, currency: "usd" },
    { id: "pay-002", type: "failure", amount: 2900, currency: "usd" },
    { id: "pay-003", type: "refund", amount: 2900, currency: "usd" },
    { id: "pay-004", type: "chargeback", amount: 2900, currency: "usd" },
  ];
}

export function buildEdgeCaseInputs() {
  return {
    empty: "",
    whitespace: "   ",
    unicode: "नमस्ते résumé 数据 工程師",
    xss: "<script>alert('xss')</script>",
    sql: "'; DROP TABLE resumes; --",
    maxLength: "A".repeat(20000),
    longJobDescription: "keyword ".repeat(2500),
  };
}
