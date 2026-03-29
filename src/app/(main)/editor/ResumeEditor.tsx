"use client";

import dynamic from "next/dynamic";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import { ResumeServerData } from "@/lib/types";
import { cn, mapToResumeValues } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { steps } from "./steps";
import useAutoSaveResume from "./useAutoSaveResume";
import { Loader2 } from "lucide-react";

// Dynamically import the heavy ResumePreviewSection component
const ResumePreviewSection = dynamic(() => import("./ResumePreviewSection"), {
  loading: () => (
    <div className="hidden w-1/2 items-center justify-center bg-secondary md:flex">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
  ssr: false,
});

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit }: ResumeEditorProps) {
  const searchParams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit
      ? mapToResumeValues(resumeToEdit)
      : {
          id: "",
          title: undefined,
          description: undefined,
          photo: undefined,
          firstName: undefined,
          lastName: undefined,
          jobTitle: undefined,
          city: undefined,
          country: undefined,
          phone: undefined,
          email: undefined,
          linkedin: undefined,
          website: undefined,
          websiteName: undefined,
          workExperiences: [],
          projects: [],
          certifications: [],
          educations: [],
          skills: [],
          borderStyle: "",
          colorHex: "",
          fontFamily: "",
          summary: undefined,
        },
  );

  const [showSmResumePreview, setShowSmResumePreview] = useState(false);

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData);

  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") || steps[0].key;

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  return (
    <div className="flex min-h-0 grow flex-col">
      <main className="relative grow">
        <Footer
          currentStep={currentStep}
          setCurrentStep={setStep}
          showSmResumePreview={showSmResumePreview}
          setShowSmResumePreview={setShowSmResumePreview}
          isSaving={isSaving}
        />
        <div className="absolute inset-0 flex min-h-0 w-full px-3 pb-3 pt-3 md:px-4 md:pb-4 md:pt-4">
          <div
            className={cn(
              "min-h-0 w-full space-y-5 overflow-y-auto pr-1 md:block md:w-1/2 md:pr-4",
              showSmResumePreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview && "flex")}
          />
        </div>
      </main>
    </div>
  );
}
