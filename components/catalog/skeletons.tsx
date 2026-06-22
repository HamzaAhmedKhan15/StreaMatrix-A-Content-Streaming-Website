import { Skeleton } from "@/components/ui/Skeleton";

/** Placeholder matching a single TitleCard's footprint. */
export function TitleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl surface-card">
      <Skeleton className="aspect-2/3 rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/** A full grid of card skeletons, used as the filtered/search loading state. */
export function TitleGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <TitleCardSkeleton key={index} />
      ))}
    </div>
  );
}

/** A heading + horizontal row of card skeletons, matching a rail. */
export function TitleRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-7 w-48" />
      <div className="flex gap-3 overflow-hidden sm:gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="w-36 shrink-0 sm:w-44">
            <TitleCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
