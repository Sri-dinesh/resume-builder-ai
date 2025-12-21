import { Metadata } from "next";
import CoverLetterPageWrapper from "./_components/CoverLetterPageWrapper";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator",
  description:
    "Create personalized, ATS-optimized cover letters that highlight your unique qualifications",
};

export default function CoverLetterPage() {
  return <CoverLetterPageWrapper />;
}
