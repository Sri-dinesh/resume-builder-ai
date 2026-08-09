import type { ResumeValues } from "./validation";
import type { Prisma } from "@prisma/client";

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

export const resumeDataInclude = {
  contactLinks: true,
  workExperiences: true,
  projects: true,
  educations: true,
  certifications: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;
