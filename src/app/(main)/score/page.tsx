import { Metadata } from "next";
import ScoreContent from "./_components/ScoreContent";

export const metadata: Metadata = {
  title: "AI Resume Scorer",
  description:
    "Get a detailed AI-powered analysis of your resume with scoring and feedback",
};

export default function ScorePage() {
  return <ScoreContent />;
}
