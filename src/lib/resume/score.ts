import { z } from "zod";

export type ScoreAnalysisMode = "general" | "jd";

export type ScoreRecommendationPriority = "high" | "medium" | "low";

export type ScoreCategoryKey =
  | "atsReadiness"
  | "keywordAlignment"
  | "sectionCompleteness"
  | "impact"
  | "clarity";

export interface ScoreCategoryData {
  title: string;
  score: number;
  summary: string;
  feedback: string[];
}

export interface ScoreRecommendation {
  title: string;
  detail: string;
  priority: ScoreRecommendationPriority;
}

export interface ScoreKeywordAnalysis {
  present: string[];
  missing: string[];
  suggested: string[];
  coverage: number;
  targetCount: number;
  titleMatch: string[];
}

export interface ScoreMetrics {
  wordCount: number;
  bulletCount: number;
  measurableBulletCount: number;
  actionVerbCount: number;
  sectionsFound: string[];
  sectionsMissing: string[];
  hasJobDescription: boolean;
}

export interface ScoreAnalysisResult {
  score: number;
  verdict: string;
  summary: string;
  sections: Record<ScoreCategoryKey, ScoreCategoryData>;
  recommendations: ScoreRecommendation[];
  strengths: string[];
  keywords: ScoreKeywordAnalysis;
  metrics: ScoreMetrics;
}

export const SCORE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
export const SCORE_MAX_TEXT_LENGTH = 20000;
export const SCORE_MAX_JOB_DESCRIPTION_LENGTH = 12000;
export const SCORE_ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
} as const;

export const scoreRequestSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .max(
      SCORE_MAX_JOB_DESCRIPTION_LENGTH,
      `Job description must be ${SCORE_MAX_JOB_DESCRIPTION_LENGTH} characters or fewer.`,
    )
    .optional(),
});
