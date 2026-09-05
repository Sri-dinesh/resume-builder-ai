"use client";

import { FileUser, PenLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { steps } from "./steps";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (show: boolean) => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export default function Footer({
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowSmResumePreview,
  isSaving,
  hasUnsavedChanges,
}: FooterProps) {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  const saveStatus = isSaving
    ? "Saving..."
    : hasUnsavedChanges
      ? "Unsaved changes"
      : "Saved";

  return (
    <div className="flex items-center gap-3">
      <p
        className={cn(
          "rounded-full border px-3 py-1 text-xs shadow-sm transition-colors",
          isSaving &&
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
          !isSaving &&
            hasUnsavedChanges &&
            "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300",
          !isSaving &&
            !hasUnsavedChanges &&
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
        )}
      >
        {saveStatus}
      </p>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/resumes">Close</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={
            previousStep ? () => setCurrentStep(previousStep) : undefined
          }
          disabled={!previousStep}
          className="hidden md:flex"
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
          disabled={!nextStep}
          className="hidden md:flex"
        >
          Next
        </Button>
        
        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={
                previousStep ? () => setCurrentStep(previousStep) : undefined
              }
              disabled={!previousStep}
            >
              &larr;
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
              disabled={!nextStep}
            >
              &rarr;
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSmResumePreview(!showSmResumePreview)}
              title={
                showSmResumePreview ? "Show input form" : "Show resume preview"
              }
            >
              {showSmResumePreview ? <PenLine className="h-4 w-4" /> : <FileUser className="h-4 w-4" />}
            </Button>
        </div>
      </div>
    </div>
  );
}
