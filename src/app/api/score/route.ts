import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("[Gemini API] POST /api/score called");
  try {
    const formData = await request.formData();
    console.log("[Gemini API] FormData received");

    const content = formData.get("content");
    const filename = formData.get("filename") || "Unknown";

    if (!content || typeof content !== "string") {
      console.error("[Gemini API] No resume content provided");
      return NextResponse.json(
        { error: "No resume content provided" },
        { status: 400 },
      );
    }

    // Trim content to remove unnecessary whitespace
    const resumeContent = content.trim();

    if (resumeContent.length < 100) {
      return NextResponse.json(
        { error: "Resume content is too short for analysis" },
        { status: 400 },
      );
    }

    console.log(`[Gemini API] Processing resume "${filename}"`);

    // Create optimized prompt
    const prompt = createOptimizedPrompt(resumeContent);

    // Call Gemini API with the prompt
    const analysis = await analyzeWithGemini(prompt);
    console.log("[Gemini API] Analysis received");

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[Gemini API] Error during analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}

function createOptimizedPrompt(resumeContent: string): string {
  return `
  You are an expert resume evaluator. Analyze this resume and provide ONLY a JSON response with the following structure:
  
  {
    "score": number (0-10 with decimal precision),
    "suggestions": [array of 3-4 brief improvement suggestions, each 5-7 words maximum]
  }
  
  Evaluation criteria:
  - ATS Compatibility (20%): format, keywords, parsing, contact info
  - Content Quality (30%): achievements, metrics, action verbs, specificity
  - Structure & Readability (15%): layout, organization, length
  - Career Progression (20%): career narrative, relevance, gaps
  - Education & Credentials (10%): format, certifications, development
  - Skills & Technical Proficiencies (5%): relevance, organization
  
  For scoring - a good resume should score 6.0-8.0, exceptional 8.0-9.5, poor 3.0-5 .
  
  Resume content:
  ${resumeContent}`;
}

// Simplified mock function for Gemini API analysis with revised scoring logic
async function analyzeWithGemini(
  prompt: string,
): Promise<{ score: number; suggestions: string[] }> {
  try {
    // Extract resume content from the prompt
    const resumeContent = prompt.split("Resume content:")[1]?.trim() || "";
    const wordCount = resumeContent.split(/\s+/).length;

    // Detect key features in the resume
    const hasMetrics = /increased|improved|achieved|reduced|saved|[\d]+%/i.test(
      resumeContent,
    );
    const hasSkills = /skills|proficient|experienced|knowledge|expertise/i.test(
      resumeContent,
    );
    const hasFormattedSections = /experience|education|skills|projects/i.test(
      resumeContent,
    );

    // Revised scoring logic:
    // Start with a base score of 5.0.
    // Add 0.5 for each feature present; subtract 0.5 if missing.
    // Add a small bonus for sufficient length.
    let baseScore = 5.0;
    baseScore += hasMetrics ? 0.5 : -0.5;
    baseScore += hasSkills ? 0.5 : -0.5;
    baseScore += hasFormattedSections ? 0.5 : -0.5;
    baseScore += Math.min(0.8, wordCount / 600);

    // Clamp the score between 3.0 and 9.0
    const score = Math.min(9.0, Math.max(3.0, baseScore));

    // Simplified suggestion generation - select relevant suggestions
    const suggestionPool = [
      "Add quantifiable achievements and metrics",
      "Use strong action verbs",
      "Highlight relevant technical skills",
      "Improve section formatting and organization",
      "Include more industry keywords",
      "Make bullets more concise",
      "Add relevant certifications",
      "Enhance education section details",
      "Clarify career progression",
      "Remove irrelevant experience",
    ];

    // Select 3-4 random suggestions
    const numberOfSuggestions = Math.floor(Math.random() * 2) + 3; // 3 or 4
    const shuffled = [...suggestionPool].sort(() => 0.5 - Math.random());
    const suggestions = shuffled.slice(0, numberOfSuggestions);

    return {
      score: parseFloat(score.toFixed(1)),
      suggestions,
    };
  } catch (error) {
    console.error("[Gemini API] Error in analysis:", error);

    // Basic fallback
    return {
      score: 6.5,
      suggestions: [
        "Add more quantifiable achievements",
        "Enhance industry-specific keywords",
        "Improve formatting consistency",
      ],
    };
  }
}
