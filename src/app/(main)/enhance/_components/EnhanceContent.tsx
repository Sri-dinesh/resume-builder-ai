"use client";

import { useState, useEffect } from "react";
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

interface CachedData {
  parsedText: string;
  enhancedText: ResumeValues;
  timestamp: number;
}

export default function EnhanceContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfjs, setPdfjs] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // CHANGED: Use the standard import, not "legacy/build/pdf"
        const mod = await import("pdfjs-dist");

        // Use the version from the module, or fallback to your installed version
        const version = mod.version || "5.4.530";

        // Set the worker source to the .mjs file (Standard for v5+)
        mod.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;

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
    } catch (err: unknown) {
      console.error("Error enhancing resume:", err);
      setError(err instanceof Error ? err.message : "Failed to enhance resume");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleFileChange = async (file: File) => {
    if (!pdfjs) {
      setError("PDF library is still loading. Please try again.");
      return;
    }
    try {
      setLoading(true);
      const arrayBuffer = await file.arrayBuffer();

      // 4. Load the document. In v5, we use 'getDocument' directly.
      const loadingTask = pdfjs.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (!enhancedText) {
        setError("Resume data is not available");
        return;
      }
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
    <div className="min-h-screen w-full bg-muted/20 py-8 md:py-12">
      <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Enhance Your Resume
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Upload your PDF resume and let our system improve and generate a new
            one for you.
            <span className="ml-2 inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              Beta
            </span>
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <FileUpload
              onChange={(files: File[]) => {
                if (files.length > 0) {
                  handleFileChange(files[0]);
                }
              }}
            />
          </div>
        </div>

        {(loading || isEnhancing) && (
          <div className="mx-auto max-w-xl">
            <div className="flex items-center justify-center space-x-3 rounded-xl border border-border bg-card p-6 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-lg font-medium text-foreground/80">
                {loading
                  ? "Parsing your resume..."
                  : "Enhancing your resume..."}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-xl">
            <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm font-medium text-destructive">
              {error}
            </div>
          </div>
        )}

        {enhancedText && (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                  <h2 className="text-sm font-semibold tracking-tight">
                    Original Content
                  </h2>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <pre className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-muted-foreground">
                    {parsedText}
                  </pre>
                </div>
              </div>

              <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                  <h2 className="text-sm font-semibold tracking-tight text-primary">
                    Enhanced Version
                  </h2>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <pre className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-muted-foreground">
                    {JSON.stringify(enhancedText, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Generated Resume Preview */}
            <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Generated Resume
                </h2>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={loading}
                  className="px-6"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Download PDF
                </Button>
              </div>

              <div className="flex justify-center pt-2">
                <div
                  style={{
                    width: "210mm",
                    height: "297mm",
                    maxWidth: "100%",
                    overflow: "hidden",
                    position: "relative",
                    background: "white",
                  }}
                >
                  <div id="downloadableResume" className="h-full w-full">
                    <DownloadableResume resumeData={enhancedText} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
