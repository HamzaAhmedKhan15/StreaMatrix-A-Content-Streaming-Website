"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Title } from "@/services/catalog";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { TitleGrid } from "./TitleGrid";
import { EmptyState } from "./EmptyState";
import { Spinner } from "@/components/ui/Spinner";

// Keep the loader on screen for at least this long so it always reads as a
// smooth, deliberate transition instead of a flicker (the in-memory query is
// near-instant otherwise).
const MIN_VISIBLE_MS = 1200;

/** Centered rotating loader shown while results are being fetched. */
function ResultsLoader() {
  return (
    <div className="grid min-h-[45vh] place-items-center">
      <Spinner className="size-10" />
    </div>
  );
}

/**
 * Client-side search results. Reads the query from the URL (kept in sync by the
 * header search), fetches matches from `/api/titles`, and shows a centered
 * spinner over the content area first — then fades the results in smoothly.
 * Stale in-flight requests are aborted so fast typing never flashes old data.
 *
 * Posters still lazy-load + fade in individually via TitleCard's SmoothImage.
 */
export function SearchResults() {
  const params = useSearchParams();
  const { t } = useI18n();
  const q = (params.get("q") ?? "").trim();
  const category = params.get("category") ?? "";
  const type = params.get("type") ?? "";
  const genre = params.get("genre") ?? "";
  const year = params.get("year") ?? "";

  // `data` is tagged with the query it belongs to; while it doesn't match the
  // current query we're still loading. Deriving `loading` this way avoids
  // calling setState synchronously inside the effect.
  const key = `${q}|${category}|${type}|${genre}|${year}`;
  const [data, setData] = useState<{ key: string; titles: Title[] } | null>(null);
  const loading = !data || data.key !== key;

  useEffect(() => {
    const currentKey = `${q}|${category}|${type}|${genre}|${year}`;
    const controller = new AbortController();
    const startedAt = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const commit = (titles: Title[]) => {
      const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
      timer = setTimeout(() => setData({ key: currentKey, titles }), remaining);
    };

    const query = new URLSearchParams();
    if (q) query.set("search", q);
    if (category) query.set("category", category);
    if (type) query.set("type", type);
    if (genre) query.set("genre", genre);
    if (year) query.set("year", year);

    fetch(`/api/titles?${query.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((result: { results?: Title[] }) => commit(result.results ?? []))
      .catch((error: unknown) => {
        // Ignore aborts from superseded requests; surface anything else as empty.
        if (!(error instanceof DOMException && error.name === "AbortError")) commit([]);
      });

    return () => {
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, [q, category, type, genre, year]);

  if (loading) return <ResultsLoader />;

  return (
    <div className="animate-rail-in space-y-6">
      <p className="text-muted" aria-live="polite">
        {data.titles.length} {data.titles.length === 1 ? t("count.one") : t("count.many")}
      </p>
      {data.titles.length > 0 ? <TitleGrid titles={data.titles} /> : <EmptyState query={q} />}
    </div>
  );
}
