"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/services/catalog";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/dictionaries";
import { ChevronDownIcon, CloseIcon, FilterIcon } from "@/components/ui/icons";

/**
 * Header filter bar. Three dropdowns — Category (movie/series/animated), Genre
 * and Year — that all write to the URL query string, so they stack: choosing
 * `genre=Action` + `year=2025` narrows the home grid to titles matching both.
 *
 * The URL is the single source of truth (matching `HeaderSearch`): each select
 * reads its value from `useSearchParams` and a change pushes a merged query, so
 * the Back button, the server page and `SearchResults` all stay in sync. Years
 * are pulled from `/api/titles/facets` so only years that actually have content
 * are offered; genres are the fixed, translatable catalog set.
 */
export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();
  const [years, setYears] = useState<number[]>([]);
  const [, startTransition] = useTransition();

  const type = params.get("type") ?? "";
  const category = params.get("category") ?? "";
  const genre = params.get("genre") ?? "";
  const year = params.get("year") ?? "";

  // The Category dropdown is a view over the existing `type`/`category` params:
  // movies/series map to `type`, while "animated" is the Animation category.
  const categoryValue =
    type === "movie" ? "movie" : type === "series" ? "series" : category === "Animation" ? "animated" : "";

  const hasFilters = Boolean(type || category || genre || year);

  // Load the set of years present in the catalog for the Year dropdown.
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/titles/facets", { signal: controller.signal })
      .then((res) => res.json())
      .then((data: { years?: number[] }) => setYears(data.years ?? []))
      .catch(() => {
        /* Leave the Year dropdown empty if facets can't be loaded. */
      });
    return () => controller.abort();
  }, []);

  /** Merge a mutation into the current query and navigate to the result. */
  const apply = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    const qs = next.toString();
    startTransition(() => router.push(qs ? `/?${qs}` : "/"));
  };

  const onCategory = (value: string) =>
    apply((next) => {
      next.delete("type");
      next.delete("category");
      if (value === "movie") next.set("type", "movie");
      else if (value === "series") next.set("type", "series");
      else if (value === "animated") next.set("category", "Animation");
    });

  const onGenre = (value: string) =>
    apply((next) => (value ? next.set("genre", value) : next.delete("genre")));

  const onYear = (value: string) =>
    apply((next) => (value ? next.set("year", value) : next.delete("year")));

  const clearAll = () =>
    apply((next) => {
      next.delete("type");
      next.delete("category");
      next.delete("genre");
      next.delete("year");
    });

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
      {/* Sliders icon, always shown to the left of the label. On phones it
          stands alone (label hidden); from sm up the text sits beside it.
          Decorative — each select carries its own aria-label. */}
      <FilterIcon className="size-5 shrink-0 text-muted" />
      <span className="hidden shrink-0 text-sm font-medium text-muted sm:inline">
        {t("filter.by")}
      </span>

      <FilterSelect ariaLabel={t("filter.category")} value={categoryValue} onChange={onCategory}>
        <option value="">{t("filter.category")}</option>
        <option value="movie">{t("filter.movies")}</option>
        <option value="series">{t("filter.series")}</option>
        <option value="animated">{t("filter.animated")}</option>
      </FilterSelect>

      <FilterSelect ariaLabel={t("filter.genre")} value={genre} onChange={onGenre}>
        <option value="">{t("filter.genre")}</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {t(`cat.${cat}` as MessageKey)}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect ariaLabel={t("filter.year")} value={year} onChange={onYear}>
        <option value="">{t("filter.year")}</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </FilterSelect>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <CloseIcon className="size-3.5" />
          <span className="hidden sm:inline">{t("filter.clear")}</span>
        </button>
      )}
    </div>
  );
}

/** A compact, dark-themed wrapper around a native <select> with a chevron. */
function FilterSelect({
  ariaLabel,
  value,
  onChange,
  children,
}: {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative min-w-0 flex-1 sm:flex-none">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          // Full-width on phones (selects share the row); natural width from sm up.
          "h-9 w-full cursor-pointer appearance-none truncate rounded-lg surface-card ps-3 pe-8 text-sm text-foreground outline-none transition-colors hover:border-brand/60 focus-visible:border-brand sm:w-auto",
          // A set filter reads as active via the brand tint.
          value ? "border-brand/60 text-foreground" : "text-muted",
        )}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute end-2 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
