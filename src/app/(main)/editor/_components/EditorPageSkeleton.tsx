import { Skeleton } from "@/components/ui/skeleton";

export default function EditorPageSkeleton() {
  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-96" />
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          {/* Left side - Form */}
          <div className="w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2">
            {/* Breadcrumbs skeleton */}
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>

            {/* Form skeleton */}
            <div className="space-y-4 rounded-lg border p-6">
              <Skeleton className="h-6 w-32" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </div>

          <div className="grow md:border-r" />

          {/* Right side - Preview */}
          <div className="hidden w-1/2 md:flex">
            <div className="flex w-full justify-center bg-secondary p-3">
              <Skeleton className="aspect-[210/297] h-auto w-full max-w-2xl shadow-md" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t px-3 py-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </footer>
    </div>
  );
}
