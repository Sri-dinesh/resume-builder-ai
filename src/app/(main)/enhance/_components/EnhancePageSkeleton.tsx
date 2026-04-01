import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EnhancePageSkeleton() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background py-8 md:py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background dark:from-primary/5" />

      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-12 w-96 rounded-xl" />
        </div>

        <Card className="border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
          <CardHeader className="p-6 pb-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-48 rounded-xl border border-border/50 bg-muted/30" />
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="border-border/50 bg-card/60 shadow-sm backdrop-blur-xl"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
