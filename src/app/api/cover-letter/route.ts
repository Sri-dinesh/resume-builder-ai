import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";
import {
  coverLetterGenerationSchema,
  coverLetterOutputSchema,
  type CoverLetterGenerationInput,
} from "@/lib/cover-letter-validation";
import { getUserSubscriptionLevel } from "@/lib/subscription";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 4096,
  responseMimeType: "application/json",
};

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_FREE = 3;
const RATE_LIMIT_MAX_PRO = 10;
const RATE_LIMIT_MAX_PRO_PLUS = 50;

function jsonResponse(body: unknown, status = 200, extraHeaders?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      ...extraHeaders,
    },
  });
}

function getMaxRequests(subscriptionLevel: string) {
  if (subscriptionLevel === "pro_plus") {
    return RATE_LIMIT_MAX_PRO_PLUS;
  }
  if (subscriptionLevel === "pro") {
    return RATE_LIMIT_MAX_PRO;
  }
  return RATE_LIMIT_MAX_FREE;
}

function checkRateLimit(userId: string, subscriptionLevel: string) {
  const now = Date.now();
  const maxRequests = getMaxRequests(subscriptionLevel);

  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.windowStart > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(key);
    }
  }

  const userLimit = rateLimitMap.get(userId);
  if (!userLimit) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (now - userLimit.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (userLimit.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  userLimit.count += 1;
  return { allowed: true, remaining: maxRequests - userLimit.count };
}

function sanitizeOutput(output: string) {
  return output
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");
}

function extractJson(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  throw new Error("Model response was not valid JSON.");
}

function buildPrompt(input: CoverLetterGenerationInput) {
  const {
    jobTitle,
    companyName,
    jobDescription,
    companyInfo,
    hiringManagerName,
    resumeData,
    tone,
    length,
    industry,
    highlightSkills,
    customInstructions,
  } = input;

  const wordCountTargets = {
    concise: 200,
    standard: 350,
    detailed: 500,
  };

  const industryGuidelines: Record<string, string> = {
    technology:
      "Emphasize technical depth, problem-solving, execution, and product impact.",
    finance:
      "Highlight analytical rigor, attention to detail, and quantified outcomes.",
    healthcare:
      "Focus on patient care, compliance, empathy, and relevant certifications.",
    marketing:
      "Show campaign thinking, messaging, brand understanding, and measurable performance.",
    education:
      "Emphasize teaching impact, learning outcomes, and commitment to student success.",
    consulting:
      "Highlight structured problem-solving, client impact, and strategic thinking.",
    creative:
      "Show originality and craft while keeping the letter disciplined and specific.",
    general:
      "Balance professionalism, specificity, and role alignment without sounding generic.",
  };

  const toneGuidelines: Record<string, string> = {
    professional: "Maintain a polished, direct, business-appropriate tone.",
    enthusiastic: "Show real energy and interest while staying credible.",
    conversational: "Use a warm, clear tone without becoming casual.",
    formal: "Use formal language and tighter structure.",
    confident: "Project confidence through evidence, not exaggeration.",
  };

  const workExperienceContext =
    resumeData.workExperiences
      ?.map(
        (exp) =>
          `- ${exp.position || "Position"} at ${exp.company || "Company"}: ${exp.description || ""}`,
      )
      .join("\n") || "No work experience provided";

  const educationContext =
    resumeData.educations
      ?.map(
        (edu) => `- ${edu.degree || "Degree"} from ${edu.school || "School"}`,
      )
      .join("\n") || "No education provided";

  const projectContext =
    resumeData.projects
      ?.map(
        (project) =>
          `- ${project.ProjectName || "Project"}: ${project.description || ""} (Tools: ${project.toolsUsed || ""})`,
      )
      .join("\n") || "";

  const certificationContext =
    resumeData.certifications
      ?.map(
        (cert) =>
          `- ${cert.certificationName || "Certification"} by ${cert.awardedBy || ""}`,
      )
      .join("\n") || "";

  return `You are an expert career coach and cover letter writer.

Write a personalized, ATS-aware cover letter for this role.

TARGET ROLE
- Job Title: ${jobTitle}
- Company: ${companyName}
- Hiring Manager: ${hiringManagerName || "Hiring Manager"}

JOB DESCRIPTION
${jobDescription}

${companyInfo ? `COMPANY CONTEXT\n${companyInfo}\n` : ""}CANDIDATE
- Name: ${resumeData.firstName || ""} ${resumeData.lastName || ""}
- Current Title: ${resumeData.jobTitle || ""}
- Location: ${resumeData.city || ""}, ${resumeData.country || ""}
- Contact: ${resumeData.email || ""} ${resumeData.phone || ""}
${resumeData.linkedin ? `- LinkedIn: ${resumeData.linkedin}` : ""}

SUMMARY
${resumeData.summary || "Not provided"}

WORK EXPERIENCE
${workExperienceContext}

SKILLS
${resumeData.skills?.join(", ") || "No skills provided"}

EDUCATION
${educationContext}

${projectContext ? `PROJECTS\n${projectContext}\n` : ""}${certificationContext ? `CERTIFICATIONS\n${certificationContext}\n` : ""}REQUIREMENTS
- Tone: ${tone} (${toneGuidelines[tone]})
- Length: approximately ${wordCountTargets[length]} words
- Industry lens: ${industry} (${industryGuidelines[industry]})
${highlightSkills?.length ? `- Highlight these skills: ${highlightSkills.join(", ")}` : ""}${customInstructions ? `\n- Custom instructions: ${customInstructions}` : ""}

QUALITY RULES
- Do not use clichés like "I am writing to apply".
- Open with a role-specific hook.
- Match the candidate's experience to the job requirements with concrete examples.
- Keep it skimmable and natural.
- End with a confident, professional close.

Return valid JSON only in this exact shape:
{
  "coverLetter": "Full cover letter with \\n for paragraph breaks",
  "metadata": {
    "wordCount": 0,
    "tone": "${tone}",
    "keySkillsHighlighted": ["skill1"],
    "generatedAt": "${new Date().toISOString()}"
  }
}`;
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return jsonResponse(
      { error: "Unauthorized. Please sign in to continue." },
      401,
    );
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);
  const rateLimit = checkRateLimit(userId, subscriptionLevel);

  if (!rateLimit.allowed) {
    return jsonResponse(
      {
        error: "Rate limit exceeded. Please wait a moment before trying again.",
        retryAfter: 60,
      },
      429,
      {
        "Retry-After": "60",
        "X-RateLimit-Remaining": "0",
      },
    );
  }

  try {
    const body = await request.json();
    const validationResult = coverLetterGenerationSchema.safeParse(body);

    if (!validationResult.success) {
      return jsonResponse(
        {
          error: "Validation failed",
          details: validationResult.error.errors.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        400,
        {
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      );
    }

    const validatedInput = validationResult.data;
    const hasBasicInfo =
      validatedInput.resumeData.firstName ||
      validatedInput.resumeData.lastName ||
      validatedInput.resumeData.jobTitle;

    if (!hasBasicInfo) {
      return jsonResponse(
        {
          error:
            "Please provide at least your name or current job title for personalization.",
        },
        400,
        {
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      );
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(buildPrompt(validatedInput));
    const parsedModelOutput = JSON.parse(extractJson(result.response.text()));
    const outputValidation =
      coverLetterOutputSchema.safeParse(parsedModelOutput);

    if (!outputValidation.success) {
      return jsonResponse(
        { error: "Failed to generate cover letter. Please try again." },
        502,
        {
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      );
    }

    const sanitizedOutput = {
      ...outputValidation.data,
      coverLetter: sanitizeOutput(outputValidation.data.coverLetter),
      metadata: {
        ...outputValidation.data.metadata,
        generatedAt: new Date().toISOString(),
      },
    };

    return jsonResponse(sanitizedOutput, 200, {
      "X-RateLimit-Remaining": rateLimit.remaining.toString(),
    });
  } catch {
    return jsonResponse(
      { error: "An unexpected error occurred. Please try again later." },
      500,
      {
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      },
    );
  }
}

export async function GET() {
  return jsonResponse({ error: "Method not allowed" }, 405);
}
