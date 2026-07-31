import { describe, it, expect } from "vitest";
import {
  resumeSchema,
  generalInfoSchema,
  personalInfoSchema,
  workExperienceSchema,
  educationSchema,
  skillsSchema,
  summarySchema,
} from "../validation";

describe("generalInfoSchema", () => {
  it("accepts valid general info", () => {
    const result = generalInfoSchema.safeParse({
      title: "My Resume",
      description: "A test resume",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty fields", () => {
    const result = generalInfoSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("personalInfoSchema", () => {
  it("accepts valid personal info", () => {
    const result = personalInfoSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      jobTitle: "Engineer",
      city: "NYC",
      country: "US",
      email: "john@example.com",
      phone: "555-1234",
    });
    expect(result.success).toBe(true);
  });

  it("accepts partial personal info", () => {
    const result = personalInfoSchema.safeParse({
      firstName: "John",
    });
    expect(result.success).toBe(true);
  });
});

describe("workExperienceSchema", () => {
  it("accepts valid work experience", () => {
    const result = workExperienceSchema.safeParse({
      workExperiences: [
        {
          position: "Engineer",
          company: "Acme",
          startDate: "2020-01",
          endDate: "2023-06",
          description: "Built things",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty work experiences", () => {
    const result = workExperienceSchema.safeParse({
      workExperiences: [],
    });
    expect(result.success).toBe(true);
  });
});

describe("educationSchema", () => {
  it("accepts valid education", () => {
    const result = educationSchema.safeParse({
      educations: [
        {
          degree: "BS Computer Science",
          school: "MIT",
          startDate: "2014-09",
          endDate: "2018-06",
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe("skillsSchema", () => {
  it("accepts skills array", () => {
    const result = skillsSchema.safeParse({
      skills: ["JavaScript", "TypeScript", "React"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty skills", () => {
    const result = skillsSchema.safeParse({
      skills: [],
    });
    expect(result.success).toBe(true);
  });
});

describe("summarySchema", () => {
  it("accepts valid summary", () => {
    const result = summarySchema.safeParse({
      summary: "Experienced software engineer...",
    });
    expect(result.success).toBe(true);
  });
});

describe("resumeSchema (full)", () => {
  it("accepts a full valid resume", () => {
    const result = resumeSchema.safeParse({
      title: "My Resume",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      skills: ["JS"],
      workExperiences: [],
      educations: [],
      projects: [],
      certifications: [],
      fontFamily: "Arial",
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal resume", () => {
    const result = resumeSchema.safeParse({
      fontFamily: "Arial",
    });
    expect(result.success).toBe(true);
  });
});
