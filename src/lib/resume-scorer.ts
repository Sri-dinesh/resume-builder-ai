export interface AnalysisResult {
  score: number;
  summary: string;
  sections: {
    impact: { score: number; feedback: string[] };
    brevity: { score: number; feedback: string[] };
    style: { score: number; feedback: string[] };
    structure: { score: number; feedback: string[] };
    skills: { score: number; feedback: string[] };
  };
  keywords: {
    present: string[];
    missing: string[];
  };
}

export class ResumeScorer {
  private text: string;
  private lowerText: string;
  private jobDescription?: string;

  constructor(text: string, jobDescription?: string) {
    this.text = text;
    this.lowerText = text.toLowerCase();
    this.jobDescription = jobDescription;
  }

  public analyze(): AnalysisResult {
    const contactScore = this.checkContactInfo();
    const sectionScore = this.checkSections();
    const contentScore = this.checkContentQuality();
    const keywordScore = this.checkKeywords();

    // Calculate overall score (weighted)
    // Contact: 15%, Sections: 25%, Content: 30%, Keywords: 30%
    const totalScore = Math.min(
      100,
      Math.round(
        contactScore.score +
          sectionScore.score +
          contentScore.score +
          keywordScore.score,
      ),
    );

    return {
      score: totalScore,
      summary: this.generateSummary(totalScore),
      sections: {
        structure: {
          score: Math.min(100, (contactScore.score / 15) * 100),
          feedback: contactScore.feedback,
        },
        style: {
          score: Math.min(100, (sectionScore.score / 25) * 100),
          feedback: sectionScore.feedback,
        },
        impact: {
          score: Math.min(100, (contentScore.metricsScore / 15) * 100),
          feedback: contentScore.metricsFeedback,
        },
        brevity: {
          score: Math.min(100, (contentScore.brevityScore / 15) * 100),
          feedback: contentScore.brevityFeedback,
        },
        skills: {
          score: Math.min(100, (keywordScore.score / 30) * 100),
          feedback: keywordScore.feedback,
        },
      },
      keywords: {
        present: keywordScore.present,
        missing: keywordScore.missing,
      },
    };
  }

  private checkContactInfo() {
    let score = 0;
    const feedback: string[] = [];

    // Email
    if (/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(this.text)) {
      score += 5;
    } else {
      feedback.push("Missing email address.");
    }

    // Phone
    if (/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(this.text)) {
      score += 5;
    } else {
      feedback.push("Missing phone number.");
    }

    // LinkedIn/Links
    if (/linkedin\.com|github\.com|portfolio|website/i.test(this.text)) {
      score += 5;
    } else {
      feedback.push("Consider adding LinkedIn or portfolio links.");
    }

    if (score === 15) feedback.push("Contact information is complete.");

    return { score, feedback };
  }

  private checkSections() {
    let score = 0;
    const feedback: string[] = [];
    const sections = [
      {
        name: "Experience",
        regex: /experience|employment|work history/i,
        val: 10,
      },
      { name: "Education", regex: /education|academic|degree/i, val: 5 },
      { name: "Skills", regex: /skills|technologies|competencies/i, val: 5 },
      { name: "Projects", regex: /projects|portfolio/i, val: 5 },
    ];

    sections.forEach((sec) => {
      if (sec.regex.test(this.text)) {
        score += sec.val;
      } else {
        feedback.push(`Missing '${sec.name}' section.`);
      }
    });

    if (score === 25) feedback.push("All key sections are present.");

    return { score, feedback };
  }

  private checkContentQuality() {
    // Metrics
    const metricsRegex = /\d+%|\$\d+|\d+\s\w+/g;
    const metricsCount = (this.text.match(metricsRegex) || []).length;
    const metricsScore = Math.min(15, metricsCount * 3);
    const metricsFeedback =
      metricsCount > 3
        ? ["Good use of quantifiable metrics."]
        : ["Add more numbers and percentages to quantify achievements."];

    // Brevity/Length
    const wordCount = this.text.split(/\s+/).length;
    let brevityScore = 0;
    const brevityFeedback = [];

    if (wordCount > 200 && wordCount < 1000) {
      brevityScore = 15;
      brevityFeedback.push("Resume length is optimal.");
    } else if (wordCount <= 200) {
      brevityScore = 5;
      brevityFeedback.push("Resume is too short. Add more detail.");
    } else {
      brevityScore = 10;
      brevityFeedback.push("Resume might be too long. Keep it concise.");
    }

    return {
      score: metricsScore + brevityScore,
      metricsScore,
      metricsFeedback,
      brevityScore,
      brevityFeedback,
    };
  }

  private checkKeywords() {
    let targetKeywords: string[] = [];

    if (this.jobDescription && this.jobDescription.trim().length > 20) {
      // Extract keywords from JD
      targetKeywords = this.extractKeywordsFromJD(this.jobDescription);
    } else {
      // Default keywords
      targetKeywords = [
        "javascript",
        "typescript",
        "react",
        "node",
        "python",
        "java",
        "sql",
        "aws",
        "docker",
        "agile",
        "communication",
        "leadership",
        "problem solving",
        "analysis",
        "design",
      ];
    }

    const present: string[] = [];
    const missing: string[] = [];
    let score = 0;
    const totalKeywords = targetKeywords.length;

    if (totalKeywords === 0) {
      return {
        score: 30,
        present: [],
        missing: [],
        feedback: ["No specific keywords to check against."],
      };
    }

    targetKeywords.forEach((kw) => {
      if (new RegExp(`\\b${kw}\\b`, "i").test(this.text)) {
        present.push(kw);
      } else {
        missing.push(kw);
      }
    });

    // Calculate score based on percentage of matches
    const matchPercentage = present.length / totalKeywords;
    score = Math.round(matchPercentage * 30);

    const feedback =
      matchPercentage > 0.5
        ? ["Good match with the target keywords."]
        : [
            "Missing many critical keywords from the job description/industry standard.",
          ];

    return { score, present, missing, feedback };
  }

  private extractKeywordsFromJD(jd: string): string[] {
    const stopWords = new Set([
      "and",
      "the",
      "is",
      "in",
      "at",
      "of",
      "or",
      "to",
      "for",
      "with",
      "a",
      "an",
      "as",
      "by",
      "on",
      "be",
      "we",
      "are",
      "you",
      "will",
      "have",
      "that",
      "this",
      "from",
      "it",
      "can",
      "not",
      "but",
      "if",
      "job",
      "description",
      "responsibilities",
      "requirements",
      "qualifications",
      "experience",
      "skills",
      "work",
      "team",
      "role",
      "candidate",
      "ability",
      "knowledge",
      "understanding",
      "proficient",
      "strong",
      "excellent",
      "good",
      "preferred",
      "plus",
      "years",
      "degree",
      "bachelor",
      "master",
      "university",
      "college",
      "school",
      "high",
      "diploma",
      "certificate",
      "certification",
      "license",
      "must",
      "should",
      "able",
      "willing",
      "opportunity",
      "company",
      "business",
      "client",
      "customer",
      "service",
      "support",
      "development",
      "design",
      "implementation",
      "management",
      "project",
      "product",
      "system",
      "application",
      "software",
      "solution",
      "technology",
      "technical",
      "environment",
      "platform",
      "tool",
      "language",
      "framework",
      "library",
      "database",
      "server",
      "cloud",
      "web",
      "mobile",
      "app",
      "user",
      "interface",
      "frontend",
      "backend",
      "fullstack",
      "stack",
      "code",
      "programming",
      "scripting",
      "testing",
      "debugging",
      "deployment",
      "maintenance",
      "documentation",
      "agile",
      "scrum",
      "waterfall",
      "methodology",
      "process",
      "lifecycle",
      "best",
      "practice",
      "standard",
      "quality",
      "performance",
      "scalability",
      "security",
      "reliability",
      "availability",
      "efficiency",
      "optimization",
      "improvement",
      "innovation",
      "creativity",
      "problem",
      "solving",
      "analytical",
      "critical",
      "thinking",
      "communication",
      "interpersonal",
      "collaboration",
      "teamwork",
      "leadership",
      "mentorship",
      "coaching",
      "training",
      "learning",
      "growth",
      "career",
      "salary",
      "benefits",
      "compensation",
      "location",
      "remote",
      "hybrid",
      "onsite",
      "office",
      "hours",
      "schedule",
      "time",
      "date",
      "start",
      "end",
      "duration",
      "contract",
      "permanent",
      "temporary",
      "internship",
      "freelance",
      "part-time",
      "full-time",
    ]);

    const words = jd
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/);
    const keywords = new Set<string>();

    words.forEach((word) => {
      if (word.length > 3 && !stopWords.has(word)) {
        keywords.add(word);
      }
    });

    // Return top 20 most frequent or just the set as array.
    // For simplicity, returning unique valid words, capped at 20 to avoid noise.
    return Array.from(keywords).slice(0, 20);
  }

  private generateSummary(totalScore: number): string {
    if (totalScore >= 80) {
      return "Excellent resume! It is well-structured, contains all necessary contact details, and uses strong keywords and metrics.";
    } else if (totalScore >= 60) {
      return "Good start, but there is room for improvement. Ensure all key sections are present and try to quantify your achievements more.";
    } else {
      return "Your resume needs attention. Please ensure you have included contact info, standard sections (Experience, Education), and relevant keywords.";
    }
  }
}
