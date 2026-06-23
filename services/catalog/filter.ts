import type { CatalogQuery, SortOption, Title } from "./types";

/**
 * Pure catalog logic. No data, no I/O, no framework.
 *
 * Keeping it in its own file lets the same logic get reused in three places
 * without copy-paste:
 *   1. the server `catalogService` (over the mock dataset),
 *   2. the client browser component (instant in-memory filtering), and
 *   3. the unit tests.
 */

/** Sort a list of titles. Defaults to "trending" (featured first, then rating). */
export function sortTitles(titles: Title[], sort: SortOption = "trending"): Title[] {
  const sorted = [...titles];
  switch (sort) {
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "year":
      return sorted.sort((a, b) => b.year - a.year);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "trending":
    default:
      return sorted.sort(
        (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.rating - a.rating,
      );
  }
}

/**
 * Filter titles by search text, category, type, genre and year, then sort the
 * result. Every criterion you pass must match (AND), so the filter bar can stack
 * things like genre + year to narrow the catalog down.
 */
export function filterTitles(titles: Title[], query: CatalogQuery = {}): Title[] {
  const search = query.search?.trim().toLowerCase() ?? "";
  const category =
    query.category && query.category.toLowerCase() !== "all" ? query.category.toLowerCase() : null;
  const type = query.type ?? null;
  const genre =
    query.genre && query.genre.toLowerCase() !== "all" ? query.genre.toLowerCase() : null;
  const year = query.year ?? null;

  const matched = titles.filter((title) => {
    const matchesSearch =
      !search ||
      title.name.toLowerCase().includes(search) ||
      title.genres.some((g) => g.toLowerCase().includes(search));

    const matchesCategory = !category || title.category.toLowerCase() === category;
    const matchesType = !type || title.type === type;
    const matchesGenre =
      !genre ||
      title.category.toLowerCase() === genre ||
      title.genres.some((g) => g.toLowerCase() === genre);
    const matchesYear = !year || title.year === year;

    return matchesSearch && matchesCategory && matchesType && matchesGenre && matchesYear;
  });

  return sortTitles(matched, query.sort);
}
