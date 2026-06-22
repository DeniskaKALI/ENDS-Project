import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

export function TransportCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Card>
  );
}

export function KPIWidgetSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="w-12 h-12 rounded-2xl" />
      </div>
    </Card>
  );
}

export function RouteCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="w-4 h-4 mt-1" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="w-4 h-4 mt-1" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <Skeleton className="h-2 w-full mt-2" />
      </div>
    </Card>
  );
}
