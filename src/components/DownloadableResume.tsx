import React from "react";
import { ResumeValues } from "@/lib/validation";

interface DownloadableResumeProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
}

export default function DownloadableResume({
  resumeData,
  contentRef,
}: DownloadableResumeProps) {
  const formatDate = (startDate?: string, endDate?: string) => {
    if (!startDate) return "Present";
    const end = endDate || "Present";
    return `${startDate} - ${end}`;
  };

  return (
    <div
      ref={contentRef}
      className="mx-auto bg-white text-black"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm 20mm",
        boxSizing: "border-box",
        fontSize: "10.5pt",
        lineHeight: "1.5",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      <div className="mb-6 space-y-2 border-b-2 border-gray-800 pb-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {resumeData.firstName} {resumeData.lastName}
        </h1>
        <p className="text-lg font-medium text-gray-700">
          {resumeData.jobTitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          {(resumeData.city || resumeData.country) && (
            <span>
              {[resumeData.city, resumeData.country].filter(Boolean).join(", ")}
            </span>
          )}
          {resumeData.phone && <span>{resumeData.phone}</span>}
          {resumeData.email && (
            <a
              href={`mailto:${resumeData.email}`}
              className="hover:text-blue-600"
            >
              {resumeData.email}
            </a>
          )}
        </div>
        {(resumeData.linkedin || resumeData.website) && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
            {resumeData.linkedin && (
              <span>
                LinkedIn:{" "}
                <a href={resumeData.linkedin} className="hover:text-blue-600">
                  {resumeData.linkedin.replace(/^https?:\/\//, "")}
                </a>
              </span>
            )}
            {resumeData.website && (
              <span>
                {resumeData.websiteName || "Website"}:{" "}
                <a href={resumeData.website} className="hover:text-blue-600">
                  {resumeData.website.replace(/^https?:\/\//, "")}
                </a>
              </span>
            )}
          </div>
        )}
      </div>

      {resumeData.summary && (
        <section className="mb-5">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide text-gray-800">
            Professional Summary
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
            {resumeData.summary}
          </p>
        </section>
      )}

      {!!resumeData.workExperiences?.length && (
        <section className="mb-5">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide text-gray-800">
            Work Experience
          </h2>
          <div className="space-y-4">
            {resumeData.workExperiences.map((exp, index) => (
              <div key={index} className="">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    {exp.position}
                  </h3>
                  <span className="text-xs text-gray-600">
                    {formatDate(exp.startDate, exp.endDate)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-700">
                  <span className="font-medium">{exp.company}</span>
                  {exp.locationType && (
                    <span className="text-xs text-gray-500">
                      ({exp.locationType})
                    </span>
                  )}
                </div>
                {exp.description && (
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!!resumeData.projects?.length && (
        <section className="mb-5">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide text-gray-800">
            Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((proj, index) => (
              <div key={index} className="">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    {proj.ProjectName}
                  </h3>
                  <span className="text-xs text-gray-600">
                    {formatDate(proj.startDate, proj.endDate)}
                  </span>
                </div>
                {proj.toolsUsed && (
                  <p className="text-xs italic text-gray-600">
                    Technologies: {proj.toolsUsed}
                  </p>
                )}
                {proj.description && (
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {proj.description}
                  </p>
                )}
                {proj.demoLink && (
                  <a
                    href={proj.demoLink}
                    className="mt-1 inline-block text-xs text-blue-600 hover:underline"
                  >
                    View Demo →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!!resumeData.educations?.length && (
        <section className="mb-5">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide text-gray-800">
            Education
          </h2>
          <div className="space-y-3">
            {resumeData.educations.map((edu, index) => (
              <div key={index} className="">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    {edu.degree}
                  </h3>
                  <span className="text-xs text-gray-600">
                    {formatDate(edu.startDate, edu.endDate)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{edu.school}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!!resumeData.skills?.length && (
        <section className="mb-5">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide text-gray-800">
            Skills
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {resumeData.skills.join(" • ")}
          </p>
        </section>
      )}

      {!!resumeData.certifications?.length && (
        <section className="mb-5">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide text-gray-800">
            Certifications
          </h2>
          <div className="space-y-3">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    {cert.certificationName}
                  </h3>
                  <span className="text-xs text-gray-600">
                    {cert.awardedDate}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{cert.awardedBy}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
