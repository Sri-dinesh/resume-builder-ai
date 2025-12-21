import { Skeleton } from "@/components/ui/skeleton";

export default function ScorePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-72" />
          <Skeleton className="mx-auto h-6 w-[500px]" />
        </div>

        {/* Upload Section */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex justify-center gap-4">
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-44 rounded-full" />
          </div>
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
