import type {
  ScoreAnalysisResult,
  ScoreCategoryData,
  ScoreCategoryKey,
  ScoreRecommendation,
  ScoreRecommendationPriority,
} from "@/lib/score";

type SectionName =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications";

type CategoryEvaluation = ScoreCategoryData & {
  recommendations: ScoreRecommendation[];
  strengths: string[];
};

const ACTION_VERBS = [
  "achieved",
  "analyzed",
  "automated",
  "built",
  "created",
  "delivered",
  "designed",
  "developed",
  "implemented",
  "improved",
  "increased",
  "launched",
  "led",
  "managed",
  "optimized",
  "reduced",
  "scaled",
  "streamlined",
];

const BUZZWORDS = [
  "hardworking",
  "team player",
  "self-starter",
  "detail-oriented",
  "results-driven",
  "go-getter",
  "go getter",
];

const COMMON_SKILLS = [
  "javascript",
  "typescript",
  "python",
  "java",
  "sql",
  "react",
  "next.js",
  "node.js",
  "graphql",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "terraform",
  "ci/cd",
  "agile",
  "scrum",
  "excel",
  "tableau",
  "power bi",
  "seo",
  "product management",
  "project management",
  "leadership",
  "communication",
];

const SECTION_PATTERNS: Array<{
  name: SectionName;
  label: string;
  patterns: RegExp[];
}> = [
  {
    name: "summary",
    label: "Professional Summary",
    patterns: [/^summary$/, /^professional summary$/, /^profile$/],
  },
  {
    name: "experience",
    label: "Work Experience",
    patterns: [
      /^experience$/,
      /^work experience$/,
      /^professional experience$/,
      /^employment history$/,
    ],
  },
  {
    name: "education",
    label: "Education",
    patterns: [/^education$/, /^academic background$/],
  },
  {
    name: "skills",
    label: "Skills",
    patterns: [
      /^skills$/,
      /^technical skills$/,
      /^skills & tools$/,
      /^core competencies$/,
      /^technologies$/,
    ],
  },
  {
    name: "projects",
    label: "Projects",
    patterns: [/^projects$/, /^relevant projects$/],
  },
  {
    name: "certifications",
    label: "Certifications",
    patterns: [/^certifications$/, /^licenses$/, /^certificates$/],
  },
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "be",
  "for",
  "from",
  "in",
  "is",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
  "you",
  "your",
  "job",
  "role",
  "requirements",
  "preferred",
  "must",
  "should",
  "responsible",
  "including",
  "ability",
  "knowledge",
  "candidate",
  "candidates",
  "position",
  "company",
  "business",
  "support",
  "working",
  "develop",
  "build",
  "design",
  "manage",
  "using",
  "plus",
  "preferred",
  "years",
  "experience",
  "skills",
  "work",
  "team",
]);

export class ResumeScorer {
  private readonly text: string;
  private readonly lowerText: string;
  private readonly jobDescription?: string;
  private readonly lines: string[];
  private readonly bullets: string[];
  private readonly words: string[];
  private readonly headerLines: string[];

  constructor(text: string, jobDescription?: string) {
    this.text = text;
    this.lowerText = text.toLowerCase();
    this.jobDescription = jobDescription?.trim() || undefined;
    this.lines = text
      .split(/\r?\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    this.bullets = this.lines.filter((line) => /^[\u2022*\-]\s+/.test(line));
    this.words = text.split(/\s+/).filter(Boolean);
    this.headerLines = this.lines.slice(0, 8);
  }

  public analyze(): ScoreAnalysisResult {
    const sectionInsights = this.detectSections();
    const atsReadiness = this.analyzeAtsReadiness(sectionInsights.found);
    const keywordAlignment = this.analyzeKeywords(sectionInsights.found);
    const sectionCompleteness =
      this.analyzeSectionCompleteness(sectionInsights);
    const impact = this.analyzeImpact();
    const clarity = this.analyzeClarity();

    const sections: Record<ScoreCategoryKey, ScoreCategoryData> = {
      atsReadiness,
      keywordAlignment: keywordAlignment.category,
      sectionCompleteness,
      impact,
      clarity,
    };

    const weights = this.jobDescription
      ? {
          atsReadiness: 0.22,
          keywordAlignment: 0.3,
          sectionCompleteness: 0.18,
          impact: 0.2,
          clarity: 0.1,
        }
      : {
          atsReadiness: 0.24,
          keywordAlignment: 0.18,
          sectionCompleteness: 0.22,
          impact: 0.22,
          clarity: 0.14,
        };

    const score = Math.round(
      sections.atsReadiness.score * weights.atsReadiness +
        sections.keywordAlignment.score * weights.keywordAlignment +
        sections.sectionCompleteness.score * weights.sectionCompleteness +
        sections.impact.score * weights.impact +
        sections.clarity.score * weights.clarity,
    );

    const recommendations = this.rankRecommendations([
      ...atsReadiness.recommendations,
      ...keywordAlignment.category.recommendations,
      ...sectionCompleteness.recommendations,
      ...impact.recommendations,
      ...clarity.recommendations,
    ]);

    const strengths = [
      ...new Set([
        ...atsReadiness.strengths,
        ...keywordAlignment.category.strengths,
        ...sectionCompleteness.strengths,
        ...impact.strengths,
        ...clarity.strengths,
      ]),
    ].slice(0, 6);

    return {
      score,
      verdict: this.getVerdict(score),
      summary: this.buildSummary(
        score,
        keywordAlignment.coverage,
        recommendations,
      ),
      sections,
      recommendations,
      strengths,
      keywords: {
        present: keywordAlignment.present.slice(0, 12),
        missing: keywordAlignment.missing.slice(0, 12),
        suggested: keywordAlignment.suggested.slice(0, 8),
        coverage: keywordAlignment.coverage,
        targetCount: keywordAlignment.targetCount,
        titleMatch: keywordAlignment.titleMatch,
      },
      metrics: {
        wordCount: this.words.length,
        bulletCount: this.bullets.length,
        measurableBulletCount: this.countMeasurableBullets(),
        actionVerbCount: this.countActionVerbBullets(),
        sectionsFound: sectionInsights.found.map((section) => section.label),
        sectionsMissing: sectionInsights.missing.map(
          (section) => section.label,
        ),
        hasJobDescription: Boolean(this.jobDescription),
      },
    };
  }

  private analyzeAtsReadiness(foundSections: Array<{ name: SectionName }>) {
    let score = 0;
    const feedback: string[] = [];
    const recommendations: ScoreRecommendation[] = [];
    const strengths: string[] = [];

    const hasName = this.headerLines.some((line) =>
      /^(?:[A-Z][a-z]+|[A-Z]{2,})(?:\s+(?:[A-Z][a-z]+|[A-Z]{2,}|[A-Z]\.?)){1,3}$/.test(
        line,
      ),
    );
    const hasEmail = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/.test(this.text);
    const hasPhone = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(
      this.text,
    );
    const hasLink = /linkedin\.com|github\.com|portfolio|website/i.test(
      this.text,
    );
    const parseNoise = this.lines.filter(
      (line) => /\||\t|_{3,}|\.{6,}/.test(line) || / {4,}/.test(line),
    ).length;
    const dateConsistency = this.evaluateDateConsistency();

    if (hasName) score += 10;
    else {
      feedback.push("A clear full name was not detected in the header.");
      recommendations.push({
        title: "Strengthen the header",
        detail:
          "Start the resume with your name and contact details in plain text.",
        priority: "medium",
      });
    }

    if (hasEmail) score += 15;
    else {
      feedback.push("Email address not detected.");
      recommendations.push({
        title: "Add a professional email address",
        detail:
          "ATS systems expect your email in the top contact block as selectable text.",
        priority: "high",
      });
    }

    if (hasPhone) score += 15;
    else {
      feedback.push("Phone number not detected.");
      recommendations.push({
        title: "Add a phone number",
        detail:
          "Include a mobile number in the header to meet standard recruiter expectations.",
        priority: "high",
      });
    }

    if (hasLink) {
      score += 10;
      strengths.push("Professional web presence detected.");
    } else {
      feedback.push("No LinkedIn, GitHub, or portfolio link detected.");
    }

    score += dateConsistency.score;
    feedback.push(...dateConsistency.feedback);
    recommendations.push(...dateConsistency.recommendations);
    strengths.push(...dateConsistency.strengths);

    if (this.bullets.length >= 3) {
      score += 10;
      strengths.push(
        "Bullet formatting improves ATS and recruiter scanability.",
      );
    } else {
      feedback.push("Use more bullet points instead of dense paragraphs.");
    }

    if (parseNoise <= 1) {
      score += 15;
      strengths.push("No strong signs of table-like extraction issues.");
    } else {
      feedback.push(
        "The extracted text suggests tables, columns, or spacing-heavy layout.",
      );
      recommendations.push({
        title: "Simplify ATS-sensitive formatting",
        detail:
          "Avoid tables, text boxes, and decorative separators for core content.",
        priority: "high",
      });
    }

    if (foundSections.some((section) => section.name === "experience")) {
      score += 10;
    } else {
      feedback.push("No standard Work Experience section was detected.");
    }

    return {
      title: "ATS Readiness",
      score: Math.min(100, score),
      summary:
        score >= 80
          ? "The resume is structurally readable and ATS-safe."
          : "Parsing, contact, or formatting issues may hurt ATS reliability.",
      feedback:
        feedback.length > 0
          ? feedback
          : ["Header, dates, and formatting signals look ATS-friendly."],
      recommendations,
      strengths,
    } satisfies CategoryEvaluation;
  }

  private analyzeSectionCompleteness(sectionInsights: {
    found: Array<{ name: SectionName; label: string; index: number }>;
    missing: Array<{ name: SectionName; label: string }>;
  }) {
    let score = 0;
    const feedback: string[] = [];
    const recommendations: ScoreRecommendation[] = [];
    const strengths: string[] = [];
    const foundNames = new Set(
      sectionInsights.found.map((section) => section.name),
    );

    if (foundNames.has("experience")) score += 30;
    else {
      feedback.push("Missing a clearly labeled Work Experience section.");
      recommendations.push({
        title: "Use standard section headings",
        detail:
          "Use headings like Work Experience, Education, and Skills for easier ATS mapping.",
        priority: "high",
      });
    }

    if (foundNames.has("education")) score += 20;
    else feedback.push("Missing a clearly labeled Education section.");

    if (foundNames.has("skills")) {
      score += 20;
      strengths.push("Dedicated Skills section detected.");
    } else {
      feedback.push("Missing a dedicated Skills section.");
      recommendations.push({
        title: "Create a dedicated Skills section",
        detail:
          "List role-relevant tools, platforms, methods, and certifications in one standard block.",
        priority: "high",
      });
    }

    if (foundNames.has("summary")) score += 10;
    if (foundNames.has("projects") || foundNames.has("certifications"))
      score += 10;

    const experienceIndex = sectionInsights.found.find(
      (section) => section.name === "experience",
    )?.index;
    const educationIndex = sectionInsights.found.find(
      (section) => section.name === "education",
    )?.index;

    if (
      typeof experienceIndex === "number" &&
      typeof educationIndex === "number" &&
      experienceIndex < educationIndex
    ) {
      score += 10;
      strengths.push("Section order supports a recruiter-friendly chronology.");
    }

    return {
      title: "Section Completeness",
      score: Math.min(100, score),
      summary:
        score >= 80
          ? "The resume uses a strong set of standard ATS-friendly sections."
          : "Important sections or standard headings are missing or unclear.",
      feedback:
        feedback.length > 0
          ? feedback
          : ["Core ATS-friendly sections are present and well ordered."],
      recommendations,
      strengths,
    } satisfies CategoryEvaluation;
  }

  private analyzeKeywords(foundSections: Array<{ name: SectionName }>) {
    const titleMatch = this.extractTitleMatch();
    const detectedSkills = COMMON_SKILLS.filter((term) =>
      this.containsKeyword(term),
    );
    const feedback: string[] = [];
    const recommendations: ScoreRecommendation[] = [];
    const strengths: string[] = [];

    if (this.jobDescription) {
      const targets = this.extractKeywordsFromJobDescription(
        this.jobDescription,
      );
      const present = targets.filter((term) => this.containsKeyword(term));
      const missing = targets.filter((term) => !this.containsKeyword(term));
      const coverage =
        targets.length === 0
          ? 0
          : Math.round((present.length / targets.length) * 100);
      let score = Math.round(coverage * 0.85);

      if (titleMatch.length > 0) score += 10;
      if (foundSections.some((section) => section.name === "skills"))
        score += 5;

      if (coverage >= 70) {
        strengths.push(
          "Keyword coverage is strong against the supplied job description.",
        );
      } else {
        feedback.push(
          "Several important job-description terms are missing or not explicit.",
        );
        recommendations.push({
          title: "Tailor the resume to the job description",
          detail:
            "Mirror critical hard skills, tools, and role language from the posting where you can support them honestly.",
          priority: "high",
        });
      }

      return {
        category: {
          title: "Keyword Alignment",
          score: Math.min(100, score),
          summary:
            coverage >= 70
              ? "The resume aligns well with the supplied job description."
              : "Job-description alignment needs work to improve ATS ranking.",
          feedback:
            feedback.length > 0
              ? feedback
              : ["The resume matches the target role language well."],
          recommendations,
          strengths,
        } satisfies CategoryEvaluation,
        present,
        missing,
        suggested: detectedSkills,
        coverage,
        targetCount: targets.length,
        titleMatch,
      };
    }

    let score = Math.min(55, detectedSkills.length * 6);
    if (titleMatch.length > 0) score += 20;
    if (foundSections.some((section) => section.name === "skills")) score += 15;
    if (this.extractDistinctTerms().length >= 12) score += 10;

    if (detectedSkills.length >= 8) {
      strengths.push("The resume includes a healthy spread of hard skills.");
    } else {
      feedback.push("Hard-skill coverage looks thin for a general ATS scan.");
      recommendations.push({
        title: "Add role-specific tools and technologies",
        detail:
          "Strengthen the Skills section with concrete platforms, tools, languages, and methods you actually use.",
        priority: "high",
      });
    }

    if (titleMatch.length === 0) {
      feedback.push(
        "A clear target role was not detected near the top of the resume.",
      );
      recommendations.push({
        title: "Clarify your target role",
        detail:
          "Add a specific role title in the header or summary for faster ATS classification.",
        priority: "medium",
      });
    }

    return {
      category: {
        title: "Keyword Alignment",
        score: Math.min(100, score),
        summary:
          score >= 75
            ? "The resume shows solid baseline keyword richness."
            : "The resume needs stronger role-specific keyword depth.",
        feedback:
          feedback.length > 0
            ? feedback
            : [
                "Hard skills and role language are reasonably well represented.",
              ],
        recommendations,
        strengths,
      } satisfies CategoryEvaluation,
      present: detectedSkills,
      missing: [],
      suggested: detectedSkills,
      coverage:
        detectedSkills.length >= 12
          ? 100
          : Math.min(100, detectedSkills.length * 8),
      targetCount: detectedSkills.length,
      titleMatch,
    };
  }

  private analyzeImpact() {
    const measurableBullets = this.countMeasurableBullets();
    const actionVerbBullets = this.countActionVerbBullets();
    let score =
      Math.min(45, measurableBullets * 9) + Math.min(30, actionVerbBullets * 4);
    const feedback: string[] = [];
    const recommendations: ScoreRecommendation[] = [];
    const strengths: string[] = [];

    if (this.bullets.length >= 6) score += 15;
    if (
      this.averageBulletWordCount() >= 8 &&
      this.averageBulletWordCount() <= 28
    ) {
      score += 10;
      strengths.push("Bullet length is concise enough for recruiter scanning.");
    }

    if (measurableBullets >= 4) {
      strengths.push("Multiple bullets include measurable results.");
    } else {
      feedback.push(
        "Too few bullets quantify impact with numbers, percentages, or scale.",
      );
      recommendations.push({
        title: "Add measurable achievements",
        detail:
          "Rewrite bullets to show outcomes with numbers, percentages, time saved, revenue, or team size.",
        priority: "high",
      });
    }

    if (actionVerbBullets < 5) {
      feedback.push("More bullets should start with strong action verbs.");
      recommendations.push({
        title: "Lead bullets with action verbs",
        detail:
          "Start bullets with verbs like built, led, improved, automated, reduced, or delivered.",
        priority: "medium",
      });
    } else {
      strengths.push("Strong action verbs are used to frame accomplishments.");
    }

    return {
      title: "Impact & Achievement Quality",
      score: Math.min(100, score),
      summary:
        score >= 75
          ? "Experience content demonstrates impact with enough evidence."
          : "Experience content needs stronger accomplishment framing.",
      feedback:
        feedback.length > 0
          ? feedback
          : ["Achievements are evidence-based and action-oriented."],
      recommendations,
      strengths,
    } satisfies CategoryEvaluation;
  }

  private analyzeClarity() {
    const feedback: string[] = [];
    const recommendations: ScoreRecommendation[] = [];
    const strengths: string[] = [];
    const wordCount = this.words.length;
    const duplicateLines = this.countDuplicateLines();
    const buzzwordCount = BUZZWORDS.filter((term) =>
      this.lowerText.includes(term),
    ).length;
    let score = 0;

    if (wordCount >= 350 && wordCount <= 850) {
      score += 45;
      strengths.push(
        "Resume length is in a strong range for ATS-driven applications.",
      );
    } else if (wordCount > 850 && wordCount <= 1100) {
      score += 25;
      feedback.push("The resume may be too long for fast recruiter screening.");
      recommendations.push({
        title: "Tighten resume length",
        detail:
          "Trim low-value bullets and repeated phrasing so the strongest evidence stands out faster.",
        priority: "medium",
      });
    } else {
      score += 20;
      feedback.push("Resume length is outside the typical ATS-friendly range.");
    }

    if (this.bullets.length >= 4) score += 25;
    else
      feedback.push(
        "The document relies too heavily on paragraphs instead of bullets.",
      );

    if (duplicateLines === 0) score += 15;
    else feedback.push("Repeated lines or duplicate phrasing were detected.");

    if (buzzwordCount === 0) score += 15;
    else {
      feedback.push("Cliche filler language weakens clarity.");
      recommendations.push({
        title: "Replace generic buzzwords",
        detail:
          "Swap vague descriptors for specific skills, ownership, and measurable outcomes.",
        priority: "low",
      });
    }

    return {
      title: "Clarity & Brevity",
      score: Math.min(100, score),
      summary:
        score >= 75
          ? "The resume is concise, scannable, and appropriately sized."
          : "Clarity or concision issues may slow down ATS parsing and review.",
      feedback:
        feedback.length > 0
          ? feedback
          : ["Resume length and readability are in a good place."],
      recommendations,
      strengths,
    } satisfies CategoryEvaluation;
  }

  private detectSections() {
    const found = SECTION_PATTERNS.flatMap((section) => {
      const index = this.lines.findIndex((line) =>
        section.patterns.some((pattern) =>
          pattern.test(this.normalizeHeader(line)),
        ),
      );

      return index >= 0
        ? [{ name: section.name, label: section.label, index }]
        : [];
    }).sort((a, b) => a.index - b.index);

    const foundNames = new Set(found.map((section) => section.name));
    const missing = SECTION_PATTERNS.filter(
      (section) => !foundNames.has(section.name),
    ).map((section) => ({ name: section.name, label: section.label }));

    return { found, missing };
  }

  private evaluateDateConsistency() {
    const feedback: string[] = [];
    const recommendations: ScoreRecommendation[] = [];
    const strengths: string[] = [];
    const monthYearMatches =
      this.text.match(
        /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}(?:\s?[-\u2013]\s?(?:present|current|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}))?\b/gi,
      )?.length ?? 0;
    const numericMatches =
      this.text.match(
        /\b\d{1,2}\/\d{4}\b|\b\d{4}\s?[-\u2013]\s?(?:present|current|\d{4})\b/gi,
      )?.length ?? 0;
    const total = monthYearMatches + numericMatches;

    if (total >= 3) {
      const dominant = Math.max(monthYearMatches, numericMatches) / total;
      if (dominant >= 0.75) {
        strengths.push("Date formatting looks reasonably consistent.");
        return { score: 15, feedback, recommendations, strengths };
      }

      feedback.push("Date formats appear inconsistent across the resume.");
      recommendations.push({
        title: "Use one date style throughout",
        detail:
          "Keep a single date format such as Jan 2024 to Mar 2025 or 01/2024 to 03/2025 across every role.",
        priority: "medium",
      });
      return { score: 6, feedback, recommendations, strengths };
    }

    feedback.push("Too few employment or education dates were detected.");
    recommendations.push({
      title: "Show dates clearly",
      detail:
        "ATS systems and recruiters expect consistent dates for roles, education, and certifications.",
      priority: "medium",
    });
    return { score: 4, feedback, recommendations, strengths };
  }

  private extractKeywordsFromJobDescription(jobDescription: string) {
    const normalized = jobDescription.toLowerCase();
    const terms = (normalized.match(/\b[a-z][a-z0-9+#.-]{2,}\b/g) ?? []).filter(
      (term) =>
        !STOP_WORDS.has(term) &&
        (term.length >= 4 || COMMON_SKILLS.includes(term)),
    );
    const phrases =
      normalized.match(/\b[a-z][a-z0-9+#.-]{2,}\s+[a-z][a-z0-9+#.-]{2,}\b/g) ??
      [];

    return [
      ...new Set([
        ...COMMON_SKILLS.filter((term) =>
          this.containsInText(normalized, term),
        ),
        ...phrases.filter((phrase) =>
          phrase
            .split(/\s+/)
            .every(
              (part) =>
                !STOP_WORDS.has(part) &&
                (part.length >= 4 || COMMON_SKILLS.includes(part)),
            ),
        ),
        ...terms,
      ]),
    ].slice(0, 24);
  }

  private extractDistinctTerms() {
    return [
      ...new Set(
        (this.lowerText.match(/\b[a-z][a-z0-9+#.-]{3,}\b/g) ?? []).filter(
          (term) => !STOP_WORDS.has(term),
        ),
      ),
    ];
  }

  private extractTitleMatch() {
    const header = this.headerLines.join(" ").toLowerCase();
    const titleTerms = [
      "engineer",
      "developer",
      "manager",
      "analyst",
      "designer",
      "specialist",
      "consultant",
      "architect",
      "scientist",
      "product",
      "marketing",
      "sales",
      "consulting",
      "customer success",
    ];
    return titleTerms.filter((term) => header.includes(term));
  }

  private containsKeyword(term: string) {
    return this.containsInText(this.lowerText, term.toLowerCase());
  }

  private containsInText(haystack: string, term: string) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(
      haystack,
    );
  }

  private countMeasurableBullets() {
    return this.bullets.filter((bullet) =>
      /(\d+%|\$\d[\d,.]*|\d+[kKmM]?|\b\d+\s+(users|customers|clients|projects|team|people|days|hours|weeks|months|years)\b)/i.test(
        bullet,
      ),
    ).length;
  }

  private countActionVerbBullets() {
    return this.bullets.filter((bullet) =>
      ACTION_VERBS.some((verb) =>
        new RegExp(`^[\\u2022*\\-]\\s+${verb}\\b`, "i").test(bullet),
      ),
    ).length;
  }

  private averageBulletWordCount() {
    if (this.bullets.length === 0) return 0;
    return Math.round(
      this.bullets.reduce(
        (sum, bullet) => sum + bullet.split(/\s+/).filter(Boolean).length,
        0,
      ) / this.bullets.length,
    );
  }

  private countDuplicateLines() {
    const seen = new Set<string>();
    let duplicates = 0;

    for (const line of this.lines) {
      const normalized = line.toLowerCase().replace(/\s+/g, " ").trim();
      if (normalized.length < 20) continue;
      if (seen.has(normalized)) duplicates += 1;
      else seen.add(normalized);
    }

    return duplicates;
  }

  private rankRecommendations(recommendations: ScoreRecommendation[]) {
    const priorityScore: Record<ScoreRecommendationPriority, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };
    const deduped = new Map<string, ScoreRecommendation>();

    for (const recommendation of recommendations) {
      const existing = deduped.get(recommendation.title);
      if (
        !existing ||
        priorityScore[recommendation.priority] >
          priorityScore[existing.priority]
      ) {
        deduped.set(recommendation.title, recommendation);
      }
    }

    return [...deduped.values()]
      .sort(
        (a, b) =>
          priorityScore[b.priority] - priorityScore[a.priority] ||
          a.title.localeCompare(b.title),
      )
      .slice(0, 6);
  }

  private buildSummary(
    score: number,
    keywordCoverage: number,
    recommendations: ScoreRecommendation[],
  ) {
    const topRecommendation = recommendations[0]?.title;

    if (this.jobDescription && score >= 85 && keywordCoverage >= 70) {
      return "Strong ATS fit for the target role. The resume reads cleanly, uses standard structure, and aligns well with the supplied job description.";
    }

    if (!this.jobDescription && score >= 85) {
      return "The resume is structurally strong, ATS-readable, and presents experience in a recruiter-friendly way.";
    }

    return topRecommendation
      ? `The strongest next improvement is to ${topRecommendation.toLowerCase()}.`
      : "The resume needs stronger ATS optimization in structure, keywords, and accomplishment framing.";
  }

  private getVerdict(score: number) {
    if (score >= 85) return "Strong Match";
    if (score >= 70) return "Competitive";
    if (score >= 55) return "Needs Work";
    return "High Risk";
  }

  private normalizeHeader(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z& ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}
