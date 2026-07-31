import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db/client";
import { resumeDataInclude } from "@/lib/resume/types";
import ResumeEditor from "./ResumeEditor";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Resume editor",
};

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        include: resumeDataInclude,
      })
    : null;

  return <ResumeEditor resumeToEdit={resumeToEdit} />;
}
