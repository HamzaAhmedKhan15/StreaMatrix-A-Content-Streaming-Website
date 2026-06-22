"use client";

import { useContinueWatching } from "@/hooks/useContinueWatching";
import { ContinueWatchingCard } from "./ContinueWatchingCard";

/**
 * "Continue watching" shelf for the home page. Reads from localStorage, so it
 * renders nothing until hydrated and nothing when the list is empty.
 */
export function ContinueWatchingRow() {
  const { items, remove } = useContinueWatching();

  // Empty during SSR / first paint (server snapshot), then fills after hydration.
  if (items.length === 0) return null;

  return (
    <section className="space-y-3" aria-label="Continue watching">
      <h2 className="text-xl font-semibold">Continue watching</h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:gap-4">
        {items.map((item) => (
          <div key={item.id} className="w-44 shrink-0 sm:w-52">
            <ContinueWatchingCard item={item} onRemove={() => remove(item.id)} />
          </div>
        ))}
      </div>
    </section>
  );
}
