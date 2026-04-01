"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Sparkles,
  Download,
  FileText,
  CheckCircle2,
  Wand2,
  Eye,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { ResumeValues } from "@/lib/validation";

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

const FEATURES = [
  {
    title: "AI-Powered Enhancement",
    description:
      "Advanced language models improve your resume content with professional rewriting.",
  },
  {
    title: "ATS-Optimized Format",
    description:
      "Structured output that passes applicant tracking systems with ease.",
  },
  {
    title: "Instant PDF Download",
    description:
      "Get your enhanced resume as a professionally formatted PDF immediately.",
  },
];

export default function EnhanceContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "result">("upload");

  useEffect(() => {
    let mounted = true;

    const loadPdfJs = async () => {
      try {
        const pdfjs = await import("pdfjs-dist");

        const version = pdfjs.version || "5.4.530";

        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;

        if (mounted) {
          setPdfLibLoaded(true);
          console.log("PDF.js loaded successfully, version:", version);
        }
      } catch (e) {
        console.error("Failed to load pdfjs:", e);
        if (mounted) {
          setError("Failed to load PDF parser. Please refresh the page.");
        }
      }
    };

    loadPdfJs();

    return () => {
      mounted = false;
    };
  }, []);

  const [parsedText, setParsedText] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const cached = localStorage.getItem("cachedResumeData");
      if (!cached) return "";
      const { parsedText } = JSON.parse(cached) as CachedData;
      return parsedText || "";
    } catch {
      return "";
    }
  });

  const [enhancedText, setEnhancedText] = useState<ResumeValues | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem("cachedResumeData");
      if (!cached) return null;
      const { enhancedText } = JSON.parse(cached) as CachedData;
      return enhancedText || null;
    } catch {
      return null;
    }
  });

  const [isEnhancing, setIsEnhancing] = useState(false);

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

  const enhanceResume = useCallback(async (text: string) => {
    try {
      const cached = localStorage.getItem("cachedResumeData");
      if (cached) {
        const { parsedText: cachedParsed, enhancedText: cachedEnhanced } =
          JSON.parse(cached) as CachedData;
        if (cachedParsed === text && cachedEnhanced) {
          setEnhancedText(cachedEnhanced);
          setActiveTab("result");
          return;
        }
      }

      setIsEnhancing(true);
      setError("");

      const response = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance resume");
      }

      if (!data.enhancedText) {
        throw new Error("No enhanced content received from server");
      }

      setEnhancedText(data.enhancedText);
      setActiveTab("result");
    } catch (err: unknown) {
      console.error("Error enhancing resume:", err);
      setError(err instanceof Error ? err.message : "Failed to enhance resume");
    } finally {
      setIsEnhancing(false);
    }
  }, []);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjs = await import("pdfjs-dist");
    const arrayBuffer = await file.arrayBuffer();

    const pdfData = new Uint8Array(arrayBuffer);

    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const textItems = textContent.items;
      let lastY = 0;
      let pageText = "";

      for (const item of textItems) {
        if ("str" in item) {
          if (lastY !== 0 && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += "\n";
          }
          pageText += item.str + " ";
          lastY = item.transform[5];
        }
      }

      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  };

  const handleFileChange = async (file: File) => {
    if (!pdfLibLoaded) {
      setError(
        "PDF library is still loading. Please wait a moment and try again.",
      );
      return;
    }

    if (
      !file.type.includes("pdf") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please upload a valid PDF file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Starting PDF extraction for:", file.name);
      const extractedText = await extractTextFromPDF(file);
      console.log("Extracted text length:", extractedText.length);

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error(
          "No text could be extracted from the PDF. The PDF might be scanned or image-based.",
        );
      }

      if (extractedText.length < 50) {
        throw new Error(
          "The PDF contains too little text. Please upload a proper resume PDF.",
        );
      }

      setParsedText(extractedText);
      await enhanceResume(extractedText);
    } catch (err) {
      console.error("Error parsing PDF:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to parse PDF file. Please ensure it's a valid text-based PDF.",
      );
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

  const handleReset = () => {
    setParsedText("");
    setEnhancedText(null);
    setError("");
    setActiveTab("upload");
    localStorage.removeItem("cachedResumeData");
  };

  const isProcessing = loading || isEnhancing;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background py-8 md:py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background dark:from-primary/5" />
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-500/5" />

      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 px-6 py-2 text-sm font-semibold tracking-wide text-primary shadow-sm dark:border-primary/20 dark:bg-primary/10"
          >
            AI Resume Enhancer
          </Badge>
        </div>

        <div className="flex justify-center">
          <div className="grid w-full max-w-md grid-cols-2 gap-2 rounded-xl border border-border/50 bg-muted/50 p-1.5 dark:bg-muted/20">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                activeTab === "upload"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Upload
              </span>
            </button>
            <button
              type="button"
              onClick={() => enhancedText && setActiveTab("result")}
              disabled={!enhancedText}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                activeTab === "result"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                !enhancedText && "cursor-not-allowed opacity-50",
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                Enhanced
              </span>
            </button>
          </div>
        </div>

        {activeTab === "upload" && (
          <div className="space-y-8">
            <Card className="border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Wand2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Enhance Your Resume
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Upload your PDF and let AI transform it into a
                      professional masterpiece.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-sm transition-all hover:border-border">
                  <FileUpload
                    onChange={(files: File[]) => {
                      if (files.length > 0) {
                        handleFileChange(files[0]);
                      }
                    }}
                  />
                </div>

                {isProcessing && (
                  <div className="mt-6">
                    <div className="flex items-center justify-center gap-3 rounded-xl border border-border/50 bg-background/50 p-6">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <p className="text-sm font-medium text-foreground">
                        {loading
                          ? "Extracting text from your resume..."
                          : "AI is enhancing your resume..."}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {!pdfLibLoaded && !isProcessing && !error && (
                  <div className="mt-6">
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 p-4 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading PDF parser...</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {!enhancedText && !isProcessing && (
              <div className="grid gap-6 sm:grid-cols-3">
                {FEATURES.map((feature) => (
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
                          <h3 className="text-base font-semibold text-foreground">
                            {feature.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {enhancedText && !isProcessing && (
              <Card className="border-primary/30 bg-primary/5 shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/20 p-2 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Previous enhancement available
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You have an enhanced resume from your last session.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setActiveTab("result")}
                    variant="outline"
                  >
                    View Result
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "result" && enhancedText && (
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
              <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-500/10 p-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Resume Enhanced Successfully
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your professional resume is ready for download.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    New Upload
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={loading}
                    className="gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
              <CardHeader className="border-b border-border/50 bg-primary/5 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold text-primary">
                      Enhanced Resume Preview
                    </CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    A4 Format
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full overflow-auto bg-muted/30 p-4 sm:p-6 lg:p-8">
                  <div
                    className="mx-auto bg-white shadow-2xl dark:bg-neutral-950"
                    style={{
                      width: "100%",
                      maxWidth: "210mm",
                      minHeight: "297mm",
                    }}
                  >
                    <DownloadableResume resumeData={enhancedText} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
              <CardHeader className="border-b border-border/50 bg-muted/30 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Original Content (Raw Text)
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="p-6">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {parsedText || "No original content available."}
                    </pre>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
