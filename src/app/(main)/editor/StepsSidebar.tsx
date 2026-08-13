import React from "react";
import { Button } from "@/components/ui/button";
import { steps } from "./steps";
import { cn } from "@/lib/utils";

interface StepsSidebarProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export default function StepsSidebar({
  currentStep,
  setCurrentStep,
}: StepsSidebarProps) {
  return (
    <div className="flex flex-col space-y-1">
      {steps.map((step) => (
        <Button
          key={step.key}
          variant="ghost"
          size="sm"
          className={cn(
            "justify-start text-left text-muted-foreground",
            step.key === currentStep && "bg-accent text-foreground font-semibold"
          )}
          onClick={() => setCurrentStep(step.key)}
        >
          {step.title}
        </Button>
      ))}
    </div>
  );
}
