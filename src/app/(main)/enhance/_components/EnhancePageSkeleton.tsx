import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function EnhancePageSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <div className="space-y-10">
        <div className="text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-96" />
          <Skeleton className="mx-auto h-6 w-[500px]" />
        </div>

        <Card className="p-10">
          <div className="mx-auto max-w-4xl">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </Card>
      </div>
    </div>
  );
}
