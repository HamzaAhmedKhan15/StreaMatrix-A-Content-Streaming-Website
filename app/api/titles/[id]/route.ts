import { catalogService } from "@/services/catalog";

/**
 * GET /api/titles/:id
 *
 * Returns a single title, or a 404 JSON payload when the id is unknown.
 */
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const title = await catalogService.getById(id);

  if (!title) {
    return Response.json({ error: `No title found for id "${id}"` }, { status: 404 });
  }

  return Response.json(title);
}
