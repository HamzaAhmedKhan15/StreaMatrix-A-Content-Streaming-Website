/**
 * Domain types for the catalog service.
 *
 * These just describe the shape of the data and stay free of any UI or framework
 * stuff, so the same types work in Server Components, the REST API, and tests.
 */

/** The fixed set of genres a title can belong to. */
export const CATEGORIES = [
  "Action",
  "Sci-Fi",
  "Drama",
  "Comedy",
  "Documentary",
  "Thriller",
  "Animation",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Whether a title is a film or an episodic series. */
export type MediaType = "movie" | "series";

/** A single piece of watchable content. */
export interface Title {
  /** URL-safe, stable identifier used as the detail route slug. */
  id: string;
  name: string;
  type: MediaType;
  category: Category;
  genres: string[];
  year: number;
  /** Audience rating out of 10. */
  rating: number;
  /** Maturity classification, e.g. "PG-13". */
  maturity: string;
  durationMinutes: number;
  synopsis: string;
  cast: string[];
  /** Portrait artwork (used on cards). */
  posterUrl: string;
  /** Landscape artwork (used on the hero and detail page). */
  backdropUrl: string;
  /** Public HLS (.m3u8) stream the player loads. */
  streamUrl: string;
  /** Highlighted on the home hero / sorted to the top of "trending". */
  featured?: boolean;
}

export type SortOption = "trending" | "rating" | "year" | "name";

/** Parameters accepted by `catalogService.query`. */
export interface CatalogQuery {
  /** Free-text search across title name and genres. */
  search?: string;
  /** Category name to filter by. `undefined` or "all" means no filter. */
  category?: string;
  /** Media type to filter by ("movie" | "series"). */
  type?: MediaType;
  /**
   * Genre to filter by. Matched against a title's primary category and its
   * `genres` list, so "Comedy" finds both Comedy-categorised titles and titles
   * that just list Comedy among their genres. `undefined`/"all" means no filter.
   */
  genre?: string;
  /** Release year to filter by. `undefined` means no year filter. */
  year?: number;
  sort?: SortOption;
}

/** A titled, horizontally-scrolling shelf of titles on the home page. */
export interface Rail {
  id: string;
  title: string;
  titles: Title[];
}
