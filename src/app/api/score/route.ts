// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   console.log("[Gemini API] POST /api/score called.");
//   try {
//     const formData = await request.formData();
//     console.log("[Gemini API] FormData received.");

//     const content = formData.get("content");
//     const filename = formData.get("filename") || "Unknown";

//     if (!content || typeof content !== "string") {
//       console.error("[Gemini API] No resume content provided.");
//       return NextResponse.json(
//         { error: "No resume content provided." },
//         { status: 400 },
//       );
//     }

//     // Store the parsed resume content in a variable
//     const resumeContent: string = content;
//     console.log(
//       "[Gemini API] Stored resume content. Length:",
//       resumeContent.length,
//     );

//     // Construct a custom prompt for Gemini API
//     // You can adjust the prompt below to include any additional instructions as needed.
//     const prompt = `You are an expert resume evaluator.

//       ## Instructions
//       Analyze the provided resume thoroughly and score it on a scale of 0-10 with decimal precision (e.g., 7.8/10). Evaluate each component individually, then calculate the final weighted score.

//       Important Note: You are evaluating only the text content of the resume, not its visual formatting or design elements, as these won't be visible in the provided text. Focus your evaluation on the quality, organization, and substance of the content itself.

//       ## Evaluation Categories

//       ### 1. ATS Compatibility (20% of total score)
//       - **Format Assessment**: Check if the resume uses a clean, ATS-friendly format without tables, images, or complex formatting that could confuse ATS systems
//       - **Keyword Optimization**: Evaluate if the resume incorporates relevant industry and job-specific keywords naturally
//       - **Parsing Check**: Determine if section headers are clear and standard (e.g., "Experience," "Education," "Skills")
//       - **Contact Information**: Verify that contact details are complete and properly formatted

//       ### 2. Content Quality (30% of total score)
//       - **Achievement Focus**: Assess if achievements are quantified with metrics where possible (e.g., "Increased sales by 23%")
//       - **Action Verbs**: Check if bullet points begin with strong action verbs
//       - **Specificity**: Evaluate if descriptions are specific rather than vague
//       - **Relevance**: Determine if content aligns with target role/industry
//       - **Clarity & Conciseness**: Assess if content is clear, concise, and free of jargon or unnecessary information

//       ### 3. Visual Structure & Readability (15% of total score)
//       - **Layout**: Evaluate consistency in formatting, appropriate use of white space
//       - **Organization**: Assess logical flow and organization of information
//       - **Length Appropriateness**: Determine if resume length is appropriate for candidate's experience level

//       ### 4. Career Progression & Experience (20% of total score)
//       - **Career Narrative**: Evaluate if the resume tells a coherent career story
//       - **Experience Relevance**: Assess relevance of experience to target role
//       - **Progression**: Check for evidence of growth and advancement
//       - **Gaps**: Identify and evaluate any unexplained gaps in employment

//       ### 5. Education & Credentials (10% of total score)
//       - **Education Format**: Check if education is properly presented with degrees, institutions, and dates
//       - **Relevant Certifications**: Assess inclusion of pertinent certifications
//       - **Continuing Education**: Evaluate evidence of ongoing professional development

//       ### 6. Skills & Technical Proficiencies (5% of total score)
//       - **Skill Relevance**: Determine if listed skills match target role requirements
//       - **Technical Skills**: Assess appropriate inclusion of technical skills when applicable
//       - **Skill Organization**: Evaluate if skills are logically categorized

//       ## Scoring System

//       For each category, provide a score out of 10 with decimal precision:
//       - 9.0-10.0: Exceptional - Exceeds expectations in all aspects
//       - 8.0-8.9: Excellent - Meets all expectations with some exceptional elements
//       - 7.0-7.9: Very Good - Meets expectations with minor areas for improvement
//       - 6.0-6.9: Good - Meets most expectations with clear areas for improvement
//       - 5.0-5.9: Average - Meets basic expectations but needs significant improvement
//       - 4.0-4.9: Below Average - Falls short in multiple important areas
//       - 0.0-3.9: Poor - Requires complete revision

//       ## Final Evaluation

//       Based on the following resume content, please provide a numerical score (out of 10, allowing decimals) and 3-4 actionable suggestions for improvement. Do not include extra commentary.

//       Resume Content: \${resumeContent}`;

//     console.log(
//       "[Gemini API] Created prompt for analysis. Prompt length:",
//       prompt.length,
//     );

//     // Call Google Gemini API simulation (replace this with the actual API call in production)
//     const analysis = await analyzeWithGemini(prompt);
//     console.log("[Gemini API] Analysis received:", analysis);

//     // Return the analysis result
//     return NextResponse.json(analysis);
//   } catch (error) {
//     console.error("[Gemini API] Error during analysis:", error);
//     return NextResponse.json(
//       { error: "An error occurred while analyzing the resume." },
//       { status: 500 },
//     );
//   }
// }

// // Simulated Google Gemini API call
// async function analyzeWithGemini(
//   prompt: string,
// ): Promise<{ score: number; suggestions: string[] }> {
//   // In an actual implementation, use the prompt to call the Gemini API with proper authentication.
//   // This simulation assigns a score based on the prompt length, and static suggestions.
//   const score = Math.min(10, prompt.length / 1000);
//   const suggestions = [
//     "Improve the clarity of your introduction.",
//     "Include more details about your previous experience.",
//     "Add measurable achievements to your resume.",
//     "Consider highlighting your technical skills.",
//   ];
//   return { score: parseFloat(score.toFixed(1)), suggestions };
// }

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
