import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";
import {
  coverLetterGenerationSchema,
  CoverLetterGenerationInput,
  CoverLetterOutput,
} from "@/lib/cover-letter-validation";
import { getUserSubscriptionLevel } from "@/lib/subscription";

// Initialize AI model
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

// In-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_FREE = 3;
const RATE_LIMIT_MAX_PRO = 10;
const RATE_LIMIT_MAX_PRO_PLUS = 50;

function checkRateLimit(
  userId: string,
  subscriptionLevel: string,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  let maxRequests = RATE_LIMIT_MAX_FREE;
  if (subscriptionLevel === "pro") maxRequests = RATE_LIMIT_MAX_PRO;
  if (subscriptionLevel === "pro_plus") maxRequests = RATE_LIMIT_MAX_PRO_PLUS;

  if (!userLimit || now - userLimit.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (userLimit.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  userLimit.count++;
  return { allowed: true, remaining: maxRequests - userLimit.count };
}

// Security: Sanitize output to prevent any accidental data leakage
function sanitizeOutput(output: string): string {
  // Remove any potential script tags or dangerous content
  return output
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");
}

// Build the AI prompt
function buildPrompt(input: CoverLetterGenerationInput): string {
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

  // Word count targets
  const wordCountTargets = {
    concise: 200,
    standard: 350,
    detailed: 500,
  };

  const targetWordCount = wordCountTargets[length];

  // Build resume context
  const workExperienceContext =
    resumeData.workExperiences
      ?.map(
        (exp) =>
          `- ${exp.position || "Position"} at ${exp.company || "Company"}: ${exp.description || ""}`,
      )
      .join("\n") || "No work experience provided";

  const skillsContext = resumeData.skills?.join(", ") || "No skills provided";

  const educationContext =
    resumeData.educations
      ?.map(
        (edu) => `- ${edu.degree || "Degree"} from ${edu.school || "School"}`,
      )
      .join("\n") || "No education provided";

  const projectsContext =
    resumeData.projects
      ?.map(
        (proj) =>
          `- ${proj.ProjectName || "Project"}: ${proj.description || ""} (Tools: ${proj.toolsUsed || ""})`,
      )
      .join("\n") || "";

  const certificationsContext =
    resumeData.certifications
      ?.map(
        (cert) =>
          `- ${cert.certificationName || "Certification"} by ${cert.awardedBy || ""}`,
      )
      .join("\n") || "";

  // Industry-specific guidelines
  const industryGuidelines: Record<string, string> = {
    technology:
      "Emphasize technical skills, problem-solving abilities, and innovation. Use industry terminology appropriately.",
    finance:
      "Highlight analytical skills, attention to detail, and quantifiable achievements. Maintain a formal tone.",
    healthcare:
      "Focus on patient care, empathy, compliance, and certifications. Show dedication to healthcare mission.",
    marketing:
      "Showcase creativity, campaign results, and understanding of brand strategy. Be engaging and results-driven.",
    education:
      "Emphasize teaching philosophy, student outcomes, and continuous learning. Show passion for education.",
    consulting:
      "Highlight problem-solving, client relationships, and business impact. Be strategic and results-oriented.",
    creative:
      "Show creativity, portfolio highlights, and unique perspective. Be original while remaining professional.",
    general:
      "Balance professionalism with personality. Focus on transferable skills and achievements.",
  };

  // Tone guidelines
  const toneGuidelines: Record<string, string> = {
    professional: "Maintain a polished, business-appropriate tone throughout.",
    enthusiastic:
      "Show genuine excitement and passion while remaining professional.",
    conversational: "Use a warm, approachable tone while staying professional.",
    formal:
      "Use formal language and structure, avoiding contractions and casual expressions.",
    confident:
      "Project confidence and assertiveness while remaining humble about achievements.",
  };

  const prompt = `You are an expert career coach and professional cover letter writer with 15+ years of experience helping candidates land interviews at top companies.

TASK: Generate a highly personalized, ATS-optimized cover letter.

TARGET POSITION:
- Job Title: ${jobTitle}
- Company: ${companyName}
- Hiring Manager: ${hiringManagerName || "Hiring Manager"}

JOB DESCRIPTION:
${jobDescription}

${companyInfo ? `COMPANY INFORMATION:\n${companyInfo}` : ""}

CANDIDATE PROFILE:
Name: ${resumeData.firstName || ""} ${resumeData.lastName || ""}
Current/Target Title: ${resumeData.jobTitle || ""}
Location: ${resumeData.city || ""}, ${resumeData.country || ""}
Contact: ${resumeData.email || ""} | ${resumeData.phone || ""}
${resumeData.linkedin ? `LinkedIn: ${resumeData.linkedin}` : ""}

PROFESSIONAL SUMMARY:
${resumeData.summary || "Not provided"}

WORK EXPERIENCE:
${workExperienceContext}

SKILLS:
${skillsContext}

EDUCATION:
${educationContext}

${projectsContext ? `RELEVANT PROJECTS:\n${projectsContext}` : ""}

${certificationsContext ? `CERTIFICATIONS:\n${certificationsContext}` : ""}

GENERATION REQUIREMENTS:
1. TONE: ${tone} - ${toneGuidelines[tone]}
2. LENGTH: Approximately ${targetWordCount} words
3. INDUSTRY: ${industry} - ${industryGuidelines[industry]}
${highlightSkills?.length ? `4. HIGHLIGHT THESE SKILLS: ${highlightSkills.join(", ")}` : ""}
${customInstructions ? `5. CUSTOM INSTRUCTIONS: ${customInstructions}` : ""}

ATS OPTIMIZATION RULES:
- Include relevant keywords from the job description naturally
- Use standard section headers
- Avoid tables, columns, or special formatting
- Match job requirements with candidate qualifications

QUALITY STANDARDS:
- NO clichés like "I am writing to apply" or "I believe I would be a great fit"
- START with a compelling hook that demonstrates company knowledge
- QUANTIFY achievements when possible
- SHOW specific examples of relevant experience
- END with a confident call to action
- Be specific, not generic

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "coverLetter": "The complete cover letter text with proper formatting using \\n for line breaks",
  "metadata": {
    "wordCount": <number>,
    "tone": "${tone}",
    "keySkillsHighlighted": ["skill1", "skill2", ...],
    "generatedAt": "${new Date().toISOString()}"
  }
}

Generate the cover letter now:`;

  return prompt;
}

export async function POST(request: Request) {
  try {
    // 1. Authentication Check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        { status: 401 },
      );
    }

    // 2. Get subscription level for rate limiting
    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    // 3. Rate Limiting
    const rateLimit = checkRateLimit(userId, subscriptionLevel);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Please wait a moment before trying again.",
          retryAfter: 60,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // 4. Parse and validate request body
    const body = await request.json();

    // 5. Input Validation with Zod (security layer)
    const validationResult = coverLetterGenerationSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return NextResponse.json(
        {
          error: "Validation failed",
          details: errors,
        },
        { status: 400 },
      );
    }

    const validatedInput = validationResult.data;

    // 6. Check minimum resume data requirements
    const hasBasicInfo =
      validatedInput.resumeData.firstName ||
      validatedInput.resumeData.lastName ||
      validatedInput.resumeData.jobTitle;

    if (!hasBasicInfo) {
      return NextResponse.json(
        {
          error:
            "Please provide at least your name or current job title for personalization.",
        },
        { status: 400 },
      );
    }

    // 7. Generate cover letter using AI
    const prompt = buildPrompt(validatedInput);

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    // 8. Parse and validate AI response
    let parsedResponse: CoverLetterOutput;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse AI response:", responseText);
      return NextResponse.json(
        { error: "Failed to generate cover letter. Please try again." },
        { status: 500 },
      );
    }

    // 9. Sanitize output
    parsedResponse.coverLetter = sanitizeOutput(parsedResponse.coverLetter);

    // 10. Return success response with security headers
    return NextResponse.json(parsedResponse, {
      status: 200,
      headers: {
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: unknown) {
    // Secure error handling - never expose internal errors
    console.error("Cover letter generation error:", error);

    // Generic error message to prevent information leakage
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
}

// GET method not allowed
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
