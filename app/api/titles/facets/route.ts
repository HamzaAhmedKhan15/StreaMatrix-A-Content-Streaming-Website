import { catalogService } from "@/services/catalog";

/**
 * GET /api/titles/facets
 *
 * The values you can filter the catalog by, used for the header filter bar
 * dropdowns. Right now that's just the release years (genres are a fixed,
 * translatable set the client already knows about).
 */
export async function GET() {
  const years = await catalogService.getYears();
  return Response.json({ years });
}
