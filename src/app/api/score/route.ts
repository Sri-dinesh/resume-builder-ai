import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  SCORE_ACCEPTED_FILE_TYPES,
  SCORE_MAX_TEXT_LENGTH,
  SCORE_UPLOAD_MAX_BYTES,
  scoreRequestSchema,
} from "@/lib/score";
import { ResumeScorer } from "@/lib/resume-scorer";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

function badRequest(error: string) {
  return NextResponse.json(
    { error },
    {
      status: 400,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function isPdfUpload(file: File) {
  return (
    file.type in SCORE_ACCEPTED_FILE_TYPES ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

function normalizeResumeText(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/[\u2022\u25cf\u25aa\u25e6]/g, "\n\u2022 ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function extractResumeText(buffer: Buffer) {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return normalizeResumeText(result.text);
  } finally {
    await parser.destroy();
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const jobDescription = formData.get("jobDescription");

    const parsedRequest = scoreRequestSchema.safeParse({
      jobDescription:
        typeof jobDescription === "string" ? jobDescription : undefined,
    });

    if (!(file instanceof File)) {
      return badRequest("Please upload a resume in PDF format.");
    }

    if (!isPdfUpload(file)) {
      return badRequest("Only PDF resumes are supported.");
    }

    if (file.size === 0) {
      return badRequest("The uploaded PDF is empty.");
    }

    if (file.size > SCORE_UPLOAD_MAX_BYTES) {
      return badRequest("The uploaded PDF exceeds the 5MB limit.");
    }

    if (!parsedRequest.success) {
      return badRequest(
        parsedRequest.error.issues[0]?.message || "Invalid request.",
      );
    }

    let resumeContent = "";
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      resumeContent = await extractResumeText(buffer);
    } catch (error) {
      console.error("Failed to parse uploaded resume PDF", error);
      return badRequest(
        "We couldn't read that PDF. Please upload a valid, text-based PDF resume.",
      );
    }

    if (resumeContent.length < 50) {
      return badRequest("Resume content is too short for analysis.");
    }

    if (resumeContent.length > SCORE_MAX_TEXT_LENGTH) {
      return badRequest(
        "Resume content is too long to analyze reliably. Please upload a shorter resume.",
      );
    }

    const analysis = new ResumeScorer(
      resumeContent,
      parsedRequest.data.jobDescription,
    ).analyze();

    return NextResponse.json(analysis, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
