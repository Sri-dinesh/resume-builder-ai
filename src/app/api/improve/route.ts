import { NextResponse } from "next/server";
import { createAIChatSession } from "@/lib/google-ai-model";
import { auth } from "@clerk/nextjs/server";
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await request.json();

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (text.length > 20000) {
      return NextResponse.json(
        { error: "Resume content is too long to enhance reliably." },
        { status: 400 },
      );
    }

    const prompt = `Parse and enhance this resume content. Return a JSON object matching exactly this structure:
      {
        "title": "",
        "description": "",
        "firstName": "",
        "lastName": "",
        "jobTitle": "",
        "city": "",
        "country": "",
        "phone": "",
        "email": "",
        "linkedin": "",
        "website": "",
        "websiteName": "",
        "summary": "",
        "workExperiences": [
          {
            "position": "",
            "company": "",
            "startDate": "",
            "endDate": "",
            "description": "",
            "locationType": ""
          }
        ],
        "projects": [
          {
            "ProjectName": "",
            "toolsUsed": "",
            "startDate": "",
            "endDate": "",
            "description": "",
            "demoLink": ""
          }
        ],
        "educations": [
          {
            "degree": "",
            "school": "",
            "startDate": "",
            "endDate": ""
          }
        ],
        "skills": [],
        "certifications": [
          {
            "certificationName": "",
            "awardedBy": "",
            "awardedDate": ""
          }
        ]
      }
      Parse and enhance this resume: ${text}. Ensure all dates are in YYYY-MM format and all fields exactly match the structure above.`;

    const result = await createAIChatSession().sendMessage(prompt);
    const enhancedText = result.response.text();
    const parsedResponse = JSON.parse(enhancedText);

    return NextResponse.json({ enhancedText: parsedResponse });
  } catch (error: unknown) {
    console.error("Error enhancing resume:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to enhance resume",
      },
      { status: 500 },
    );
  }
}
