import { catalogService, type MediaType, type SortOption } from "@/services/catalog";

const VALID_SORTS: SortOption[] = ["trending", "rating", "year", "name"];
const VALID_TYPES: MediaType[] = ["movie", "series"];

/**
 * GET /api/titles?search=&category=&sort=
 *
 * The catalog service exposed as a small REST endpoint. Server Components call
 * the service directly (faster, no self-fetch), but publishing it as HTTP keeps
 * the data layer genuinely decoupled: a client widget — or a separate
 * service — could consume the exact same boundary.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const sortParam = searchParams.get("sort");
  const sort = VALID_SORTS.find((option) => option === sortParam);

  const typeParam = searchParams.get("type");
  const type = VALID_TYPES.find((option) => option === typeParam);

  const results = await catalogService.query({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    type,
    sort,
  });

  return Response.json({ count: results.length, results });
}
