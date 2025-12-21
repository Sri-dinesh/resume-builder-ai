"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { FileUpload } from "@/components/ui/file-upload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ResumeValues } from "@/lib/validation";

// Dynamically import heavy components
const DownloadableResume = dynamic(
  () => import("@/components/DownloadableResume"),
  {
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
    ssr: false,
  },
);

// Lazy load heavy libraries only when needed
let pdfLib: any = null;

const loadPdfLib = async () => {
  if (!pdfLib) {
    pdfLib = await import("pdfjs-dist");
    pdfLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfLib.version}/pdf.worker.min.js`;
  }
  return pdfLib;
};

interface CachedData {
  parsedText: string;
  enhancedText: ResumeValues;
  timestamp: number;
}

export default function EnhanceContent() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedText, setParsedText] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    try {
      const cached = localStorage.getItem("cachedResumeData");
      if (!cached) {
        return "";
      }
      const { parsedText } = JSON.parse(cached) as CachedData;
      return parsedText || "";
    } catch (e) {
      console.error("Failed to parse cached resume data", e);
      return "";
    }
  });
  const [enhancedText, setEnhancedText] = useState<ResumeValues | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const cached = localStorage.getItem("cachedResumeData");
      if (!cached) {
        return null;
      }
      const { enhancedText } = JSON.parse(cached) as CachedData;
      return enhancedText || null;
    } catch (e) {
      console.error("Failed to parse cached resume data", e);
      return null;
    }
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Update localStorage when parsedText and enhancedText change
  useEffect(() => {
    if (parsedText && enhancedText) {
      const cacheData: CachedData = {
        parsedText,
        enhancedText,
        timestamp: Date.now(),
      };
      localStorage.setItem("cachedResumeData", JSON.stringify(cacheData));
    }
  }, [parsedText, enhancedText]);

  const enhanceResume = async (text: string) => {
    try {
      // Check if we have cached data for this exact text
      const cached = localStorage.getItem("cachedResumeData");
      if (cached) {
        const { parsedText: cachedParsed, enhancedText: cachedEnhanced } =
          JSON.parse(cached) as CachedData;
        if (cachedParsed === text) {
          setEnhancedText(cachedEnhanced);
          return;
        }
      }
      setIsEnhancing(true);
      setError("");

      const response = await fetch("/api/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance resume");
      }
      setEnhancedText(data.enhancedText);
    } catch (err: any) {
      console.error("Error enhancing resume:", err);
      setError(err.message || "Failed to enhance resume");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleFileChange = async (file: File) => {
    setFile(file);
    try {
      setLoading(true);
      const pdfjsLib = await loadPdfLib();
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }
      setParsedText(fullText);
      await enhanceResume(fullText);
    } catch (err) {
      console.error("Error parsing PDF:", err);
      setError("Failed to parse PDF file");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      // Dynamically import to avoid SSR issues and reduce initial bundle
      const [{ pdf }, { default: ResumePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/ResumePDF"),
      ]);
      const blob = await pdf(<ResumePDF resumeData={enhancedText} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "enhanced-resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <div className="space-y-10">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Enhance Your Resume
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload your PDF resume and let AI improve & generate a new one just
            for you
          </p>
          <p className="text-base text-muted-foreground">
            Note: This feature is still in beta so it may not be perfect.
          </p>
        </div>

        <Card className="p-10">
          <div className="mx-auto max-w-4xl">
            <FileUpload
              onChange={(files: File[]) => {
                if (files.length > 0) {
                  handleFileChange(files[0]);
                }
              }}
            />
          </div>
        </Card>

        {(loading || isEnhancing) && (
          <Card className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-lg">
                {loading
                  ? "Parsing your resume..."
                  : "Enhancing your resume..."}
              </p>
            </div>
          </Card>
        )}

        {error && (
          <Card className="border-destructive p-6">
            <p className="text-center text-lg text-destructive">{error}</p>
          </Card>
        )}

        {enhancedText && (
          <>
            <div className="grid gap-10 md:grid-cols-2">
              <Card className="h-[700px] overflow-auto p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-semibold">
                  Original Content
                </h2>
                <div className="rounded-lg bg-muted/50 p-8">
                  <pre className="whitespace-pre-wrap text-base leading-relaxed">
                    {parsedText}
                  </pre>
                </div>
              </Card>

              <Card className="h-[700px] overflow-auto p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-semibold">
                  Enhanced Version
                </h2>
                <div className="rounded-lg bg-muted/50 p-8">
                  <pre className="whitespace-pre-wrap text-base leading-relaxed">
                    {JSON.stringify(enhancedText, null, 2)}
                  </pre>
                </div>
              </Card>
            </div>

            {/* Generated Resume Preview */}
            <div className="mt-10 space-y-6">
              <h2 className="text-2xl font-semibold">Generated Resume</h2>
              <div className="p-4" style={{ padding: "5mm" }}>
                <div
                  className="mx-auto flex justify-center"
                  style={{
                    width: "210mm",
                    height: "297mm",
                    maxWidth: "100%",
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div id="downloadableResume" className="h-full w-full">
                    <DownloadableResume resumeData={enhancedText} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button
                size="lg"
                className="px-8 py-6 text-lg"
                onClick={handleDownloadPDF}
                disabled={loading}
              >
                {loading ? "Generating PDF..." : "Download PDF"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
