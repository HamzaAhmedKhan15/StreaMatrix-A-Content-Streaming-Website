/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import type { Rail } from "@/services/catalog";
import { cn } from "@/lib/cn";
import { TitleRow } from "./TitleRow";
import { Spinner } from "@/components/ui/Spinner";

// Show the first three rails immediately (Trending, Hollywood, Animated).
const INITIAL = 3;

/**
 * Renders the home rails a few at a time. The first 3 show right away, then a
 * loader at the bottom reveals more rails as it scrolls into view, each fading
 * in.
 */
export function LazyRails({ rails }: { rails: Rail[] }) {
  const [visibleCount, setVisibleCount] = useState(Math.min(INITIAL, rails.length));
  const sentinelRef = useRef<HTMLDivElement>(null);

  const total = rails.length;
  const hasMore = visibleCount < total;

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
      // Start loading a bit before the loader is fully visible.
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
          // Only the lazy rails animate, the first paint stays instant.
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
