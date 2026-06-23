import { fetchCast, fetchTrailerKey } from "@/lib/tmdb";
import { loadCatalog } from "./data";
import { filterTitles, sortTitles } from "./filter";
import {
  CATEGORIES,
  type CatalogQuery,
  type Category,
  type MediaType,
  type Rail,
  type Title,
} from "./types";

/**
 * Catalog service — the single boundary the rest of the app uses to read
 * content. UI never touches the raw dataset; it asks the service.
 *
 * Methods are `async` to model a real data source: swapping the mock data for a
 * database or HTTP API later would not change a single call site. The actual
 * filtering/sorting lives in `./filter` as pure functions so it can be reused
 * and unit-tested in isolation.
 */
export const catalogService = {
  /** List titles matching a search/category/type/sort query. */
  async query(query: CatalogQuery = {}): Promise<Title[]> {
    return filterTitles(await loadCatalog(), query);
  },

  /** Fetch a single title by id, or `null` if it does not exist. */
  async getById(id: string): Promise<Title | null> {
    const catalog = await loadCatalog();
    return catalog.find((title) => title.id === id) ?? null;
  },

  /** The YouTube key of a title's trailer, or `null` if none is available. */
  async getTrailerKey(id: string): Promise<string | null> {
    return fetchTrailerKey(id);
  },

  /** Top-billed cast for a title (empty if unavailable). */
  async getCast(id: string) {
    return fetchCast(id);
  },

  /** Ids of every title — handy for static generation of detail pages. */
  async getAllIds(): Promise<string[]> {
    const catalog = await loadCatalog();
    return catalog.map((title) => title.id);
  },

  /** The categories that actually have content, for the filter UI. */
  async getCategories(): Promise<Category[]> {
    const catalog = await loadCatalog();
    const present = new Set(catalog.map((title) => title.category));
    return CATEGORIES.filter((category) => present.has(category));
  },

  /** The distinct release years present in the catalog, newest first. */
  async getYears(): Promise<number[]> {
    const catalog = await loadCatalog();
    return [...new Set(catalog.map((title) => title.year))].sort((a, b) => b - a);
  },

  /** Other titles in the same category, excluding the given one. */
  async getRelated(id: string, limit = 8): Promise<Title[]> {
    const catalog = await loadCatalog();
    const title = catalog.find((entry) => entry.id === id);
    if (!title) return [];
    return catalog
      .filter((entry) => entry.id !== id && entry.category === title.category)
      .slice(0, limit);
  },

  /** The single hero title shown at the top of the home page. */
  async getFeatured(): Promise<Title | null> {
    const catalog = await loadCatalog();
    return catalog.find((title) => title.featured) ?? catalog[0] ?? null;
  },

  /**
   * The themed shelves shown on the home page. Each rail is just a filtered
   * slice of the catalog, so titles can appear in more than one rail.
   */
  async getRails(): Promise<Rail[]> {
    const catalog = await loadCatalog();
    const byCategory = (category: Category) => catalog.filter((t) => t.category === category);
    const byType = (type: MediaType) => catalog.filter((t) => t.type === type);

    const rails: Rail[] = [
      { id: "trending", title: "🔥 Trending Now", titles: sortTitles(catalog, "trending").slice(0, 12) },
      { id: "movies", title: "Hollywood", titles: byType("movie") },
      { id: "animated", title: "Animated", titles: byCategory("Animation") },
      { id: "series", title: "Television Series", titles: byType("series") },
      {
        id: "acclaimed",
        title: "Critically Acclaimed",
        titles: sortTitles(catalog.filter((t) => t.rating >= 8.3), "rating"),
      },
      { id: "sci-fi", title: "Sci-Fi & Beyond", titles: byCategory("Sci-Fi") },
      { id: "action", title: "Action & Adventure", titles: byCategory("Action") },
      { id: "thriller", title: "Edge of Your Seat", titles: byCategory("Thriller") },
      { id: "documentary", title: "Documentaries", titles: byCategory("Documentary") },
      { id: "comedy", title: "Comedies", titles: byCategory("Comedy") },
      { id: "drama", title: "Drama", titles: byCategory("Drama") },
    ];

    return rails.filter((rail) => rail.titles.length > 0);
  },
};
