import type { ScoreAnalysisResult } from "./score";

function formatBulletList(items: string[], emptyFallback: string): string {
  if (items.length === 0) {
    return `- ${emptyFallback}`;
  }
  return items.map((item) => `- ${item}`).join("\n");
}

/**
 * Formats an ATS analysis result as a structured Markdown audit report
 * suitable for candidate checklists or recruiter handoffs.
 */
export function formatAtsReportMarkdown(
  analysis: ScoreAnalysisResult,
  generatedAt: Date = new Date(),
): string {
  const modeLabel = analysis.metrics.hasJobDescription
    ? "JD Tailored Scan"
    : "General ATS Scan";

  const sectionRows = Object.values(analysis.sections)
    .map(
      (section) =>
        `| ${section.title} | ${section.score}/100 | ${section.summary.replace(/\|/g, "\\|")} |`,
    )
    .join("\n");

  const recommendationsList =
    analysis.recommendations.length > 0
      ? analysis.recommendations
          .map(
            (rec, idx) =>
              `${idx + 1}. **[${rec.priority.toUpperCase()}] ${rec.title}** — ${rec.detail}`,
          )
          .join("\n")
      : "- No major priority fixes surfaced.";

  return [
    "# ATS Resume Audit Report",
    "",
    `- **Generated:** ${generatedAt.toISOString()}`,
    `- **Scan Mode:** ${modeLabel}`,
    `- **Overall Score:** ${analysis.score}/100 (${analysis.verdict})`,
    "",
    "## Executive Summary",
    analysis.summary,
    "",
    "## Core Telemetry",
    `- **Word Count:** ${analysis.metrics.wordCount}`,
    `- **Bullet Count:** ${analysis.metrics.bulletCount}`,
    `- **Measurable Bullets:** ${analysis.metrics.measurableBulletCount}`,
    `- **Action Verb Bullets:** ${analysis.metrics.actionVerbCount} (${analysis.metrics.actionVerbDensity}% density)`,
    `- **Keyword Coverage:** ${analysis.keywords.coverage}%`,
    "",
    "## Section Breakdown",
    "| Category | Score | Summary |",
    "| :--- | :--- | :--- |",
    sectionRows,
    "",
    "## Keyword Alignment",
    "### Matched Keywords",
    formatBulletList(analysis.keywords.present, "None matched."),
    "",
    "### Missing Keywords",
    formatBulletList(analysis.keywords.missing, "No missing target keywords."),
    "",
    "## Priority Recommendations",
    recommendationsList,
    "",
    "## Key Strengths",
    formatBulletList(analysis.strengths, "None recorded."),
  ].join("\n");
}

/**
 * Serializes an ATS analysis result alongside its export timestamp as JSON.
 */
export function formatAtsReportJson(
  analysis: ScoreAnalysisResult,
  generatedAt: Date = new Date(),
): string {
  return JSON.stringify(
    {
      exportedAt: generatedAt.toISOString(),
      ...analysis,
    },
    null,
    2,
  );
}
