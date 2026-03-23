import { canCreateResume } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { FileText } from "lucide-react";
import CreateResumeButton from "./CreateResumeButton";
import ResumeItem from "./ResumeItem";

export const metadata: Metadata = {
  title: "Your resumes",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [resumes, totalCount, subscriptionLevel] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeDataInclude,
    }),
    prisma.resume.count({
      where: {
        userId,
      },
    }),
    getUserSubscriptionLevel(userId),
  ]);

  return (
    <main className="min-h-screen w-full bg-background pb-12 pt-8 md:pb-16 md:pt-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
              Resumes
            </h1>
            <p className="text-base font-medium text-muted-foreground">
              Manage and edit your generated resumes ({totalCount})
            </p>
          </div>
          <CreateResumeButton
            canCreate={canCreateResume(subscriptionLevel, totalCount)}
          />
        </div>

        {resumes.length === 0 ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-card shadow-sm border border-border">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No resumes yet</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mb-6">
              Create your first resume to start applying for jobs.
            </p>
            <CreateResumeButton canCreate={canCreateResume(subscriptionLevel, totalCount)} />
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resumes.map((resume) => (
              <ResumeItem key={resume.id} resume={resume} contentRef={null} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
