"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import {
  GenerateProjectExperienceInput,
  generateProjectExperienceSchema,
  Project,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  // model: "gemini-pro",
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  },
});

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { jobTitle, workExperiences, projects, educations, skills } =
    generateSummarySchema.parse(input);

  // Summary Prompt
  // const prompt = `
  //   Please generate a professional resume summary from this data:

  //   You are a professional resume writer and career strategist specializing in ${jobTitle}. Using the provided data, craft a concise and impactful professional resume summary tailored for the role of ${jobTitle}. Ensure the summary highlights key achievements, transferable skills, technical expertise, and leadership qualities. Focus on incorporating relevant keywords from the job description to make it ATS-friendly. Use power verbs, quantify impact with measurable results (e.g., numbers, percentages, or metrics), and emphasize soft skills, certifications, and problem-solving abilities where applicable. Keep the tone modern, professional, and results-oriented.

  //   Job title: ${jobTitle || "N/A"}

  //   Work experience:
  //   ${workExperiences
  //     ?.map(
  //       (exp) => `
  //       Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${
  //         exp.startDate || "N/A"
  //       } to ${exp.endDate || "Present"}

  //       Description:
  //       ${exp.description || "N/A"}
  //       `
  //     )
  //     .join("\n\n")}
  //   Projects:
  //   ${projects
  //     ?.map(
  //       (proj) => `
  //       Project: ${proj.ProjectName || "N/A"} using ${
  //         proj.toolsUsed || "N/A"
  //       } from ${proj.startDate || "N/A"} to ${proj.endDate || "Present"}

  //       Description:
  //       ${proj.description || "N/A"}
  //       `
  //     )
  //     .join("\n\n")}
  //   Education:
  //   ${educations
  //     ?.map(
  //       (edu) => `
  //       Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${
  //         edu.startDate || "N/A"
  //       } to ${edu.endDate || "N/A"}
  //       `
  //     )
  //     .join("\n\n")}

  //   Skills:
  //   ${skills}

  //   **Instructions:**
  //   1. Only return the professional summary—do not include any other sections or raw data in the response.
  //   2. Tailor the summary to align with the target role and industry, emphasizing adaptability, collaborative achievements, and strategic accomplishments.
  //   3. Ensure the summary is visually appealing, concise (no more than 4 sentences), and optimized for both human readers and applicant tracking systems (ATS).
  //   `;

  const prompt = `
  As an expert ATS resume specialist, generate a highly optimized professional summary based on this data:
  
  Role Information:
  Target Position: ${jobTitle || "N/A"}
  Industry Focus: ${jobTitle?.split(" ")[0] || "Professional"}
  
  Input Data:
  ${formatExperiences(workExperiences)}
  ${formatProjects(projects)}
  ${formatEducation(educations)}
  Core Skills: ${skills}
  
  Output Requirements:
  1. Length: 3-4 impactful sentences (50-75 words)
  2. Structure: [Professional Title] + [Years of Experience] + [Key Achievements] + [Core Skills] + [Career Goal]
  
  ATS Optimization Rules:
  1. Begin with current professional title aligned with target role
  2. Include total years of relevant experience
  3. Incorporate 4-6 core technical skills from the skills list
  4. Use industry-standard job titles and terminology
  5. Spell out acronyms on first use (e.g., "Artificial Intelligence (AI)")
  6. Include relevant certifications and education highlights
  7. Avoid special characters, graphics, or symbols
  8. Use standard numerical formats (e.g., "10" instead of "ten")
  
  Keyword Integration:
  1. Match keywords from typical ${jobTitle} job descriptions
  2. Include both hard skills and soft skills
  3. Incorporate relevant industry buzzwords naturally
  4. Use action verbs aligned with seniority level
  5. Mention specific technologies and methodologies
  
  Impact Focus:
  1. Quantify achievements (%, $, metrics)
  2. Highlight scope of responsibility
  3. Emphasize leadership and collaboration
  4. Showcase problem-solving abilities
  5. Demonstrate business value contribution
  
  Format Guidelines:
  1. Use clear, direct language
  2. Maintain professional tone
  3. Focus on recent achievements
  4. Include measurable impacts
  5. Ensure ATS readability with standard formatting
  
  Response Format:
  Return only the optimized professional summary paragraph without any additional sections or formatting.
  `;

  // Helper functions to format the input data
  function formatExperiences(experiences?: any[]) {
    return experiences?.length
      ? `Work Experience: ${
          experiences.length
        } positions spanning ${calculateTotalYears(experiences)} years`
      : "";
  }

  function formatProjects(projects?: any[]) {
    return projects?.length
      ? `Project Experience: ${projects.length} major projects`
      : "";
  }

  function formatEducation(education?: any[]) {
    return education?.length
      ? `Education: ${education.map((edu) => edu.degree).join(", ")}`
      : "";
  }

  function calculateTotalYears(experiences: any[]) {
    // Implementation for calculating total years of experience
    return experiences.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      return total + (end.getFullYear() - start.getFullYear());
    }, 0);
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Failed to generate AI response");
    }

    return text;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary");
  }
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  //   Work Experience Prompt
  const prompt = `
  As an expert ATS-optimization specialist, generate a compelling work experience entry based on this description: "${description}"

  Format requirements:
  Job Title: <exact job title matching industry standards>
  Company: <company name>
  Start Date: <YYYY-MM-DD format>
  End Date: <YYYY-MM-DD format or "Present">
  
  Description:
  [Generate 5 achievement-focused bullet points following this enhanced structure]
  • [Action Verb] [Quantifiable Achievement] by [Specific Method/Tool] resulting in [Measurable Business Impact]
  
  Writing Instructions:
  1. Use powerful action verbs at the start of each bullet (e.g., Spearheaded, Implemented, Developed, Orchestrated)
  2. Include industry-specific keywords and technical terms relevant to the role
  3. Quantify achievements with specific metrics (%, $, time saved, efficiency gained)
  4. Highlight tools, technologies, and methodologies used
  5. Demonstrate progression and leadership when applicable
  6. Keep each bullet point to 1-2 lines maximum for readability
  7. Focus on STAR method (Situation, Task, Action, Result)
  8. Include relevant technical skills and certifications mentioned in the description
  
  ATS Optimization Rules:
  1. Use standard job titles that ATS systems recognize
  2. Avoid graphics, special characters, or complex formatting
  3. Spell out acronyms at least once
  4. Include both hard and soft skills mentioned in the description
  5. Use industry-standard terminology
  6. Maintain consistent date formatting
  7. Incorporate relevant keywords naturally within context
  
  Critical Requirements:
  - Every bullet point must include at least one measurable outcome
  - Each achievement should demonstrate clear business value
  - Format must remain clean and parseable by ATS systems
  - Use standard bullet points (•) only
  - Keep technical terms consistent throughout
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    return {
      position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
      company: aiResponse.match(/Company: (.*)/)?.[1] || "",
      description: (
        aiResponse.match(/Description:([\s\S]*)/)?.[1] || ""
      ).trim(),
      startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
      endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    } satisfies WorkExperience;
  } catch (error) {
    console.error("Error generating work experience:", error);
    throw new Error("Failed to generate work experience");
  }
}

export async function generateProject(input: GenerateProjectExperienceInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { description } = generateProjectExperienceSchema.parse(input);

  // Project Prompt
  const prompt = `
As an expert ATS-optimization specialist, generate a highly effective project experience entry based on this description: "${description}"

Format Requirements:
Project Name: <industry-standard project name>
Role: <clear project role/title>
Duration: <MM/YYYY - MM/YYYY or "Present">
Technologies: <comma-separated list of tools, languages, frameworks>
Impact: <key business/technical impact in one line>

Description:
[Generate 4-5 achievement-focused bullet points using this structure]
• [Strong Action Verb] [Technical Implementation] to [Measurable Outcome]

Technical Writing Guidelines:
1. Begin each bullet with powerful technical action verbs (e.g., Architected, Engineered, Optimized)
2. Include specific technologies, frameworks, and methodologies
3. Quantify results (%, performance metrics, time/cost savings)
4. Highlight technical complexity and problem-solving
5. Demonstrate system design and scalability considerations

ATS Optimization Rules:
1. Use standardized technical terminology
2. Include both general (e.g., "software development") and specific (e.g., "React.js") technical terms
3. Spell out technical acronyms first time (e.g., "Continuous Integration/Continuous Deployment (CI/CD)")
4. Match keywords from common job descriptions in your field
5. Maintain consistent technical naming conventions
6. Use standard bullet points only (•)
7. Avoid special characters or symbols except commonly accepted technical ones

Required Elements Per Bullet:
- Technical implementation details
- Measurable impact or outcome
- Specific tools or technologies used
- Problem-solving approach
- Scale or scope indicators

Keywords Integration:
1. Include relevant technical stack keywords
2. Add methodology keywords (Agile, Scrum, etc.)
3. Incorporate industry-standard project management terms
4. Use relevant architectural pattern terminology
5. Include pertinent technical certification names

Format Rules:
1. Keep bullets single-line for ATS parsing
2. Use clear technical hierarchy in descriptions
3. Maintain consistent date formatting
4. Follow standard project naming conventions
5. Structure content for maximum ATS readability
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    return {
      ProjectName: aiResponse.match(/Project name: (.*)/)?.[1] || "",
      toolsUsed: aiResponse.match(/toolsUsed: (.*)/)?.[1] || "",
      startDate: aiResponse.match(/Duration: (.*)/)?.[1] || "",
      endDate: aiResponse.match(/Duration: (.*)/)?.[1] || "",
      description: (
        aiResponse.match(/Description:([\s\S]*)/)?.[1] || ""
      ).trim(),
    } satisfies Project;
  } catch (error) {
    console.error("Error generating project experience:", error);
    throw new Error("Failed to generate project experience");
  }
}
