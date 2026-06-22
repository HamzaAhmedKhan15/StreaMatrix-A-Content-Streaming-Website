"use client";

import { useEffect, useRef, useState } from "react";
import type { Rail } from "@/services/catalog";
import { cn } from "@/lib/cn";
import { TitleRow } from "./TitleRow";
import { Spinner } from "@/components/ui/Spinner";

// Show the first three rails immediately (Trending, Hollywood, Animated).
const INITIAL = 3;

/**
 * Renders the home rails progressively. The first 3 show immediately; after
 * that a loader sits at the bottom and each rail is revealed — one per scroll —
 * as the loader scrolls into view, fading in smoothly.
 */
export function LazyRails({ rails }: { rails: Rail[] }) {
  const [visibleCount, setVisibleCount] = useState(Math.min(INITIAL, rails.length));
  const sentinelRef = useRef<HTMLDivElement>(null);
  // True between revealing a rail and the loader leaving view again, so each
  // scroll-to-bottom reveals exactly one rail.
  const revealingRef = useRef(false);

  const total = rails.length;
  const hasMore = visibleCount < total;

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (!revealingRef.current) {
            revealingRef.current = true;
            setVisibleCount((count) => Math.min(count + 1, total));
          }
        } else {
          // Loader scrolled out of view (pushed down by the new rail) — ready
          // to reveal the next one on the following scroll.
          revealingRef.current = false;
        }
      },
      { rootMargin: "0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, total]);

  return (
    <div className="space-y-10">
      {rails.slice(0, visibleCount).map((rail, index) => (
        <div
          key={rail.id}
          id={rail.id}
          // Only the lazily-revealed rails animate; the first paint stays instant.
          className={cn("scroll-mt-20", index >= INITIAL && "animate-rail-in")}
        >
          <TitleRow heading={rail.title} titles={rail.titles} />
        </div>
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Spinner className="size-7" />
        </div>
      )}
    </div>
  );
}
