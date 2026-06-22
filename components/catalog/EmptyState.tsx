import { SearchIcon } from "@/components/ui/icons";

/** Shown when a search/filter combination returns no titles. */
export function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl surface-card py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-surface-2 text-muted">
        <SearchIcon className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="text-lg font-semibold">No titles found</p>
        <p className="text-sm text-muted">
          {query ? (
            <>
              Nothing matches <span className="text-foreground">“{query}”</span>. Try a different
              search or category.
            </>
          ) : (
            "Try a different search or category."
          )}
        </p>
      </div>
    </div>
  );
}
