import React from "react";
import { ScoreGauge } from "./ScoreGauge";
import { SectionAnalysis } from "./SectionAnalysis";
import { KeywordList } from "./KeywordList";
import { motion } from "framer-motion";

interface AnalysisResult {
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

interface ScoreDashboardProps {
  analysis: AnalysisResult;
}

export function ScoreDashboard({ analysis }: ScoreDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Score Gauge */}
        <div className="col-span-1 flex items-center justify-center rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <ScoreGauge score={analysis.score} />
        </div>

        {/* Executive Summary */}
        <div className="col-span-2 flex flex-col justify-center rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            Executive Summary
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Keywords Section */}
      <KeywordList
        present={analysis.keywords.present}
        missing={analysis.keywords.missing}
      />

      {/* Detailed Analysis */}
      <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
        <SectionAnalysis sections={analysis.sections} />
      </div>
    </motion.div>
  );
}
