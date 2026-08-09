import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ResumeServerData } from "./resume/types";
import type { ResumeValues } from "./resume/validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SanitizeEditorInputOptions {
  maxLength?: number;
  singleLine?: boolean;
}

export function sanitizeEditorInput(
  value: string,
  options: SanitizeEditorInputOptions = {},
) {
  const { maxLength, singleLine = true } = options;

  let sanitized = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/--+/g, "-")
    .replace(/\/\*/g, "/")
    .replace(/\*\//g, "/")
    .replace(/@@/g, "@")
    .replace(/\bxp_/gi, "xp");

  if (singleLine) {
    sanitized = sanitized.replace(/[\r\n]+/g, " ");
  }

  if (typeof maxLength === "number") {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value;
}

export function normalizeBullets(
  value: string | string[] | undefined | null,
): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  }
  if (typeof value === "string") {
    if (!value.trim()) return [];
    if (value.includes("<li")) {
      const matches = value.match(/<li[^>]*>(.*?)<\/li>/gi);
      if (matches && matches.length > 0) {
        return matches
          .map((m) => m.replace(/<\/?li[^>]*>/gi, "").trim())
          .filter(Boolean);
      }
    }
    return value
      .split(/\r?\n/)
      .map((s) => s.replace(/^[•\-\*\s]+/, "").trim())
      .filter(Boolean);
  }
  return [];
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    contactLinks: data.contactLinks.map((link) => ({
      url: link.url,
      linkName: link.linkName || undefined,
    })),
    workExperiences: data.workExperiences.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: normalizeBullets(exp.description),
      locationType: exp.locationType || undefined,
    })),
    projects: data.projects.map((proj) => ({
      ProjectName: proj.ProjectName || undefined,
      toolsUsed: proj.toolsUsed || undefined,
      startDate: proj.startDate?.toISOString().split("T")[0],
      endDate: proj.endDate?.toISOString().split("T")[0],
      description: normalizeBullets(proj.description),
      demoLink: proj.demoLink || undefined,
    })),
    certifications: data.certifications.map((cert) => ({
      certificationName: cert.certificationName || undefined,
      awardedBy: cert.awardedBy || undefined,
      awardedDate: cert.awardedDate?.toISOString().split("T")[0],
    })),
    educations: data.educations.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    fontFamily: data.fontFamily,
    summary: data.summary || undefined,
  };
}
