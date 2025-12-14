"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Briefcase,
  Building2,
  Sparkles,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  RefreshCw,
  Info,
  Import,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  coverLetterTones,
  coverLetterLengths,
  industryTemplates,
  CoverLetterTone,
  CoverLetterLength,
  IndustryTemplate,
} from "@/lib/cover-letter-validation";
import ResumeSelector from "./ResumeSelector";
import { getUserResumes } from "./actions";

// Form validation schema
const formSchema = z.object({
  // Required fields
  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(200, "Job title must be less than 200 characters"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must be less than 200 characters"),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(10000, "Job description must be less than 10,000 characters"),
  // Optional fields
  companyInfo: z.string().max(2000).optional(),
  hiringManagerName: z.string().max(100).optional(),
  // Personal info
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  currentJobTitle: z.string().max(200).optional(),
  summary: z.string().max(2000).optional(),
  // Work experience (simplified for form)
  workExperience: z.string().max(5000).optional(),
  // Skills
  skills: z.string().max(1000).optional(),
  // Education
  education: z.string().max(2000).optional(),
  // Customization
  tone: z.enum(coverLetterTones).default("professional"),
  length: z.enum(coverLetterLengths).default("standard"),
  industry: z.enum(industryTemplates).default("general"),
  customInstructions: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CoverLetterResult {
  coverLetter: string;
  metadata: {
    wordCount: number;
    tone: string;
    keySkillsHighlighted: string[];
    generatedAt: string;
  };
}

export default function CoverLetterPage() {
  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tone: "professional",
      length: "standard",
      industry: "general",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  // Handle resume import
  const handleResumeImport = useCallback(
    (resumeData: Awaited<ReturnType<typeof getUserResumes>>[number] | null) => {
      if (!resumeData) return;

      // Populate form with resume data
      setValue("firstName", resumeData.firstName || "");
      setValue("lastName", resumeData.lastName || "");
      setValue("email", resumeData.email || "");
      setValue("phone", resumeData.phone || "");
      setValue("city", resumeData.city || "");
      setValue("country", resumeData.country || "");
      setValue("linkedin", resumeData.linkedin || "");
      setValue("currentJobTitle", resumeData.jobTitle || "");
      setValue("summary", resumeData.summary || "");

      // Format work experience
      if (resumeData.workExperiences?.length) {
        const workExpText = resumeData.workExperiences
          .map(
            (exp) =>
              `${exp.position || ""}\n${exp.company || ""}\n${exp.description || ""}`,
          )
          .join("\n\n");
        setValue("workExperience", workExpText);
      }

      // Format skills
      if (resumeData.skills?.length) {
        setValue("skills", resumeData.skills.join(", "));
      }

      // Format education
      if (resumeData.educations?.length) {
        const eduText = resumeData.educations
          .map((edu) => `${edu.degree || ""}\n${edu.school || ""}`)
          .join("\n\n");
        setValue("education", eduText);
      }
    },
    [setValue],
  );

  // Watch values for character counts
  const jobDescription = watch("jobDescription") || "";
  const workExperience = watch("workExperience") || "";

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => Math.min(prev + 10, 90));
    }, 500);

    try {
      // Parse work experience into structured format
      const workExperiences = data.workExperience
        ? data.workExperience.split("\n\n").map((exp) => {
            const lines = exp.split("\n");
            return {
              position: lines[0] || "",
              company: lines[1] || "",
              description: lines.slice(2).join("\n") || "",
            };
          })
        : [];

      // Parse skills
      const skills = data.skills
        ? data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      // Parse education
      const educations = data.education
        ? data.education.split("\n\n").map((edu) => {
            const lines = edu.split("\n");
            return {
              degree: lines[0] || "",
              school: lines[1] || "",
            };
          })
        : [];

      const requestBody = {
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        jobDescription: data.jobDescription,
        companyInfo: data.companyInfo,
        hiringManagerName: data.hiringManagerName,
        resumeData: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          city: data.city,
          country: data.country,
          linkedin: data.linkedin,
          jobTitle: data.currentJobTitle,
          summary: data.summary,
          workExperiences,
          skills,
          educations,
        },
        tone: data.tone,
        length: data.length,
        industry: data.industry,
        customInstructions: data.customInstructions,
      };

      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate cover letter");
      }

      const resultData = await response.json();
      setResult(resultData);
      setGenerationProgress(100);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (result?.coverLetter) {
      try {
        await navigator.clipboard.writeText(result.coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setError("Failed to copy to clipboard");
      }
    }
  }, [result]);

  // Download as text file
  const handleDownload = useCallback(
    (format: "txt" | "docx") => {
      if (!result?.coverLetter) return;

      const content = result.coverLetter;
      const blob = new Blob([content], {
        type:
          format === "txt"
            ? "text/plain"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cover-letter-${watch("companyName")?.replace(/\s+/g, "-").toLowerCase() || "generated"}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [result, watch],
  );

  // Reset form
  const handleReset = () => {
    setResult(null);
    setError(null);
    setGenerationProgress(0);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              AI Cover Letter Generator
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Create personalized, ATS-optimized cover letters that highlight
              your unique qualifications and get you noticed by hiring managers.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Job Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Job Details
                    </CardTitle>
                    <CardDescription>
                      Enter the position you're applying for
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">
                          Job Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="jobTitle"
                          placeholder="e.g., Senior Software Engineer"
                          {...register("jobTitle")}
                          className={errors.jobTitle ? "border-red-500" : ""}
                        />
                        {errors.jobTitle && (
                          <p className="text-sm text-red-500">
                            {errors.jobTitle.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">
                          Company Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="companyName"
                          placeholder="e.g., Google"
                          {...register("companyName")}
                          className={errors.companyName ? "border-red-500" : ""}
                        />
                        {errors.companyName && (
                          <p className="text-sm text-red-500">
                            {errors.companyName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="jobDescription">
                          Job Description{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <span className="text-xs text-gray-500">
                          {jobDescription.length}/10,000
                        </span>
                      </div>
                      <Textarea
                        id="jobDescription"
                        placeholder="Paste the full job description here..."
                        className={`min-h-[200px] ${errors.jobDescription ? "border-red-500" : ""}`}
                        {...register("jobDescription")}
                      />
                      {errors.jobDescription && (
                        <p className="text-sm text-red-500">
                          {errors.jobDescription.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hiringManagerName">
                        Hiring Manager Name{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        id="hiringManagerName"
                        placeholder="e.g., John Smith"
                        {...register("hiringManagerName")}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Company Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Company Research
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Adding company details helps personalize your cover
                            letter and shows genuine interest.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>
                      Optional but recommended for personalization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="companyInfo">
                        About the Company{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Textarea
                        id="companyInfo"
                        placeholder="Company mission, recent news, products, culture..."
                        className="min-h-[100px]"
                        {...register("companyInfo")}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Your Profile Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Your Profile
                    </CardTitle>
                    <CardDescription>
                      Import from a saved resume or enter details manually
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Resume Import */}
                    <ResumeSelector onSelect={handleResumeImport} />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or enter manually
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          {...register("firstName")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          {...register("lastName")}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register("email")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          {...register("phone")}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="San Francisco"
                          {...register("city")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="USA"
                          {...register("country")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentJobTitle">Current Job Title</Label>
                      <Input
                        id="currentJobTitle"
                        placeholder="e.g., Software Engineer"
                        {...register("currentJobTitle")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        placeholder="Brief overview of your background and career goals..."
                        className="min-h-[100px]"
                        {...register("summary")}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="workExperience">Work Experience</Label>
                        <span className="text-xs text-gray-500">
                          {workExperience.length}/5,000
                        </span>
                      </div>
                      <Textarea
                        id="workExperience"
                        placeholder={`Position Title\nCompany Name\nKey achievements and responsibilities...\n\nAnother Position\nAnother Company\nMore details...`}
                        className="min-h-[150px]"
                        {...register("workExperience")}
                      />
                      <p className="text-xs text-gray-500">
                        Separate each position with a blank line
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        placeholder="React, TypeScript, Node.js, AWS..."
                        {...register("skills")}
                      />
                      <p className="text-xs text-gray-500">
                        Comma-separated list of relevant skills
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Textarea
                        id="education"
                        placeholder={`Degree Name\nUniversity Name\n\nAnother Degree\nAnother School`}
                        className="min-h-[100px]"
                        {...register("education")}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Options */}
                <Card>
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Customization Options
                      </div>
                      {showAdvanced ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      Fine-tune your cover letter style
                    </CardDescription>
                  </CardHeader>
                  {showAdvanced && (
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Tone</Label>
                          <Select
                            defaultValue="professional"
                            onValueChange={(value: CoverLetterTone) =>
                              setValue("tone", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                            <SelectContent>
                              {coverLetterTones.map((tone) => (
                                <SelectItem key={tone} value={tone}>
                                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Length</Label>
                          <Select
                            defaultValue="standard"
                            onValueChange={(value: CoverLetterLength) =>
                              setValue("length", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select length" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="concise">
                                Concise (~200 words)
                              </SelectItem>
                              <SelectItem value="standard">
                                Standard (~350 words)
                              </SelectItem>
                              <SelectItem value="detailed">
                                Detailed (~500 words)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Industry</Label>
                          <Select
                            defaultValue="general"
                            onValueChange={(value: IndustryTemplate) =>
                              setValue("industry", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industryTemplates.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry.charAt(0).toUpperCase() +
                                    industry.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customInstructions">
                          Custom Instructions
                        </Label>
                        <Textarea
                          id="customInstructions"
                          placeholder="Any specific points you want to emphasize or include..."
                          className="min-h-[80px]"
                          {...register("customInstructions")}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-6 text-lg"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Your Cover Letter...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Output Section */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <Card className="min-h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Generated Cover Letter</span>
                    {result && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReset}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          New
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  {result && (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {result.metadata.wordCount} words
                      </Badge>
                      <Badge variant="outline">{result.metadata.tone}</Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Generation Progress */}
                  {isGenerating && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            Crafting your cover letter...
                          </p>
                          <p className="text-sm text-gray-500">
                            This usually takes 5-10 seconds
                          </p>
                        </div>
                      </div>
                      <Progress value={generationProgress} className="w-full" />
                    </div>
                  )}

                  {/* No Result State */}
                  {!isGenerating && !result && (
                    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                      <FileText className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-700" />
                      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                        Your cover letter will appear here
                      </h3>
                      <p className="max-w-sm text-gray-500">
                        Fill in the form on the left and click "Generate" to
                        create your personalized cover letter.
                      </p>
                    </div>
                  )}

                  {/* Result Display */}
                  {result && (
                    <div className="space-y-4">
                      <Tabs defaultValue="preview" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                          <TabsTrigger value="plain">Plain Text</TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview" className="mt-4">
                          <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              {result.coverLetter
                                .split("\n")
                                .map((paragraph, i) => (
                                  <p key={i} className="mb-4">
                                    {paragraph}
                                  </p>
                                ))}
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="plain" className="mt-4">
                          <Textarea
                            value={result.coverLetter}
                            readOnly
                            className="min-h-[400px] font-mono text-sm"
                          />
                        </TabsContent>
                      </Tabs>

                      {/* Highlighted Skills */}
                      {result.metadata.keySkillsHighlighted.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Key Skills Highlighted:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {result.metadata.keySkillsHighlighted.map(
                              (skill, i) => (
                                <Badge key={i} variant="secondary">
                                  {skill}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 border-t pt-4">
                        <Button onClick={handleCopy} variant="outline">
                          {copied ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy to Clipboard
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleDownload("txt")}
                          variant="outline"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download TXT
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Paste the full job description</strong> - The more
                    details, the better we can match your qualifications.
                  </p>
                  <p>
                    <strong>Include company research</strong> - Shows genuine
                    interest and helps personalize your letter.
                  </p>
                  <p>
                    <strong>Review and customize</strong> - AI provides a strong
                    foundation, but add your personal touch.
                  </p>
                  <p>
                    <strong>Keep it focused</strong> - Highlight 2-3 key
                    achievements that match the role.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
