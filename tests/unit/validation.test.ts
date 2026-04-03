import { personalInfoSchema, resumeSchema } from "@/lib/validation";
import { buildEdgeCaseInputs, buildResumeFactory } from "../factories/resume.factory";

describe("validation schemas", () => {
  it("accepts a valid resume payload", () => {
    const parsed = resumeSchema.safeParse(buildResumeFactory());

    expect(parsed.success).toBe(true);
  });

  it("rejects non-image personal photo uploads", () => {
    const file = new File(["bad"], "malware.exe", {
      type: "application/octet-stream",
    });
    const parsed = personalInfoSchema.safeParse({ photo: file });

    expect(parsed.success).toBe(false);
  });

  it("rejects images above the 4mb limit", () => {
    const file = new File([new Uint8Array(1024 * 1024 * 5)], "large.png", {
      type: "image/png",
    });
    const parsed = personalInfoSchema.safeParse({ photo: file });

    expect(parsed.success).toBe(false);
  });

  it("preserves unicode and special characters for text fields", () => {
    const edge = buildEdgeCaseInputs();
    const parsed = resumeSchema.safeParse({
      ...buildResumeFactory(),
      firstName: edge.unicode,
      summary: edge.xss,
    });

    expect(parsed.success).toBe(true);
  });
});
