import { Skeleton } from "@/components/ui/skeleton";

export default function ScorePageSkeleton() {
  return (
    <div className="min-h-screen bg-muted/5 py-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="max-w-2xl space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
