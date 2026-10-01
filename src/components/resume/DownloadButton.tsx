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
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0mm;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #resumePreviewContent {
          width: 210mm !important;
          min-height: 297mm !important;
          padding: 12.7mm !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
          background: #ffffff !important;
          background-image: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        [data-dndkit], .cursor-grab {
          display: none !important;
        }
        * {
          transition: none !important;
          animation: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
      }
    `,
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
