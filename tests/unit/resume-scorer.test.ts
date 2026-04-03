import { ResumeScorer } from "@/lib/resume-scorer";
import {
  buildJobDescriptions,
  buildSampleResumeTexts,
} from "../factories/resume.factory";

const sampleResumeTexts = buildSampleResumeTexts(60);

describe("ResumeScorer", () => {
  it("analyze_with_job_description_returns_keyword_metrics_and_competitive_score", () => {
    const analysis = new ResumeScorer(
      sampleResumeTexts[0],
      buildJobDescriptions()[0].content,
    ).analyze();

    expect(analysis.score).toBeGreaterThan(0);
    expect(analysis.verdict).toMatch(/Strong Match|Competitive|Needs Work|High Risk/);
    expect(analysis.keywords.targetCount).toBeGreaterThan(0);
    expect(Array.isArray(analysis.recommendations)).toBe(true);
    expect(analysis.metrics.hasJobDescription).toBe(true);
  });

  it("analyze_without_job_description_detects_standard_sections_and_strengths", () => {
    const analysis = new ResumeScorer(sampleResumeTexts[1]).analyze();

    expect(analysis.metrics.sectionsFound).toEqual(
      expect.arrayContaining(["Professional Summary", "Work Experience", "Education", "Skills"]),
    );
    expect(analysis.sections.atsReadiness.score).toBeGreaterThan(40);
    expect(analysis.strengths.length).toBeGreaterThan(0);
  });

  it("analyze_on_sparse_resume_returns_low_score_and_recommendations", () => {
    const sparseResume = "John Doe\njohn@example.com\nSummary\nHardworking team player";
    const analysis = new ResumeScorer(sparseResume).analyze();

    expect(analysis.score).toBeLessThan(70);
    expect(analysis.recommendations.length).toBeGreaterThan(0);
    expect(analysis.summary.length).toBeGreaterThan(10);
  });

  it("analyze_across_50_plus_resumes_produces_stable_non_throwing_results", () => {
    const results = sampleResumeTexts.map((text) => new ResumeScorer(text).analyze());

    expect(results).toHaveLength(60);
    expect(results.every((result) => result.score >= 0 && result.score <= 100)).toBe(true);
  });
});
