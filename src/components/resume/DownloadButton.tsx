"use client";

import { Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import type { ResumeValues } from "@/lib/resume/validation";

interface DownloadButtonProps {
  resumeData: ResumeValues;
  contentRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}
export default function DownloadButton({
  resumeData,
  contentRef,
  className,
}: DownloadButtonProps) {
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resumeData.title || "Resume",
    onBeforePrint: () => {
      // Check if contentRef has content
      if (!contentRef.current || !contentRef.current.innerHTML.trim()) {
        console.error("No content to print");
        throw new Error("No content to print");
      }
      return Promise.resolve();
    },
  });

  const handleDownload = () => {
    if (!contentRef.current) {
      console.error("Content reference not available");
      return;
    }
    reactToPrintFn();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      className={`flex items-center gap-2 ${className}`}
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}
