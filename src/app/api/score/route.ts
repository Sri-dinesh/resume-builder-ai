import { NextResponse } from "next/server";
import { ResumeScorer } from "@/lib/resume-scorer";

export async function POST(request: Request) {
  console.log("[Manual Scorer] POST /api/score called");
  try {
    const formData = await request.formData();
    const content = formData.get("content");
    const jobDescription = formData.get("jobDescription") as string | undefined;
    const filename = formData.get("filename") || "Unknown";

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "No resume content provided" },
        { status: 400 }
      );
    }

    const resumeContent = content.trim();
    if (resumeContent.length < 50) {
      return NextResponse.json(
        { error: "Resume content is too short for analysis" },
        { status: 400 }
      );
    }

    console.log(`[Manual Scorer] Processing resume "${filename}"`);

    const scorer = new ResumeScorer(resumeContent, jobDescription);
    const analysis = scorer.analyze();

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[Manual Scorer] Error during analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
