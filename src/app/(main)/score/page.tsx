import { Metadata } from "next";
import ScorePageWrapper from "./_components/ScorePageWrapper";

export const metadata: Metadata = {
  title: "AI Resume Scorer",
  description:
    "Get a detailed AI-powered analysis of your resume with scoring and feedback",
};

export default function ScorePage() {
  return <ScorePageWrapper />;
}
