import { Metadata } from "next";
import EnhancePageWrapper from "./_components/EnhancePageWrapper";

export const metadata: Metadata = {
  title: "Enhance Your Resume",
  description:
    "Upload your PDF resume and let AI improve & generate a new one for you",
};

export default function EnhancePage() {
  return <EnhancePageWrapper />;
}
