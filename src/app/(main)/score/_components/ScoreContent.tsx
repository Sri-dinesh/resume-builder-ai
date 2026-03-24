"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Loader2, Target, WandSparkles } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SCORE_ACCEPTED_FILE_TYPES,
  type ScoreAnalysisMode,
  type ScoreAnalysisResult,
} from "@/lib/score";
import { ScoreDashboard } from "@/components/score/ScoreDashboard";

const SCAN_FEATURES = [
  {
    title: "ATS parseability",
    detail:
      "Checks contact clarity, date consistency, section labels, and formatting signals that affect parsing.",
  },
  {
    title: "Keyword alignment",
    detail:
      "Measures how closely the resume mirrors the language and requirements in the target job description.",
  },
  {
    title: "Achievement quality",
    detail:
      "Looks for quantified impact, action verbs, and recruiter-friendly bullet structure.",
  },
  {
    title: "Clarity and brevity",
    detail:
      "Flags resumes that are too thin, too dense, too repetitive, or overly generic.",
  },
];

export default function ScoreContent() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScoreAnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisMode, setAnalysisMode] =
    useState<ScoreAnalysisMode>("general");
  const [jobDescription, setJobDescription] = useState("");

  const handleFileUpload = (files: File[]) => {
    setError("");
    setResult(null);

    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      return;
    }

    setFile(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    if (analysisMode === "jd" && !jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (analysisMode === "jd") {
        formData.append("jobDescription", jobDescription.trim());
      }

      const res = await fetch("/api/score", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        throw new Error(errorData.error || "Failed to analyze resume.");
      }

      const analysis = (await res.json()) as ScoreAnalysisResult;
      setResult(analysis);
    } catch (err: unknown) {
      console.error("Error processing resume:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing your resume.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eef6ff,transparent_30%),linear-gradient(to_bottom,#f8fafc,#f8fafc)] py-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <Badge
            variant="outline"
            className="border-sky-500/30 bg-sky-500/5 text-sky-700 dark:text-sky-300"
          >
            ATS Resume Score
          </Badge>
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Diagnose your resume like an ATS.
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Upload your PDF for a general ATS scan or job-specific match, and
              get actionable fixes to improve your visibility to recruiters.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
          <Card className="h-fit border-border/70 bg-card/95 shadow-sm xl:sticky xl:top-20">
            <CardHeader className="p-5 pb-0">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <WandSparkles className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Analysis Settings</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Choose your scan type and upload.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-muted/30 p-1">
                  <button
                    type="button"
                    onClick={() => setAnalysisMode("general")}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      analysisMode === "general"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    General Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisMode("jd")}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      analysisMode === "jd"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Job Match
                  </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <FileUpload
                    accept={SCORE_ACCEPTED_FILE_TYPES}
                    onChange={handleFileUpload}
                    maxFiles={1}
                  />
                </div>

                {analysisMode === "jd" && (
                  <div className="space-y-2.5 rounded-xl border border-border bg-background/70 p-3.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <Target className="h-3.5 w-3.5 text-primary" />
                      Job Description
                    </div>
                    <Textarea
                      id="job-description"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste job requirements here..."
                      className="h-36 resize-none rounded-lg bg-background text-sm"
                    />
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !file}
                  size="default"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Resume"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {!result ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SCAN_FEATURES.map((feature) => (
                    <Card
                      key={feature.title}
                      className="border-border/70 bg-card/95 shadow-sm"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold text-foreground">
                              {feature.title}
                            </h2>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {feature.detail}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-border/70 bg-card/95 shadow-sm">
                  <CardHeader className="p-5 pb-0">
                    <CardTitle className="text-base">
                      How to get the best score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 p-5 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-semibold text-foreground">
                        Standard Headings
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        Use labels like Work Experience and Skills for correct
                        parsing.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-semibold text-foreground">
                        Quantify Outcomes
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        Include numbers, percentages, and metrics to show real
                        impact.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-semibold text-foreground">
                        Tailor Content
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        Use a job description to identify and close keyword
                        gaps.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <ScoreDashboard analysis={result} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
