import { ResumeScorer } from "@/lib/resume-scorer";
import {
  formatAtsReportJson,
  formatAtsReportMarkdown,
} from "@/lib/resume/report";

const SAMPLE_RESUME = `
Alex Rivera
Senior Full Stack Engineer
alex@example.com | (555) 234-5678 | https://github.com/alexrivera

Summary
Built high-throughput web platforms using TypeScript, React, Next.js, and PostgreSQL.

Work Experience
Senior Software Engineer - Acme Cloud
January 2021 - Present
- Architected distributed billing jobs reducing latency by 45%
- Led migration to Next.js App Router for 120k monthly users
- Automated CI test pipelines across 12 microservices

Education
B.S. Computer Science, State University (2019)

Skills
TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS
`;

describe("KAN-1: ATS audit report export & action verb density", () => {
  it("calculates actionVerbDensity percentage safely including zero-bullet resumes", () => {
    const emptyBullets = new ResumeScorer(
      "Jordan Lee\njordan@example.com\nSummary\nSoftware engineer focused on backend APIs.",
    ).analyze();
    expect(emptyBullets.metrics.bulletCount).toBe(0);
    expect(emptyBullets.metrics.actionVerbDensity).toBe(0);

    const rich = new ResumeScorer(
      SAMPLE_RESUME,
      "Looking for a Senior Engineer skilled in TypeScript, React, Next.js, and Kubernetes.",
    ).analyze();
    expect(rich.metrics.bulletCount).toBeGreaterThan(0);
    expect(rich.metrics.actionVerbDensity).toBeGreaterThan(0);
    expect(rich.metrics.actionVerbDensity).toBeLessThanOrEqual(100);
  });

  it("formats structured Markdown audit report with score, keywords, and section table", () => {
    const analysis = new ResumeScorer(
      SAMPLE_RESUME,
      "TypeScript React Next.js Kubernetes Terraform",
    ).analyze();
    const fixedDate = new Date("2026-11-27T12:00:00.000Z");

    const markdown = formatAtsReportMarkdown(analysis, fixedDate);

    expect(markdown).toContain("# ATS Resume Audit Report");
    expect(markdown).toContain("2026-11-27T12:00:00.000Z");
    expect(markdown).toContain("JD Tailored Scan");
    expect(markdown).toContain(`${analysis.score}/100`);
    expect(markdown).toContain(
      `(${analysis.metrics.actionVerbDensity}% density)`,
    );
    expect(markdown).toContain("## Section Breakdown");
    expect(markdown).toContain("## Keyword Alignment");
  });

  it("serializes parseable JSON audit report preserving metrics and timestamp", () => {
    const analysis = new ResumeScorer(SAMPLE_RESUME).analyze();
    const fixedDate = new Date("2026-11-27T12:00:00.000Z");

    const parsed = JSON.parse(formatAtsReportJson(analysis, fixedDate));

    expect(parsed.exportedAt).toBe("2026-11-27T12:00:00.000Z");
    expect(parsed.score).toBe(analysis.score);
    expect(parsed.metrics.actionVerbDensity).toBe(
      analysis.metrics.actionVerbDensity,
    );
    expect(parsed.keywords).toEqual(analysis.keywords);
  });
});
