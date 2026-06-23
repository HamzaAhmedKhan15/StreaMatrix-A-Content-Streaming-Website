/**
 * Public entrypoint for the catalog service.
 *
 * The rest of the app imports from `@/services/catalog` only — never from the
 * internal `data`/`catalog.service` files directly. This keeps the boundary
 * small and makes the implementation easy to replace.
 */
export { catalogService } from "./catalog.service";
export { filterTitles, sortTitles } from "./filter";
export { CATEGORIES } from "./types";
export type { Category, CatalogQuery, MediaType, Rail, SortOption, Title } from "./types";
export type { CastMember } from "@/lib/tmdb";
