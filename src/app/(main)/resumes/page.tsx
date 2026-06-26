import { env } from "@/env";
import { canCreateResume } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { type SubscriptionLevel } from "@/lib/subscription";
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

  const [resumes, totalCount, subscriptionLevel] = await prisma.$transaction(
    async (tx) => {
      const [resumes, totalCount, subscription] = await Promise.all([
        tx.resume.findMany({
          where: {
            userId,
          },
          orderBy: {
            updatedAt: "desc",
          },
          include: resumeDataInclude,
        }),
        tx.resume.count({
          where: {
            userId,
          },
        }),
        tx.userSubscription.findUnique({
          where: {
            userId,
          },
        }),
      ]);

      const subscriptionLevel: SubscriptionLevel =
        !subscription || subscription.stripeCurrentPeriodEnd < new Date()
          ? "free"
          : subscription.stripePriceId ===
              env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY
            ? "pro"
            : subscription.stripePriceId ===
                env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
              ? "pro_plus"
              : "free";

      return [resumes, totalCount, subscriptionLevel] as const;
    },
  );

  return (
    <main className="bg-background min-h-screen w-full pt-8 pb-12 md:pt-12 md:pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <h1 className="text-foreground text-4xl font-extrabold tracking-tight lg:text-5xl">
              Resumes
            </h1>
            <p className="text-muted-foreground text-base font-medium">
              Manage and edit your generated resumes ({totalCount})
            </p>
          </div>
          <CreateResumeButton
            canCreate={canCreateResume(subscriptionLevel, totalCount)}
          />
        </div>

        {resumes.length === 0 ? (
          <div className="border-border bg-muted/20 flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <div className="bg-card border-border mb-4 flex h-16 w-16 items-center justify-center rounded-lg border shadow-sm">
              <FileText className="text-muted-foreground h-8 w-8" />
            </div>
            <h2 className="text-foreground text-xl font-semibold">
              No resumes yet
            </h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-sm">
              Create your first resume to start applying for jobs.
            </p>
            <CreateResumeButton
              canCreate={canCreateResume(subscriptionLevel, totalCount)}
            />
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
