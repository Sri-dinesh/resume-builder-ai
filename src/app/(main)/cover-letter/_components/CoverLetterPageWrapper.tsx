"use client";

import dynamic from "next/dynamic";
import CoverLetterPageSkeleton from "./CoverLetterPageSkeleton";

// Dynamic import with loading skeleton for better code splitting
const CoverLetterContent = dynamic(() => import("./CoverLetterContent"), {
  loading: () => <CoverLetterPageSkeleton />,
  ssr: false, // This component is client-only (heavy form state)
});

export default function CoverLetterPageWrapper() {
  return <CoverLetterContent />;
}
