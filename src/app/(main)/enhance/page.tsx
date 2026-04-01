import { Metadata } from "next";
import EnhancePageWrapper from "./_components/EnhancePageWrapper";

export const metadata: Metadata = {
  title: "AI Resume Enhancer",
  description:
    "Upload your PDF resume and let AI transform it into a professional masterpiece",
};

export default function EnhancePage() {
  return <EnhancePageWrapper />;
}
