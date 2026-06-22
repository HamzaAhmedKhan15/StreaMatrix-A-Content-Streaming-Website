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
 * that a loader sits at the bottom and reveals more rails as it scrolls into
 * view, each fading in smoothly.
 */
export function LazyRails({ rails }: { rails: Rail[] }) {
  const [visibleCount, setVisibleCount] = useState(Math.min(INITIAL, rails.length));
  const sentinelRef = useRef<HTMLDivElement>(null);

  const total = rails.length;
  const hasMore = visibleCount < total;

  // Re-creating the observer whenever `visibleCount` changes is what makes this
  // reliable: a fresh IntersectionObserver always reports the sentinel's
  // *current* position on its next callback. So if the loader is still in view
  // after a rail appears (a short rail, or a tall viewport), it simply reveals
  // the next one too — instead of getting stuck waiting for a scroll event that
  // never comes, which was the old one-reveal-per-scroll bug.
  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + 1, total));
        }
      },
      // Start loading a bit before the loader is fully on screen.
      { rootMargin: "300px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, total, visibleCount]);

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
