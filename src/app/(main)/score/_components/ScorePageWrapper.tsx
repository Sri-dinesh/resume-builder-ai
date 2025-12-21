"use client";

import dynamic from "next/dynamic";
import ScorePageSkeleton from "./ScorePageSkeleton";

// Dynamic import with loading skeleton for better code splitting
const ScoreContent = dynamic(() => import("./ScoreContent"), {
  loading: () => <ScorePageSkeleton />,
  ssr: false, // This component is client-only (uses PDF parsing)
});

export default function ScorePageWrapper() {
  return <ScoreContent />;
}
