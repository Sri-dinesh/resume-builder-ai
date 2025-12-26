"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FileUpload } from "@/components/ui/file-upload";
import { Loader2 } from "lucide-react";

// Dynamically import ScoreDashboard - it's only needed after analysis
const ScoreDashboard = dynamic(
  () =>
    import("@/components/score/ScoreDashboard").then(
      (mod) => mod.ScoreDashboard,
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    ),
    ssr: false,
  },
);

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

export default function ScoreContent() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [analysisMode, setAnalysisMode] = useState<"general" | "jd">("general");
  const [jobDescription, setJobDescription] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfjs, setPdfjs] = useState<any>(null);

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const mod = await import("pdfjs-dist/legacy/build/pdf");
        mod.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${mod.version}/pdf.worker.min.js`;
        if (mounted) {
          setPdfjs(mod);
        }
      } catch (e) {
        console.error("Failed to load pdfjs", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFileUpload = (files: File[]) => {
    setError("");
    setResult(null);
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    setLoadingStep("Parsing PDF...");

    try {
      if (!pdfjs) {
        throw new Error("PDF library is still loading. Please try again.");
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;

      const pageTexts = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, index) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.getPage(index + 1).then((page: any) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            page.getTextContent().then((content: any) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content.items.map((item: any) => item.str).join(" "),
            ),
          ),
        ),
      );
      const extractedText = pageTexts.join("\n").trim();

      setLoadingStep("Analyzing...");

      // Send parsed content for analysis.
      const formData = new FormData();
      formData.append("content", extractedText);
      formData.append("filename", file.name);
      if (analysisMode === "jd") {
        formData.append("jobDescription", jobDescription);
      }

      const res = await fetch("/api/score", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze resume.");
      }

      const analysis: AnalysisResult = await res.json();
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
      setLoadingStep("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            AI Resume Scorer
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Get a detailed analysis of your resume. Choose between a general
            evaluation or a targeted check against a specific job description.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex justify-center gap-4">
            <button
              onClick={() => setAnalysisMode("general")}
              className={`rounded-full px-6 py-2 font-medium transition-all ${
                analysisMode === "general"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              General Analysis
            </button>
            <button
              onClick={() => setAnalysisMode("jd")}
              className={`rounded-full px-6 py-2 font-medium transition-all ${
                analysisMode === "jd"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              Match Job Description
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 shadow-sm transition-all hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800">
              <FileUpload onChange={handleFileUpload} maxFiles={1} />
            </div>

            {analysisMode === "jd" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paste Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="h-40 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading || !file}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-blue-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {loadingStep}
                  </>
                ) : (
                  "Analyze Resume"
                )}
                <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {result && <ScoreDashboard analysis={result} />}
      </div>
    </div>
  );
}
