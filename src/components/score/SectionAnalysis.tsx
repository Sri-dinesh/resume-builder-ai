import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SectionData {
  score: number;
  feedback: string[];
}

interface SectionAnalysisProps {
  sections: {
    impact: SectionData;
    brevity: SectionData;
    style: SectionData;
    structure: SectionData;
    skills: SectionData;
  };
}

export function SectionAnalysis({ sections }: SectionAnalysisProps) {
  const getIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getLabel = (key: string) => {
    switch (key) {
      case "impact":
        return "Impact & Results";
      case "brevity":
        return "Brevity & Conciseness";
      case "style":
        return "Style & Tone";
      case "structure":
        return "Structure & Formatting";
      case "skills":
        return "Skills & Keywords";
      default:
        return key;
    }
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        Detailed Analysis
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(sections).map(([key, data]) => (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex w-full items-center justify-between pr-4">
                <div className="flex items-center gap-3">
                  {getIcon(data.score)}
                  <span className="text-lg font-medium">{getLabel(key)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full ${
                        data.score >= 80
                          ? "bg-green-500"
                          : data.score >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {data.score}/100
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pl-8 pt-2">
                {data.feedback.map((item, idx) => (
                  <li
                    key={idx}
                    className="list-disc text-sm text-gray-600 dark:text-gray-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
