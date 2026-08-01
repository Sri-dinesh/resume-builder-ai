import { describe, it, expect } from "vitest";
import { ResumeScorer } from "../scorer";

const MINIMAL_RESUME = `
John Doe
Software Engineer
john@example.com | (555) 123-4567

Summary
Experienced software engineer with 5+ years of experience in building scalable web applications.

Experience
Senior Software Engineer - Acme Corp
January 2020 - Present
- Led development of microservices architecture
- Improved system performance by 40%
- Mentored junior developers

Software Engineer - StartupXYZ
June 2018 - December 2019
- Built RESTful APIs using Node.js
- Implemented CI/CD pipelines

Education
Bachelor of Science in Computer Science
University of Technology - 2018

Skills
JavaScript, TypeScript, React, Node.js, PostgreSQL, Docker, AWS, Git
`;

describe("ResumeScorer", () => {
  it("returns valid analysis structure", () => {
    const scorer = new ResumeScorer(MINIMAL_RESUME);
    const result = scorer.analyze();

    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("sections");
    expect(result).toHaveProperty("recommendations");
    expect(result).toHaveProperty("metrics");
    expect(result).toHaveProperty("verdict");
    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("strengths");
    expect(result).toHaveProperty("keywords");
  });

  it("returns score between 0 and 100", () => {
    const scorer = new ResumeScorer(MINIMAL_RESUME);
    const result = scorer.analyze();

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("returns sections with valid scores", () => {
    const scorer = new ResumeScorer(MINIMAL_RESUME);
    const result = scorer.analyze();

    for (const [, section] of Object.entries(result.sections)) {
      expect(section.score).toBeGreaterThanOrEqual(0);
      expect(section.score).toBeLessThanOrEqual(100);
      expect(section).toHaveProperty("title");
    }
  });

  it("returns recommendations array with correct shape", () => {
    const scorer = new ResumeScorer(MINIMAL_RESUME);
    const result = scorer.analyze();

    expect(Array.isArray(result.recommendations)).toBe(true);
    for (const rec of result.recommendations) {
      expect(rec).toHaveProperty("title");
      expect(rec).toHaveProperty("detail");
      expect(rec).toHaveProperty("priority");
      expect(["high", "medium", "low"]).toContain(rec.priority);
    }
  });

  it("scores higher for detailed resume vs minimal one", () => {
    const minimalScorer = new ResumeScorer(
      "John Doe. Engineer. Skills: JavaScript. Experience at Acme Corp 2020-2023.",
    );
    const detailedScorer = new ResumeScorer(MINIMAL_RESUME);

    const minResult = minimalScorer.analyze();
    const detResult = detailedScorer.analyze();

    expect(detResult.score).toBeGreaterThan(minResult.score);
  });

  it("includes keyword data when job description provided", () => {
    const scorer = new ResumeScorer(
      MINIMAL_RESUME,
      "We need a React developer with TypeScript and Node.js experience",
    );
    const result = scorer.analyze();

    expect(result).toHaveProperty("keywords");
    expect(result.keywords).toHaveProperty("present");
    expect(result.keywords).toHaveProperty("missing");
    expect(result.keywords).toHaveProperty("coverage");
  });

  it("populates metrics with expected fields", () => {
    const scorer = new ResumeScorer(MINIMAL_RESUME);
    const result = scorer.analyze();

    expect(result.metrics).toHaveProperty("wordCount");
    expect(result.metrics).toHaveProperty("bulletCount");
    expect(result.metrics.wordCount).toBeGreaterThan(0);
    expect(result.metrics.bulletCount).toBeGreaterThan(0);
  });
});
