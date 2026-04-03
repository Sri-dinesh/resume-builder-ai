"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  FileType,
  Info,
  Loader2,
  RefreshCw,
  Sparkles,
  WandSparkles,
  ChevronDown,
  User,
  Briefcase,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { getUserResumes, type CoverLetterResumeData } from "./actions";

const coverLetterTones = [
  "professional",
  "enthusiastic",
  "conversational",
  "formal",
  "confident",
] as const;
const coverLetterLengths = ["concise", "standard", "detailed"] as const;
const industryTemplates = [
  "technology",
  "finance",
  "healthcare",
  "marketing",
  "education",
  "consulting",
  "creative",
  "general",
] as const;

const coverLetterFormSchema = z.object({
  jobTitle: z.string().trim().min(2).max(200),
  companyName: z.string().trim().min(2).max(200),
  jobDescription: z.string().trim().min(50).max(10000),
  firstName: z.string().trim().max(100).optional().or(z.literal("")),
  lastName: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  currentJobTitle: z.string().trim().max(200).optional().or(z.literal("")),
  summary: z.string().trim().max(2000).optional().or(z.literal("")),
  workExperience: z.string().trim().max(5000).optional().or(z.literal("")),
  tone: z.enum(coverLetterTones).default("professional"),
  length: z.enum(coverLetterLengths).default("standard"),
  industry: z.enum(industryTemplates).default("general"),
  customInstructions: z.string().trim().max(1000).optional().or(z.literal("")),
});

type CoverLetterFormValues = z.infer<typeof coverLetterFormSchema>;
type CoverLetterTone = (typeof coverLetterTones)[number];
type CoverLetterLength = (typeof coverLetterLengths)[number];
type CoverLetterIndustry = (typeof industryTemplates)[number];

interface CoverLetterResult {
  coverLetter: string;
  metadata: {
    wordCount: number;
    tone: string;
    keySkillsHighlighted: string[];
    generatedAt: string;
  };
}

interface ResumeData {
  id: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  summary?: string;
  workExperiences?: Array<{
    position?: string;
    company?: string;
    description?: string;
  }>;
  skills?: string[];
}

const coverLetterFormDefaults: CoverLetterFormValues = {
  jobTitle: "",
  companyName: "",
  jobDescription: "",
  firstName: "",
  lastName: "",
  email: "",
  currentJobTitle: "",
  summary: "",
  workExperience: "",
  tone: "professional",
  length: "standard",
  industry: "general",
  customInstructions: "",
};

const QUALITY_HINTS = [
  {
    title: "Keyword Alignment",
    detail:
      "Use the full job description for better keyword matching and ATS optimization.",
  },
  {
    title: "Resume Import",
    detail:
      "Import a saved resume to reduce manual entry and highlight your achievements.",
  },
  {
    title: "Smart Personalization",
    detail: "Review and personalize 1-2 sentences to show genuine interest.",
  },
  {
    title: "Tone Matching",
    detail: "Match the company culture by choosing the right tone.",
  },
];

function ResumeSelector({
  onSelect,
}: {
  onSelect: (resume: ResumeData | null) => void;
}) {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchResumes() {
      try {
        const data = await getUserResumes();
        if (!active) return;
        setResumes(
          data.map((r: CoverLetterResumeData) => ({
            id: r.id,
            title: r.title || undefined,
            firstName: r.firstName || undefined,
            lastName: r.lastName || undefined,
            email: r.email || undefined,
            jobTitle: r.jobTitle || undefined,
            summary: r.summary || undefined,
            skills: r.skills || undefined,
            workExperiences: r.workExperiences?.map((exp) => ({
              position: exp.position || undefined,
              company: exp.company || undefined,
              description: exp.description || undefined,
            })),
          })),
        );
      } catch {
        if (active) setError("Failed to load saved resumes.");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchResumes();
    return () => { active = false; };
  }, []);

  const handleSelect = (resumeId: string) => {
    setSelectedId(resumeId);
    if (resumeId === "manual") {
      onSelect(null);
      return;
    }
    onSelect(resumes.find((r) => r.id === resumeId) || null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Loading saved resumes...
      </div>
    );
  }

  if (error || resumes.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
        No saved resumes found. Enter your details manually below.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Import Resume Data</Label>
      <Select onValueChange={handleSelect} value={selectedId || undefined}>
        <SelectTrigger className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm">
          <SelectValue placeholder="Select a saved resume" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Enter details manually</SelectItem>
          {resumes.map((resume) => (
            <SelectItem key={resume.id} value={resume.id}>
              {resume.title ||
                `${resume.firstName || ""} ${resume.lastName || ""}`.trim() ||
                "Untitled Resume"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function resumeToFormValues(
  resume: ResumeData,
): Partial<CoverLetterFormValues> {
  return {
    firstName: resume.firstName || "",
    lastName: resume.lastName || "",
    email: resume.email || "",
    currentJobTitle: resume.jobTitle || "",
    summary: resume.summary || "",
    workExperience:
      resume.workExperiences
        ?.map((exp) =>
          [exp.position, exp.company, exp.description]
            .filter(Boolean)
            .join("\n"),
        )
        .filter(Boolean)
        .join("\n\n") || "",
  };
}

export default function CoverLetterPage() {
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const form = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterFormSchema),
    defaultValues: coverLetterFormDefaults,
  });

  const { register, handleSubmit, watch, setValue, formState } = form;
  const { errors } = formState;

  const jobDescription = watch("jobDescription") || "";
  const workExperience = watch("workExperience") || "";

  const handleResumeImport = (resume: ResumeData | null) => {
    if (!resume) return;
    const imported = resumeToFormValues(resume);
    Object.entries(imported).forEach(([key, value]) => {
      setValue(key as keyof CoverLetterFormValues, value, {
        shouldDirty: true,
      });
    });
  };

  const onSubmit = async (values: CoverLetterFormValues) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setProgress(10);

    const timer = window.setInterval(() => {
      setProgress((p) => Math.min(p + 12, 90));
    }, 450);

    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: values.jobTitle,
          companyName: values.companyName,
          jobDescription: values.jobDescription,
          resumeData: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            jobTitle: values.currentJobTitle,
            summary: values.summary,
            workExperiences: values.workExperience
              ? values.workExperience.split("\n\n").map((block) => {
                  const lines = block.split("\n").filter(Boolean);
                  return {
                    position: lines[0] || "",
                    company: lines[1] || "",
                    description: lines.slice(2).join("\n"),
                  };
                })
              : [],
          },
          tone: values.tone,
          length: values.length,
          industry: values.industry,
          customInstructions: values.customInstructions,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.coverLetter)
        throw new Error(data.error || "Failed to generate");

      setResult(data);
      setProgress(100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate cover letter.",
      );
    } finally {
      clearInterval(timer);
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.coverLetter) return;
    await navigator.clipboard.writeText(result.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileSlug = () =>
    (watch("companyName") || "cover-letter")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

  const handleDownloadTxt = () => {
    if (!result?.coverLetter) return;
    const blob = new Blob([result.coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${getFileSlug()}-cover-letter.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocx = async () => {
    if (!result?.coverLetter) return;
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    const { saveAs } = await import("file-saver");

    const paragraphs = result.coverLetter.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 24,
              font: "Calibri",
            }),
          ],
          spacing: { after: 200 },
        }),
    );

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${getFileSlug()}-cover-letter.docx`);
  };

  const handleDownloadPdf = async () => {
    if (!result?.coverLetter) return;
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    let y = 25;

    pdf.setFont("helvetica");
    pdf.setFontSize(11);

    const lines = pdf.splitTextToSize(result.coverLetter, maxWidth);
    for (const line of lines) {
      if (y > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    }

    pdf.save(`${getFileSlug()}-cover-letter.pdf`);
  };

  const handleStartOver = () => {
    setResult(null);
    setError(null);
    setProgress(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background py-8 md:py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background dark:from-primary/5" />
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[100px] dark:bg-sky-500/5" />

      <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 px-6 py-2 text-sm font-semibold tracking-wide text-primary shadow-sm dark:border-primary/20 dark:bg-primary/10"
          >
            <WandSparkles className="mr-1.5 h-4 w-4" />
            AI Cover Letter Generator
          </Badge>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/50 shadow-sm backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Role Details</h2>
                  <p className="text-xs text-muted-foreground">
                    Information about the position you&apos;re applying for
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <ResumeSelector onSelect={handleResumeImport} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-xs font-medium">
                      Job Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="jobTitle"
                      placeholder="Senior Product Designer"
                      className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm focus-visible:ring-primary/20"
                      {...register("jobTitle")}
                    />
                    {errors.jobTitle && (
                      <p className="text-[11px] text-destructive">
                        {errors.jobTitle.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="text-xs font-medium"
                    >
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Inc."
                      className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm focus-visible:ring-primary/20"
                      {...register("companyName")}
                    />
                    {errors.companyName && (
                      <p className="text-[11px] text-destructive">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="jobDescription"
                      className="text-xs font-medium"
                    >
                      Job Description{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <span className="text-[10px] text-muted-foreground">
                      {jobDescription.length.toLocaleString()} / 10,000
                    </span>
                  </div>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here to match keywords and tailor your letter..."
                    className="min-h-[140px] resize-none rounded-lg border border-border/50 bg-background/60 text-sm leading-relaxed focus-visible:ring-primary/20"
                    {...register("jobDescription")}
                  />
                  {errors.jobDescription && (
                    <p className="text-[11px] text-destructive">
                      {errors.jobDescription.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-6 lg:p-8">
              <button
                type="button"
                onClick={() => setShowProfile(!showProfile)}
                className="group flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-sm font-semibold">Your Profile</h2>
                    <p className="text-xs text-muted-foreground">
                      Personalize the letter with your information
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${showProfile ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-6">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Input
                          placeholder="First Name"
                          className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm"
                          {...register("firstName")}
                        />
                        <Input
                          placeholder="Last Name"
                          className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm"
                          {...register("lastName")}
                        />
                        <Input
                          placeholder="Email Address"
                          type="email"
                          className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm"
                          {...register("email")}
                        />
                      </div>
                      <Input
                        placeholder="Current Job Title"
                        className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm"
                        {...register("currentJobTitle")}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="summary"
                            className="text-xs text-muted-foreground"
                          >
                            Professional Summary
                          </Label>
                          <Textarea
                            id="summary"
                            placeholder="Brief overview of your background..."
                            className="min-h-[100px] resize-none rounded-lg border border-border/50 bg-background/60 text-sm transition-colors focus:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                            {...register("summary")}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="workExperience"
                              className="text-xs text-muted-foreground"
                            >
                              Work Experience
                            </Label>
                            <span className="text-[10px] text-muted-foreground">
                              {workExperience.length.toLocaleString()} / 5,000
                            </span>
                          </div>
                          <Textarea
                            id="workExperience"
                            placeholder={`Role\nCompany\nAchievements\n\nRole...`}
                            className="min-h-[100px] resize-none rounded-lg border border-border/50 bg-background/60 text-sm transition-colors focus:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                            {...register("workExperience")}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator />

            <div className="p-6 lg:p-8">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="group flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                    <Palette className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-sm font-semibold">
                      Generation Settings
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Customize how your cover letter is written
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${showSettings ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-6">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Tone</Label>
                          <Select
                            defaultValue={coverLetterFormDefaults.tone}
                            onValueChange={(value: CoverLetterTone) =>
                              setValue("tone", value)
                            }
                          >
                            <SelectTrigger className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm capitalize">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {coverLetterTones.map((t) => (
                                <SelectItem
                                  key={t}
                                  value={t}
                                  className="text-sm capitalize"
                                >
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Length</Label>
                          <Select
                            defaultValue={coverLetterFormDefaults.length}
                            onValueChange={(value: CoverLetterLength) =>
                              setValue("length", value)
                            }
                          >
                            <SelectTrigger className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm capitalize">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {coverLetterLengths.map((l) => (
                                <SelectItem
                                  key={l}
                                  value={l}
                                  className="text-sm capitalize"
                                >
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">
                            Industry
                          </Label>
                          <Select
                            defaultValue={coverLetterFormDefaults.industry}
                            onValueChange={(value: CoverLetterIndustry) =>
                              setValue("industry", value)
                            }
                          >
                            <SelectTrigger className="h-10 rounded-lg border border-border/50 bg-background/60 text-sm capitalize">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {industryTemplates.map((i) => (
                                <SelectItem
                                  key={i}
                                  value={i}
                                  className="text-sm capitalize"
                                >
                                  {i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <Label
                            htmlFor="customInstructions"
                            className="text-xs font-medium"
                          >
                            Custom Instructions (Optional)
                          </Label>
                          <Select
                            onValueChange={(v) =>
                              setValue("customInstructions", v, {
                                shouldDirty: true,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 w-full sm:w-[260px] rounded-lg border border-border/50 bg-background/60 text-xs text-muted-foreground transition-colors hover:bg-muted/50">
                              <SelectValue placeholder="💡 Try a quick preset..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Emphasize my leadership experience and team management skills.">
                                Highlight Leadership
                              </SelectItem>
                              <SelectItem value="Focus on my technical expertise and problem-solving abilities.">
                                Focus on Technical Skills
                              </SelectItem>
                              <SelectItem value="Mention my recent career transition and transferable skills.">
                                Career Change Focus
                              </SelectItem>
                              <SelectItem value="Highlight my recent achievements and quantifiable results.">
                                Recent Achievements
                              </SelectItem>
                              <SelectItem value="Emphasize my passion for the company's mission and values.">
                                Company Mission Fit
                              </SelectItem>
                              <SelectItem value="Mention my experience with remote work and collaboration tools.">
                                Remote Work Experience
                              </SelectItem>
                              <SelectItem value="Highlight my industry-specific certifications and expertise.">
                                Industry Expertise
                              </SelectItem>
                              <SelectItem value="Focus on my ability to learn quickly and adapt to new challenges.">
                                Fast Learner
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          id="customInstructions"
                          placeholder="Add any specific requests for your cover letter..."
                          className="min-h-[80px] w-full resize-none rounded-lg border border-border/50 bg-background/60 text-sm transition-colors focus:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                          {...register("customInstructions")}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Section */}
            <div className="border-t border-border/40 bg-muted/20 px-6 py-5 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {error ? (
                  <div className="flex items-center gap-2 text-xs text-destructive">
                    <Info className="h-4 w-4" />
                    {error}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    All fields marked with{" "}
                    <span className="text-destructive">*</span> are required
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="h-11 rounded-lg px-8 text-sm font-medium shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="mt-10">
          {!result ? (
            <AnimatePresence>
              {!isGenerating ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {QUALITY_HINTS.map((hint) => (
                    <div
                      key={hint.title}
                      className="group rounded-xl border border-border/40 bg-card/30 p-4 transition-colors hover:bg-card/50"
                    >
                      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-medium text-foreground">
                        {hint.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {hint.detail}
                      </p>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="relative mb-6">
                    <Loader2 className="h-12 w-12 animate-spin text-primary/20" />
                    <WandSparkles className="absolute inset-0 m-auto h-6 w-6 animate-pulse text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">
                    Crafting your letter...
                  </h3>
                  <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
                    Analyzing the job requirements and tailoring your
                    experience.
                  </p>
                  <Progress value={progress} className="mt-6 h-1.5 w-48" />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-semibold">
                    Your Cover Letter is Ready
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-9 rounded-lg text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                  <div className="h-5 w-px bg-border/60 hidden sm:block" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTxt}
                    className="h-9 rounded-lg text-xs"
                    title="Download as plain text"
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    TXT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadDocx}
                    className="h-9 rounded-lg text-xs"
                    title="Download as Word document"
                  >
                    <FileType className="mr-1.5 h-3.5 w-3.5" />
                    DOCX
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPdf}
                    className="h-9 rounded-lg text-xs"
                    title="Download as PDF"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    PDF
                  </Button>
                  <div className="h-5 w-px bg-border/60 hidden sm:block" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStartOver}
                    className="h-9 rounded-lg text-xs"
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                    New
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
                <div className="overflow-hidden rounded-xl border border-border/40 bg-card/50 shadow-sm">
                  <Tabs defaultValue="preview" className="w-full">
                    <div className="border-b border-border/40 bg-muted/20 px-4 py-3">
                      <TabsList className="h-8 rounded-lg bg-background/60">
                        <TabsTrigger
                          value="preview"
                          className="rounded-md px-3 text-xs"
                        >
                          Preview
                        </TabsTrigger>
                        <TabsTrigger
                          value="plain"
                          className="rounded-md px-3 text-xs"
                        >
                          Plain Text
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="preview" className="m-0 p-6">
                      <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-foreground/90">
                        {result.coverLetter
                          .split("\n")
                          .map((para, i) =>
                            para ? <p key={i}>{para}</p> : <br key={i} />,
                          )}
                      </div>
                    </TabsContent>
                    <TabsContent value="plain" className="m-0">
                      <Textarea
                        readOnly
                        value={result.coverLetter}
                        className="min-h-[500px] resize-none border-0 bg-transparent p-6 font-mono text-sm focus-visible:ring-0"
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-border/40 bg-card/50 p-5">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Letter Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-[10px] font-medium uppercase text-muted-foreground">
                          Words
                        </p>
                        <p className="text-2xl font-semibold">
                          {result.metadata.wordCount}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-[10px] font-medium uppercase text-muted-foreground">
                          Tone
                        </p>
                        <p className="text-sm font-semibold capitalize">
                          {result.metadata.tone}
                        </p>
                      </div>
                    </div>
                    {result.metadata.keySkillsHighlighted.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-[10px] font-medium uppercase text-muted-foreground">
                          Keywords Matched
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.metadata.keySkillsHighlighted.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="px-2 py-0.5 text-[10px] font-normal"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="rounded-xl border border-border/40 bg-amber-500/5 p-5">
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <div>
                        <h4 className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                          Pro Tips
                        </h4>
                        <ul className="mt-2 space-y-2">
                          <li className="flex items-start gap-2 text-[11px] text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                            Add a specific project detail from the job
                            description
                          </li>
                          <li className="flex items-start gap-2 text-[11px] text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                            Find and use the hiring manager&apos;s name if
                            possible
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
