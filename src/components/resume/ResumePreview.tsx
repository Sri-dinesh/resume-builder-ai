import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { formatDate } from "date-fns";
import { Loader2, Phone, Mail, Globe, MapPin } from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { DraggableSection } from "@/components/editor";
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import type { ResumeValues } from "@/lib/resume/validation";
import type { DragEndEvent } from "@dnd-kit/core";

type SectionType =
  | "personal"
  | "summary"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "certifications";

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
  const previewContentRef = useRef<HTMLDivElement>(null);
  const selectedFont = resumeData.fontFamily || "Arial";
  const [previewHeight, setPreviewHeight] = useState<number>();

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
      case "Computer Modern Serif Roman":
        return "'Computer Modern Serif Roman', serif";
      default:
        return "Arial, sans-serif";
    }
  };

  // const { width } = useDimensions(containerRef);
  const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);
  const scale = width ? width / 816 : 1;

  useEffect(() => {
    if (!previewContentRef.current || !width) return;

    const observer = new ResizeObserver(() => {
      setPreviewHeight(previewContentRef.current!.scrollHeight * scale);
    });

    observer.observe(previewContentRef.current);

    return () => observer.disconnect();
  }, [scale, width]);

  const setContentRefs = (node: HTMLDivElement | null) => {
    previewContentRef.current = node;

    if (!contentRef) return;

    if (typeof contentRef === "function") {
      contentRef(node);
      return;
    }

    contentRef.current = node;
  };

  return (
    <div
      className={cn("w-full bg-white text-black", className)}
      style={{
        minHeight: previewHeight,
      }}
      ref={containerRef}
    >
      <div
        className={cn("space-y-2 p-[0.5in]", !width && "invisible")}
        style={{
          width: 816,
          zoom: scale,
          fontFamily: getFontFamily(),
          background: "repeating-linear-gradient(to bottom, transparent 0, transparent 1055px, #cbd5e1 1055px, #cbd5e1 1056px)",
        }}
        ref={setContentRefs}
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
    contactLinks,
    headerAlignment,
  } = resumeData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const alignmentClass =
    headerAlignment === "left"
      ? "items-start text-left"
      : headerAlignment === "right"
        ? "items-end text-right"
        : "items-center text-center";

  const justifyClass =
    headerAlignment === "left"
      ? "justify-start"
      : headerAlignment === "right"
        ? "justify-end"
        : "justify-center";

  return (
    <div className={`flex flex-col ${alignmentClass}`}>
      {photoSrc && (
        <Image
          src={photoSrc}
          width={80}
          height={80}
          alt="Author photo"
          className="mb-2 aspect-square object-cover"
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
      <h1
        className="font-bold text-[24.9pt]"
        style={{ color: colorHex, fontVariant: "small-caps" }}
      >
        {firstName} {lastName}
      </h1>
      {jobTitle && (
        <p className="font-semibold mt-0.5 text-[10pt]">{jobTitle}</p>
      )}
      <div className={`mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11pt] text-black ${justifyClass}`}>
        {phone && (
          <div className="flex items-center gap-1">
            <Phone size={12} />
            <a href={`tel:${phone}`} className="hover:underline">
              {phone}
            </a>
          </div>
        )}
        
        {email && (
          <div className="flex items-center gap-1">
            <Mail size={12} />
            <a href={`mailto:${email}`} className="hover:underline">
              {email}
            </a>
          </div>
        )}

        {(city || country) && (
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>
              {city}
              {city && country ? ", " : ""}
              {country}
            </span>
          </div>
        )}

        {contactLinks?.map((link, index) => {
          if (!link.url) return null;
          let Icon: React.ElementType = Globe;
          if (link.url.toLowerCase().includes("linkedin")) Icon = FaLinkedin;
          else if (link.url.toLowerCase().includes("github")) Icon = FaGithub;
          
          return (
            <div key={index} className="flex items-center gap-1">
              <Icon size={12} />
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {link.linkName || link.url.replace(/^https?:\/\//, "")}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-1">
      <p
        className="font-bold text-[12pt]"
        style={{ color: colorHex }}
      >
        Objective
      </p>
      <div className="h-[1px] w-full bg-black" style={{ backgroundColor: colorHex || "black" }} />
      <div className="text-[10pt] text-justify whitespace-pre-line mt-1">
        {summary}
      </div>
    </div>
  );
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    <div className="space-y-1.5">
      <div className="space-y-1">
        <p
          className="font-bold text-[12pt]"
          style={{ color: colorHex }}
        >
          Experience
        </p>
        <div className="h-[1px] w-full bg-black" style={{ backgroundColor: colorHex || "black" }} />
      </div>
      
      {workExperiencesNotEmpty.map((exp, index) => (
        <div key={index} className="break-inside-avoid space-y-0.5">
          <div className="flex items-center justify-between text-[11pt]">
            <span className="font-bold">{exp.company}</span>
            {exp.startDate && (
              <span className="font-bold text-[10pt]">
                {formatDate(exp.startDate, "MMM yyyy")} -{" "}
                {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Present"}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-[10pt]">
            <span className="italic">{exp.position}</span>
            <span className="italic">{exp.locationType}</span>
          </div>
          {!!exp.description?.length && (
            <ul className="mt-1 list-outside list-disc space-y-0.5 text-[10pt] ml-4">
              {exp.description.map((bullet, i) => (
                <li key={i} className="text-justify pl-1">
                  <span
                    dangerouslySetInnerHTML={{ __html: bullet.replace(/^<p>/, '').replace(/<\/p>$/, '') }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectSection({ resumeData }: ResumeSectionProps) {
  const { projects, colorHex } = resumeData;

  const projectsNotEmpty = projects?.filter(
    (proj) => Object.values(proj).filter(Boolean).length > 0,
  );

  if (!projectsNotEmpty?.length) return null;

  return (
    <div className="space-y-1.5">
      <div className="space-y-1">
        <p
          className="font-bold text-[12pt]"
          style={{ color: colorHex }}
        >
          Projects
        </p>
        <div className="h-[1px] w-full bg-black" style={{ backgroundColor: colorHex || "black" }} />
      </div>

      <div className="space-y-1.5 break-inside-avoid">
        {projectsNotEmpty.map((proj, index) => (
          <div key={index} className="space-y-0.5">
            <div className="flex items-center justify-between text-[10pt]">
              <div>
                <span className="font-bold text-[11pt]">{proj.ProjectName}</span>
                {proj.toolsUsed && (
                  <>
                    <span className="mx-1">|</span>
                    <span className="italic">{proj.toolsUsed}</span>
                  </>
                )}
              </div>
              <div className="flex gap-2 font-bold uppercase tracking-wider">
                {proj.demoLink && proj.demoLink.startsWith("http") && (
                  <a href={proj.demoLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    DEMO
                  </a>
                )}
                {proj.githubUrl && proj.githubUrl.startsWith("http") && (
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    CODE
                  </a>
                )}
              </div>
            </div>
            {!!proj.description?.length && (
              <ul className="mt-1 list-outside list-disc space-y-0.5 text-[10pt] ml-4">
                {proj.description.map((bullet, i) => (
                  <li key={i} className="text-justify pl-1">
                    <span
                      dangerouslySetInnerHTML={{ __html: bullet.replace(/^<p>/, '').replace(/<\/p>$/, '') }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <div className="space-y-1.5">
      <div className="space-y-1">
        <p
          className="font-bold text-[12pt]"
          style={{ color: colorHex }}
        >
          Education
        </p>
        <div className="h-[1px] w-full bg-black" style={{ backgroundColor: colorHex || "black" }} />
      </div>
      
      {educationsNotEmpty.map((edu, index) => {
        const schoolParts = edu.school?.split(",") || [];
        const institution = schoolParts[0]?.trim();
        const location = edu.location || (schoolParts.length > 1 ? schoolParts.slice(1).join(",").trim() : "");
        return (
          <div key={index} className="break-inside-avoid space-y-0.5 text-[10pt] mt-1">
            <div className="flex items-center justify-between text-[11pt]">
              <span className="font-bold">{institution}</span>
              {(edu.startDate || edu.endDate) && (
                <span className="font-bold text-[10pt]">
                  {edu.startDate ? formatDate(edu.startDate, "MMM yyyy") : ""}
                  {edu.startDate && edu.endDate ? " - " : ""}
                  {edu.endDate ? formatDate(edu.endDate, "MMM yyyy") : edu.startDate ? " - Present" : "Present"}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="italic">{edu.degree}</span>
              {location && <span className="italic text-[10pt]">{location}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="space-y-1.5">
      <div className="space-y-1">
        <p
          className="font-bold text-[12pt]"
          style={{ color: colorHex }}
        >
          Technical Skills
        </p>
        <div className="h-[1px] w-full bg-black" style={{ backgroundColor: colorHex || "black" }} />
      </div>

      <div className="text-[10pt] break-inside-avoid">
        {skills.join(", ")}
      </div>
    </div>
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
    <div className="space-y-1.5">
      <div className="space-y-1">
        <p
          className="font-bold text-[12pt]"
          style={{ color: colorHex }}
        >
          Certifications
        </p>
        <div className="h-[1px] w-full bg-black" style={{ backgroundColor: colorHex || "black" }} />
      </div>
      
      <ul className="list-outside list-disc space-y-1 text-[10pt] ml-4 break-inside-avoid">
        {certificationsNotEmpty.map((cert, index) => (
          <li key={index} className="text-justify pl-1">
            <span className="font-bold text-[11pt]">{cert.certificationName}. </span>
            {cert.awardedBy && <span className="text-[11pt]">{cert.awardedBy}</span>}
            {cert.awardedDate && (
              <span className="text-[10pt]"> - {formatDate(cert.awardedDate, "MMM yyyy")}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
