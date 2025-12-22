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
  return (
    <div
      ref={contentRef}
      className="mx-auto bg-white text-black"
      style={{
        width: "210mm", // A4 width
        minHeight: "297mm", // A4 height
        padding: "20mm", // Consistent padding for better spacing
        boxSizing: "border-box",
        fontSize: "10pt", // Reduced font size for better fit
        lineHeight: "1.5",
        fontFamily: "Arial, sans-serif", // Ensures consistent font rendering
      }}
    >
      {/* Personal Info */}
      <div className="mb-6 space-y-1 text-center">
        <h1 className="text-3xl font-bold">
          {resumeData.firstName} {resumeData.lastName}
        </h1>
        <p className="text-lg">{resumeData.jobTitle}</p>
        <p className="text-sm text-gray-600">
          {resumeData.city}, {resumeData.country} • {resumeData.phone} •{" "}
          {resumeData.email}
        </p>
        {(resumeData.linkedin || resumeData.website) && (
          <p className="text-sm text-gray-600">
            {resumeData.linkedin && (
              <span>LinkedIn: {resumeData.linkedin} </span>
            )}
            {resumeData.website && <span>• Website: {resumeData.website}</span>}
          </p>
        )}
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <section className="mb-6 space-y-2">
          <h2 className="text-lg font-semibold">SUMMARY</h2>
          <hr className="border-2 border-black" />
          <p className="whitespace-pre-line text-sm">{resumeData.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {resumeData.workExperiences?.length > 0 && (
        <section className="mb-6 space-y-2">
          <h2 className="text-lg font-semibold">EXPERIENCE</h2>
          <hr className="border-2 border-black" />
          {resumeData.workExperiences.map((exp, index) => (
            <div key={index} className="mb-4 space-y-1">
              <div className="flex justify-between">
                <h3 className="text-base font-semibold">{exp.position}</h3>
                <span className="text-sm">
                  {exp.startDate} - {exp.endDate || "Present"}
                </span>
              </div>
              <p className="text-sm font-medium">{exp.company}</p>
              <p className="whitespace-pre-line text-sm">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {resumeData.projects?.length > 0 && (
        <section className="mb-6 space-y-2">
          <h2 className="text-lg font-semibold">PROJECTS</h2>
          <hr className="border-2 border-black" />
          {resumeData.projects.map((proj, index) => (
            <div key={index} className="mb-4 space-y-1">
              <div className="flex justify-between">
                <h3 className="text-base font-semibold">{proj.name}</h3>
                <span className="text-sm">
                  {proj.startDate} - {proj.endDate || "Present"}
                </span>
              </div>
              <p className="text-sm font-medium">{proj.description}</p>
              <p className="whitespace-pre-line text-sm">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resumeData.educations?.length > 0 && (
        <section className="mb-6 space-y-2">
          <h2 className="text-lg font-semibold">EDUCATION</h2>
          <hr className="border-2 border-black" />
          {resumeData.educations.map((edu, index) => (
            <div key={index} className="mb-4 space-y-1">
              <div className="flex justify-between">
                <h3 className="text-base font-semibold">{edu.degree}</h3>
                <span className="text-sm">
                  {edu.startDate} - {edu.endDate || "Present"}
                </span>
              </div>
              <p className="text-sm font-medium">{edu.school}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resumeData.skills?.length > 0 && (
        <section className="mb-6 space-y-2">
          <h2 className="text-lg font-semibold">SKILLS</h2>
          <hr className="border-2 border-black" />
          <p className="text-sm">{resumeData.skills.join(", ")}</p>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications?.length > 0 && (
        <section className="mb-6 space-y-2">
          <h2 className="text-lg font-semibold">CERTIFICATIONS</h2>
          <hr className="border-2 border-black" />
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="mb-4 space-y-1">
              <div className="flex justify-between">
                <h3 className="text-base font-semibold">
                  {cert.certificationName}
                </h3>
                <span className="text-sm">{cert.awardedDate}</span>
              </div>
              <p className="text-sm">{cert.awardedBy}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
