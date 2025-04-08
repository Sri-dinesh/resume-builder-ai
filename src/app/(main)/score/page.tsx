"use client";
import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from "pdfjs-dist";
import { FileUpload } from "@/components/ui/file-upload";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

interface AnalysisResult {
  score: number;
  suggestions: string[];
}

export default function ScorePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = (files: File[]) => {
    setError("");
    setResult(null);
    setParsedText(null);
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        return;
      }
      setFile(selectedFile);
      console.log(files);
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

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await getDocument(arrayBuffer).promise;

      const pageTexts = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, index) =>
          pdf
            .getPage(index + 1)
            .then((page) =>
              page
                .getTextContent()
                .then((content) =>
                  content.items.map((item: any) => item.str).join(" "),
                ),
            ),
        ),
      );
      const extractedText = pageTexts.join("\n");
      const trimmedText = extractedText.trim();
      setParsedText(trimmedText);

      // Send parsed content for analysis.
      const formData = new FormData();
      formData.append("content", trimmedText);
      formData.append("filename", file.name);

      const res = await fetch("/api/score", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to analyze resume.");
      }
      const analysis: AnalysisResult = await res.json();
      setResult(analysis);
    } catch (err) {
      console.error("Error processing resume:", err);
      setError("An error occurred while processing your resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-10 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-800 dark:text-white">
          Resume Parsing & Analysis
        </h1>
        <p className="mb-10 text-center text-gray-600 dark:text-gray-300">
          This analysis might not be 100% accurate, but it gives you a basic
          understanding of your resume level along with a few suggestions to
          improve it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="mx-auto w-full rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <FileUpload onChange={handleFileUpload} />
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
          <div className="text-center">
            <button
              type="submit"
              className="mt-4 inline-block rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Processing..." : "Upload and Analyze"}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-12 rounded-xl border border-gray-300 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-3xl font-semibold text-gray-800 dark:text-white">
              Analysis Results
            </h2>
            <p className="mb-4 text-xl text-gray-700 dark:text-gray-300">
              Score: {result.score.toFixed(1)}/10
            </p>
            <h3 className="mb-2 text-2xl font-medium text-gray-800 dark:text-white">
              Suggestions:
            </h3>
            <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
              {result.suggestions.map((sugg, idx) => (
                <li key={idx}>{sugg}</li>
              ))}
            </ul>
          </div>
        )}

        {parsedText && !result && (
          <div className="mt-8 rounded-xl border border-gray-300 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
              Parsed Resume Content
            </h2>
            <div className="max-h-96 overflow-auto whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {parsedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
