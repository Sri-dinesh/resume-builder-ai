import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CoverLetterPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto mb-4 h-14 w-14 rounded-full" />
          <Skeleton className="mx-auto mb-3 h-12 w-96" />
          <Skeleton className="mx-auto h-6 w-[500px]" />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Section Skeleton */}
          <div>
            <Card className="min-h-[600px]">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="flex min-h-[400px] flex-col items-center justify-center">
                  <Skeleton className="mb-4 h-16 w-16 rounded-full" />
                  <Skeleton className="mb-2 h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
