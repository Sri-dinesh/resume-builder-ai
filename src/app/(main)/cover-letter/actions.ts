"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";

export type CoverLetterResumeData = {
  id: string;
  title: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  linkedin: string | null;
  jobTitle: string | null;
  summary: string | null;
  skills: string[];
  workExperiences: Array<{
    position: string | null;
    company: string | null;
    startDate: string | undefined;
    endDate: string | undefined;
    description: string | null;
  }>;
  educations: Array<{
    degree: string | null;
    school: string | null;
    startDate: string | undefined;
    endDate: string | undefined;
  }>;
  projects: Array<{
    ProjectName: string | null;
    description: string | null;
    toolsUsed: string | null;
  }>;
  certifications: Array<{
    certificationName: string | null;
    awardedBy: string | null;
  }>;
  updatedAt: Date;
};

export async function getUserResumes(): Promise<CoverLetterResumeData[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const resumes = await prisma.resume.findMany({
    where: { userId },
    include: resumeDataInclude,
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return resumes.map((resume) => ({
    id: resume.id,
    title: resume.title,
    firstName: resume.firstName,
    lastName: resume.lastName,
    email: resume.email,
    phone: resume.phone,
    city: resume.city,
    country: resume.country,
    linkedin: resume.linkedin,
    jobTitle: resume.jobTitle,
    summary: resume.summary,
    skills: resume.skills,
    workExperiences: resume.workExperiences.map((exp) => ({
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate?.toISOString().slice(0, 7),
      endDate: exp.endDate?.toISOString().slice(0, 7),
      description: exp.description,
    })),
    educations: resume.educations.map((edu) => ({
      degree: edu.degree,
      school: edu.school,
      startDate: edu.startDate?.toISOString().slice(0, 7),
      endDate: edu.endDate?.toISOString().slice(0, 7),
    })),
    projects: resume.projects.map((proj) => ({
      ProjectName: proj.ProjectName,
      description: proj.description,
      toolsUsed: proj.toolsUsed,
    })),
    certifications: resume.certifications.map((cert) => ({
      certificationName: cert.certificationName,
      awardedBy: cert.awardedBy,
    })),
    updatedAt: resume.updatedAt,
  }));
}
