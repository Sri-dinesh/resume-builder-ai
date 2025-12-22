import { useForm, FormProvider } from "react-hook-form";
import ResumePreview from "@/components/ResumePreview";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import BorderStyleButton from "./BorderStyleButton";
import ColorPicker from "./ColorPicker";
import { FontSelector } from "@/components/FontSelector";
import DownloadButton from "@/components/DownloadButton";
import { useRef } from "react";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  className?: string;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
  className,
}: ResumePreviewSectionProps) {
  const methods = useForm<ResumeValues>({
    defaultValues: resumeData,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <FormProvider {...methods}>
      <div
        className={cn(
          "group relative hidden w-full md:flex md:w-1/2",
          className,
        )}
      >
        {/* Customization Controls */}
        <div className="absolute left-1 top-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
          {/* Color Picker */}
          <ColorPicker
            color={resumeData.colorHex}
            onChange={(color) =>
              setResumeData({ ...resumeData, colorHex: color.hex })
            }
          />

          {/* Border Style Button */}
          <BorderStyleButton
            borderStyle={resumeData.borderStyle}
            onChange={(borderStyle) =>
              setResumeData({ ...resumeData, borderStyle })
            }
          />

          {/* Font Selector */}
          <FontSelector
            value={resumeData.fontFamily}
            onValueChange={(fontFamily) =>
              setResumeData({ ...resumeData, fontFamily })
            }
          />

          {/* Download Button */}
          <DownloadButton resumeData={resumeData} contentRef={contentRef} />
        </div>

        {/* Resume Preview */}
        <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
          <ResumePreview
            resumeData={resumeData}
            contentRef={contentRef}
            className="max-w-2xl shadow-md"
          />
        </div>
      </div>
    </FormProvider>
  );
}
