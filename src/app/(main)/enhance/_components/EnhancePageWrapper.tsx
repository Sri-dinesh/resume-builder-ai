"use client";

import dynamic from "next/dynamic";
import EnhancePageSkeleton from "./EnhancePageSkeleton";

// Dynamic import with loading skeleton for better code splitting
const EnhanceContent = dynamic(() => import("./EnhanceContent"), {
  loading: () => <EnhancePageSkeleton />,
  ssr: false, // This component is client-only (uses localStorage, PDF libs)
});

export default function EnhancePageWrapper() {
  return <EnhanceContent />;
}
