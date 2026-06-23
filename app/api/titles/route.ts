/** @format */

import { catalogService, type MediaType, type SortOption } from "@/services/catalog";

const VALID_SORTS: SortOption[] = ["trending", "rating", "year", "name"];
const VALID_TYPES: MediaType[] = ["movie", "series"];

/**
 * GET /api/titles?search=&category=&type=&genre=&year=&sort=

 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const sortParam = searchParams.get("sort");
  const sort = VALID_SORTS.find((option) => option === sortParam);

  const typeParam = searchParams.get("type");
  const type = VALID_TYPES.find((option) => option === typeParam);

  const yearParam = searchParams.get("year");
  const year = yearParam && /^\d{4}$/.test(yearParam) ? Number(yearParam) : undefined;

  const results = await catalogService.query({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    type,
    genre: searchParams.get("genre") ?? undefined,
    year,
    sort,
  });

  return Response.json({ count: results.length, results });
}
