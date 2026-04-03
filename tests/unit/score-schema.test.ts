import {
  SCORE_MAX_JOB_DESCRIPTION_LENGTH,
  SCORE_UPLOAD_MAX_BYTES,
  scoreRequestSchema,
} from "@/lib/score";

describe("score schema", () => {
  it("accepts empty optional job description", () => {
    const parsed = scoreRequestSchema.safeParse({});

    expect(parsed.success).toBe(true);
  });

  it("accepts valid job description within max length", () => {
    const parsed = scoreRequestSchema.safeParse({
      jobDescription: "React Next.js TypeScript accessibility performance",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects overly long job description", () => {
    const parsed = scoreRequestSchema.safeParse({
      jobDescription: "a".repeat(SCORE_MAX_JOB_DESCRIPTION_LENGTH + 1),
    });

    expect(parsed.success).toBe(false);
  });

  it("exposes stable upload size contract", () => {
    expect(SCORE_UPLOAD_MAX_BYTES).toBe(5 * 1024 * 1024);
  });
});
