import { NextResponse } from "next/server";
import { AIChatSession } from "@/lib/google-ai-model";
export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
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

    const result = await AIChatSession.sendMessage(prompt);
    const enhancedText = result.response.text();
    const parsedResponse = JSON.parse(enhancedText);

    return NextResponse.json({ enhancedText: parsedResponse });
  } catch (error: any) {
    console.error("Error enhancing resume:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance resume" },
      { status: 500 },
    );
  }
}
