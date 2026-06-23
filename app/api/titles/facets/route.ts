import { catalogService } from "@/services/catalog";

/**
 * GET /api/titles/facets
 *
 * The distinct values the catalog can be filtered by, used to populate the
 * header filter bar's dropdowns (currently just the available release years —
 * genres are a fixed, translatable set the client already knows about).
 */
export async function GET() {
  const years = await catalogService.getYears();
  return Response.json({ years });
}
