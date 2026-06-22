import { Skeleton } from "@/components/ui/Skeleton";

/** Loading state for a title detail page. */
export default function TitleLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full max-w-3xl" />
      </div>
    </div>
  );
}
