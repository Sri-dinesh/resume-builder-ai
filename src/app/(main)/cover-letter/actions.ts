"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";

/**
 * Server action to fetch user's resumes for cover letter generation
 * Security: Only returns resumes belonging to the authenticated user
 */
export async function getUserResumes() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const resumes = await prisma.resume.findMany({
      where: {
        userId,
      },
      include: resumeDataInclude,
      orderBy: {
        updatedAt: "desc",
      },
      take: 10, // Limit to prevent data overload
    });

    // Sanitize and return only necessary fields (prevent over-exposure)
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
  } catch (error) {
    console.error("Error fetching resumes:", error);
    throw new Error("Failed to fetch resumes");
  }
}

/**
 * Server action to validate user has access to premium features
 * Security: Prevents unauthorized access to premium cover letter features
 */
export async function validatePremiumAccess() {
  const { userId } = await auth();

  if (!userId) {
    return { hasAccess: false, subscriptionLevel: "free" };
  }

  try {
    const subscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
      return { hasAccess: true, subscriptionLevel: "free" };
    }

    return {
      hasAccess: true,
      subscriptionLevel: subscription.stripePriceId.includes("pro_plus")
        ? "pro_plus"
        : "pro",
    };
  } catch (error) {
    console.error("Error validating subscription:", error);
    return { hasAccess: true, subscriptionLevel: "free" };
  }
}

/**
 * Security audit logging for cover letter generation
 * Logs generation attempts without storing PII
 */
export async function logCoverLetterGeneration(metadata: {
  success: boolean;
  tone: string;
  length: string;
  industry: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  // Log to console (in production, send to secure logging service)
  console.log("[CoverLetter Audit]", {
    userId: userId.slice(0, 8) + "...", // Truncate for privacy
    timestamp: new Date().toISOString(),
    ...metadata,
  });
}

/**
 * Revalidate cover letter page cache
 */
export async function revalidateCoverLetterPage() {
  revalidatePath("/cover-letter");
}
