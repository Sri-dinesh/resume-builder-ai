import { z } from "zod";

// Sanitize input to prevent XSS attacks
const sanitizeString = (str: string): string => {
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Custom string transformer for security
const secureString = z
  .string()
  .trim()
  .transform((val) => sanitizeString(val));

const optionalSecureString = secureString.optional().or(z.literal(""));

// Cover Letter Tone Options
export const coverLetterTones = [
  "professional",
  "enthusiastic",
  "conversational",
  "formal",
  "confident",
] as const;

export type CoverLetterTone = (typeof coverLetterTones)[number];

// Cover Letter Length Options
export const coverLetterLengths = [
  "concise", // ~200 words
  "standard", // ~350 words
  "detailed", // ~500 words
] as const;

export type CoverLetterLength = (typeof coverLetterLengths)[number];

// Industry Templates
export const industryTemplates = [
  "technology",
  "finance",
  "healthcare",
  "marketing",
  "education",
  "consulting",
  "creative",
  "general",
] as const;

export type IndustryTemplate = (typeof industryTemplates)[number];

// Resume Data Schema (aligned with existing resume structure)
export const resumeDataSchema = z.object({
  firstName: optionalSecureString,
  lastName: optionalSecureString,
  email: z.string().email().optional().or(z.literal("")),
  phone: optionalSecureString,
  city: optionalSecureString,
  country: optionalSecureString,
  linkedin: z.string().url().optional().or(z.literal("")),
  jobTitle: optionalSecureString,
  summary: optionalSecureString,
  workExperiences: z
    .array(
      z.object({
        position: optionalSecureString,
        company: optionalSecureString,
        startDate: optionalSecureString,
        endDate: optionalSecureString,
        description: optionalSecureString,
      }),
    )
    .optional(),
  skills: z.array(z.string().trim()).optional(),
  educations: z
    .array(
      z.object({
        degree: optionalSecureString,
        school: optionalSecureString,
        startDate: optionalSecureString,
        endDate: optionalSecureString,
      }),
    )
    .optional(),
  projects: z
    .array(
      z.object({
        ProjectName: optionalSecureString,
        description: optionalSecureString,
        toolsUsed: optionalSecureString,
      }),
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        certificationName: optionalSecureString,
        awardedBy: optionalSecureString,
      }),
    )
    .optional(),
});

export type ResumeDataInput = z.infer<typeof resumeDataSchema>;

// Main Cover Letter Generation Schema
export const coverLetterGenerationSchema = z.object({
  // Job Details (Required)
  jobTitle: z
    .string()
    .trim()
    .min(2, "Job title must be at least 2 characters")
    .max(200, "Job title must be less than 200 characters")
    .transform(sanitizeString),

  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must be less than 200 characters")
    .transform(sanitizeString),

  jobDescription: z
    .string()
    .trim()
    .min(50, "Job description must be at least 50 characters")
    .max(10000, "Job description must be less than 10,000 characters")
    .transform(sanitizeString),

  // Company Information (Optional but recommended)
  companyInfo: optionalSecureString,
  hiringManagerName: optionalSecureString,

  // Resume Data
  resumeData: resumeDataSchema,

  // Customization Options
  tone: z.enum(coverLetterTones).default("professional"),
  length: z.enum(coverLetterLengths).default("standard"),
  industry: z.enum(industryTemplates).default("general"),

  // Additional Preferences
  highlightSkills: z.array(z.string().trim()).optional(),
  customInstructions: z
    .string()
    .trim()
    .max(1000, "Custom instructions must be less than 1,000 characters")
    .optional()
    .transform((val) => (val ? sanitizeString(val) : val)),
});

export type CoverLetterGenerationInput = z.infer<
  typeof coverLetterGenerationSchema
>;

// Output Schema for validation
export const coverLetterOutputSchema = z.object({
  coverLetter: z.string(),
  metadata: z.object({
    wordCount: z.number(),
    tone: z.enum(coverLetterTones),
    keySkillsHighlighted: z.array(z.string()),
    generatedAt: z.string(),
  }),
});

export type CoverLetterOutput = z.infer<typeof coverLetterOutputSchema>;

// Rate limiting schema
export const rateLimitSchema = z.object({
  userId: z.string(),
  requestCount: z.number(),
  windowStart: z.date(),
});
