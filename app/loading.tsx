import { Skeleton } from "@/components/ui/Skeleton";
import { TitleGridSkeleton } from "@/components/catalog/skeletons";

/** Streamed instantly on navigation to "/" while the page renders. */
export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
      <Skeleton className="min-h-88 w-full rounded-3xl sm:min-h-96 md:min-h-112" />
      <div className="space-y-5">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-12 w-full rounded-full" />
        <TitleGridSkeleton />
      </div>
    </div>
  );
}
