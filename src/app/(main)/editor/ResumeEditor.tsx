"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import { cn, mapToResumeValues } from "@/lib/utils";
import Breadcrumbs from "./Breadcrumbs";
import StepsSidebar from "./StepsSidebar";
import { steps } from "./steps";
import useAutoSaveResume from "./useAutoSaveResume";
import type { ResumeServerData } from "@/lib/resume/types";
import type { ResumeValues } from "@/lib/resume/validation";

// Dynamically import the heavy ResumePreviewSection component
const ResumePreviewSection = dynamic(() => import("./ResumePreviewSection"), {
  loading: () => (
    <div className="bg-secondary hidden w-1/2 items-center justify-center md:flex">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
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
          contactLinks: [],
          workExperiences: [],
          projects: [],
          certifications: [],
          educations: [],
          skills: [],
          borderStyle: "",
          colorHex: "",
          fontFamily: "Computer Modern Serif Roman",
          headerAlignment: "center",
          summary: undefined,
        },
  );

  const { hasUnsavedChanges } = useAutoSaveResume(resumeData);

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
        <div className="absolute inset-0 flex min-h-0 w-full px-3 pt-3 pb-3 md:px-4 md:pt-4 md:pb-4 md:gap-4">
          <div
            className={cn(
              "hidden md:flex w-max h-fit flex-col space-y-2"
            )}
          >
            <StepsSidebar currentStep={currentStep} setCurrentStep={setStep} />
          </div>
          
          <div
            className={cn(
              "min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 md:pr-0"
            )}
          >
            <div className="md:hidden mb-4">
              <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            </div>
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="hidden md:block border-r" />
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        </div>
      </main>
    </div>
  );
}
