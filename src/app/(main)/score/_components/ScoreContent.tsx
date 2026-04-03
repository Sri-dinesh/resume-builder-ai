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
  const [, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisMode, setAnalysisMode] =
    useState<ScoreAnalysisMode>("general");
  const [jobDescription, setJobDescription] = useState("");

  const handleFileUpload = (files: File[]) => {
    setError("");
    setResult(null);

    if (files.length > 0) {
      const selectedFile = files[0];
      const isPdfFile =
        selectedFile.type === "application/pdf" ||
        selectedFile.name.toLowerCase().endsWith(".pdf");

      if (!isPdfFile) {
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
    <div className="relative min-h-screen overflow-hidden bg-background py-8 md:py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background dark:from-primary/5" />
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[100px] dark:bg-sky-500/5" />

      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 px-6 py-2 text-sm font-semibold tracking-wide text-primary shadow-sm dark:border-primary/20 dark:bg-primary/10"
          >
            ATS Resume Score
          </Badge>
        </div>

        <div className="grid gap-12">
          <Card className="h-fit w-full border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
            <CardHeader className="p-6 pb-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <WandSparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Analysis Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Choose your scan type and upload.
                    </p>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-2 rounded-xl border border-border/50 bg-muted/50 p-1.5 dark:bg-muted/20 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setAnalysisMode("general")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      analysisMode === "general"
                        ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    }`}
                  >
                    General Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisMode("jd")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      analysisMode === "jd"
                        ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    }`}
                  >
                    Job Match
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 lg:flex-row lg:items-stretch"
              >
                <div className="w-full flex-1 overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-sm transition-all hover:border-border">
                  <FileUpload
                    accept={SCORE_ACCEPTED_FILE_TYPES}
                    onChange={handleFileUpload}
                    maxFiles={1}
                  />
                </div>

                <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[380px] xl:w-[440px]">
                  {analysisMode === "jd" ? (
                    <div className="flex flex-1 flex-col space-y-3 rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Target className="h-4 w-4 text-primary" />
                        Job Description
                      </div>
                      <Textarea
                        id="job-description"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the target job requirements here to match keywords..."
                        className="flex-1 resize-none rounded-lg bg-background/80 text-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-background/30 p-6 text-center text-sm text-muted-foreground">
                      <div className="mb-3 rounded-full bg-primary/10 p-2.5 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <p className="max-w-[280px]">
                        Select{" "}
                        <span className="font-semibold text-foreground">
                          Job Match
                        </span>{" "}
                        to evaluate your resume specifically against a target
                        role.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !file}
                    className="h-12 w-full shrink-0 rounded-xl text-base font-semibold shadow-md transition-all hover:shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      "Analyze Resume"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="w-full space-y-12">
            {!result ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {SCAN_FEATURES.map((feature) => (
                    <Card
                      key={feature.title}
                      className="border-border/50 bg-card/60 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md dark:bg-card/40"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold text-foreground">
                              {feature.title}
                            </h2>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {feature.detail}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-border/50 bg-card/60 shadow-sm backdrop-blur-xl dark:bg-card/40">
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="text-xl">
                      How to get the highest score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6 p-8 md:grid-cols-3">
                    <div className="group rounded-2xl border border-border/50 bg-background/50 p-6 transition-colors hover:border-primary/30">
                      <p className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                        Standard Headings
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Use specific labels like &quot;Work Experience&quot; and
                        &quot;Skills&quot; for accurate ATS parsing.
                      </p>
                    </div>
                    <div className="group rounded-2xl border border-border/50 bg-background/50 p-6 transition-colors hover:border-primary/30">
                      <p className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                        Quantify Outcomes
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Include direct numbers, percentages, and metrics to
                        prove your real business impact.
                      </p>
                    </div>
                    <div className="group rounded-2xl border border-border/50 bg-background/50 p-6 transition-colors hover:border-primary/30">
                      <p className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                        Tailor Content
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Use a target job description to identify missing skill
                        keywords and close gaps.
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
