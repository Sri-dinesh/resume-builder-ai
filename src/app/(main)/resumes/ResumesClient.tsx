"use client";

import CreateResumeButton from "./CreateResumeButton";
import ResumeItem from "./ResumeItem";
import { useRef } from "react";

export default function ResumesClient({
  resumes,
  totalCount,
  subscriptionLevel,
}: {
  resumes: any[];
  totalCount: number;
  subscriptionLevel: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <CreateResumeButton canCreate={!!(subscriptionLevel && totalCount)} />
      {/* <CreateResumeButton canCreate={subscriptionLevel && totalCount} /> */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your resumes</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {resumes.map((resume) => (
          <ResumeItem
            key={resume.id}
            resume={resume}
            contentRef={contentRef}
          />
        ))}
      </div>
    </main>
  );
}
