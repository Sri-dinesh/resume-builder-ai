import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";

type SectionType =
  | "personal"
  | "summary"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "certifications";
import { Inter } from "next/font/google";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { DraggableSection } from "./DraggableSection";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function ResumePreview({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedFont = resumeData.fontFamily || "Arial";

  const [sectionOrder, setSectionOrder] = useState<SectionType[]>([
    "personal",
    "summary",
    "experience",
    "projects",
    "education",
    "skills",
    "certifications",
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as SectionType);
        const newIndex = items.indexOf(over.id as SectionType);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getFontFamily = () => {
    switch (selectedFont) {
      case "Arial":
        return "Arial, sans-serif";
      case "Calibri":
        return "Calibri, sans-serif";
      case "Helvetica":
        return "Helvetica, Arial, sans-serif";
      case "Times New Roman":
        return "'Times New Roman', serif";
      case "Georgia":
        return "Georgia, serif";
      case "Verdana":
        return "Verdana, sans-serif";
      case "Inter":
        return `${inter.style.fontFamily}`;
      default:
        return "Arial, sans-serif";
    }
  };

  // const { width } = useDimensions(containerRef);
  const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          fontFamily: getFontFamily(),
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {/* <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <ProjectSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
        <CertificationSection resumeData={resumeData} /> */}

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            {sectionOrder.map((section) => (
              <DraggableSection key={section} id={section}>
                {section === "personal" && (
                  <PersonalInfoHeader resumeData={resumeData} />
                )}
                {section === "summary" && (
                  <SummarySection resumeData={resumeData} />
                )}
                {section === "experience" && (
                  <WorkExperienceSection resumeData={resumeData} />
                )}
                {section === "projects" && (
                  <ProjectSection resumeData={resumeData} />
                )}
                {section === "education" && (
                  <EducationSection resumeData={resumeData} />
                )}
                {section === "skills" && (
                  <SkillsSection resumeData={resumeData} />
                )}
                {section === "certifications" && (
                  <CertificationSection resumeData={resumeData} />
                )}
              </DraggableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
    linkedin,
    websiteName,
    website,
  } = resumeData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Author photo"
          className="aspect-square object-cover"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "9999px"
                  : "10%",
          }}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p
            className="text-3xl font-bold"
            style={{
              color: colorHex,
            }}
          >
            {firstName} {lastName}
          </p>
          <p
            className="font-medium"
            style={{
              color: colorHex,
            }}
          >
            {jobTitle}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {/* {[phone, email].filter(Boolean).join(" • ")} */}
          {phone && (
            <a href={`tel:${phone}`} className="text-blue-500">
              {phone}
            </a>
          )}
          {phone && email ? " • " : ""}
          {email && (
            <a href={`mailto:${email}`} className="text-blue-500">
              {email}
            </a>
          )}
          {(phone || email) && linkedin ? " • " : ""}
          {linkedin && (
            <a href={linkedin} target="_blank" className="text-blue-500">
              LinkedIn
            </a>
          )}
          {linkedin && website ? " • " : ""}
          {website && (
            <a href={website} target="_blank" className="text-blue-500">
              {websiteName || website}
            </a>
          )}
        </p>
        {/* <p className="text-xs text-gray-500">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              LinkedIn
            </a>
          )}
          {linkedin && website ? " • " : ""}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {websiteName || website}
            </a>
          )}
        </p> */}
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Summary
        </p>
        <div className="whitespace-pre-line text-justify text-sm">
          {summary}
        </div>
      </div>
    </>
  );
}

// function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
//   const { workExperiences, colorHex } = resumeData;

//   const workExperiencesNotEmpty = workExperiences?.filter(
//     (exp) => Object.values(exp).filter(Boolean).length > 0,
//   );

//   if (!workExperiencesNotEmpty?.length) return null;

//   return (
//     <>
//       <hr
//         className="border-2"
//         style={{
//           borderColor: colorHex,
//         }}
//       />
//       <div className="space-y-3">
//         <p
//           className="text-lg font-semibold"
//           style={{
//             color: colorHex,
//           }}
//         ></p>
//         {workExperiencesNotEmpty.map((exp, index) => (
//           <div key={index} className="break-inside-avoid space-y-1">
//             <div
//               className="flex items-center justify-between text-sm font-semibold"
//               style={{
//                 color: colorHex,
//               }}
//             >
//               <span>{exp.position}</span>
//               {exp.startDate && (
//                 <span>
//                   {formatDate(exp.startDate, "MM/yyyy")} -{" "}
//                   {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center justify-between">
//               <p className="text-xs font-semibold">{exp.company}</p>
//               <p className="text-xs font-light">{exp.locationType}</p>
//             </div>
//             <div className="whitespace-pre-line text-xs">{exp.description}</div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Experience
        </p>
        {workExperiencesNotEmpty.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{
                color: colorHex,
              }}
            >
              <span>{exp.position}</span>
              {exp.startDate && (
                <span>
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">{exp.company}</p>
              <p className="text-xs font-light">{exp.locationType}</p>
            </div>
            {/* Render the description as HTML */}
            <div
              className="prose text-justify text-xs"
              dangerouslySetInnerHTML={{ __html: exp.description || "" }}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}

// function ProjectSection({ resumeData }: ResumeSectionProps) {
//   const { projects, colorHex } = resumeData;

//   const projectsNotEmpty = projects?.filter(
//     (proj) => Object.values(proj).filter(Boolean).length > 0,
//   );

//   if (!projectsNotEmpty?.length) return null;

//   return (
//     <>
//       <hr
//         className="border-2"
//         style={{
//           borderColor: colorHex,
//         }}
//       />
//       <div className="space-y-3">
//         <p
//           className="text-lg font-semibold"
//           style={{
//             color: colorHex,
//           }}
//         >
//           Projects
//         </p>
//         {projectsNotEmpty.map((proj, index) => (
//           <div key={index} className="break-inside-avoid space-y-1">
//             <div
//               className="flex items-center justify-between text-sm font-semibold"
//               style={{
//                 color: colorHex,
//               }}
//             >
//               <span>{proj.ProjectName}</span>
//               {proj.startDate && (
//                 <span>
//                   {formatDate(proj.startDate, "MM/yyyy")} -{" "}
//                   {proj.endDate
//                     ? formatDate(proj.endDate, "MM/yyyy")
//                     : "Present"}
//                 </span>
//               )}
//             </div>
//             <p className="text-xs font-semibold">{proj.toolsUsed}</p>
//             <div className="whitespace-pre-line text-xs">
//               {proj.description}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
function ProjectSection({ resumeData }: ResumeSectionProps) {
  const { projects, colorHex } = resumeData;

  const projectsNotEmpty = projects?.filter(
    (proj) => Object.values(proj).filter(Boolean).length > 0,
  );

  if (!projectsNotEmpty?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Projects
        </p>
        {projectsNotEmpty.map((proj, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{
                color: colorHex,
              }}
            >
              <span>{proj.ProjectName}</span>
              {proj.startDate && (
                <span>
                  {formatDate(proj.startDate, "MM/yyyy")} -{" "}
                  {proj.endDate
                    ? formatDate(proj.endDate, "MM/yyyy")
                    : "Present"}
                </span>
              )}
            </div>
            {/* <p className="text-xs font-semibold">{proj.toolsUsed}</p> */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">{proj.toolsUsed}</p>
              {proj.demoLink && proj.demoLink.startsWith("http") && (
                <a
                  href={proj.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-light hover:underline"
                  style={{ color: colorHex }}
                >
                  View Demo
                </a>
              )}
            </div>

            {/* Render the description as HTML so formatted text appears */}
            <div
              className="prose text-justify text-xs"
              dangerouslySetInnerHTML={{ __html: proj.description || "" }}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Education
        </p>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{
                color: colorHex,
              }}
            >
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span>
                  {edu.startDate &&
                    `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Skills
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="rounded-sm bg-black text-white hover:bg-black"
              style={{
                backgroundColor: colorHex,
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? "0px"
                    : borderStyle === BorderStyles.CIRCLE
                      ? "9999px"
                      : "8px",
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}

function CertificationSection({ resumeData }: ResumeSectionProps) {
  const { certifications, colorHex } = resumeData;

  // Filter out empty certifications
  const certificationsNotEmpty = certifications?.filter(
    (cert) => Object.values(cert).filter(Boolean).length > 0,
  );

  // If no valid certifications exist, return null
  if (!certificationsNotEmpty?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Certifications
        </p>
        {certificationsNotEmpty.map((cert, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            {/* Certification Name */}
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{
                color: colorHex,
              }}
            >
              <span>
                <span className="font-semibold">{cert.certificationName}</span>
                {cert.awardedBy && (
                  <span className="font-normal italic">
                    {" "}
                    - {cert.awardedBy}
                  </span>
                )}
              </span>
              {cert.awardedDate && (
                <span>{formatDate(cert.awardedDate, "MM/yyyy")}</span>
              )}
            </div>

            {/* Optional: Additional details or styling */}
            {/* Example: Add a link to the certification if available */}
            {/* Uncomment and adapt if needed */}
            {/* cert.certificationLink && (
              <a
                href={cert.certificationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-light hover:underline"
                style={{ color: colorHex }}
              >
                View Certification
              </a>
            ) */}
          </div>
        ))}
      </div>
    </>
  );
}
