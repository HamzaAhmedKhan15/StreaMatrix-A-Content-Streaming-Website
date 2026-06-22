import { catalogService, type MediaType } from "@/services/catalog";
import { Hero } from "@/components/catalog/Hero";
import { LazyRails } from "@/components/catalog/LazyRails";
import { TitleGrid } from "@/components/catalog/TitleGrid";
import { EmptyState } from "@/components/catalog/EmptyState";
import { ContinueWatchingRow } from "@/components/watching/ContinueWatchingRow";

type HomeProps = {
  searchParams: Promise<{ q?: string; category?: string; type?: string }>;
};

/** Heading shown above a filtered/search result grid. */
function resultsHeading(q: string, category: string, type?: MediaType) {
  if (q) return `Results for “${q}”`;
  if (type === "movie") return "Hollywood";
  if (type === "series") return "Television Series";
  if (category === "Animation") return "Animated";
  return category || "Browse";
}

/**
 * Home page (Server Component). Reads the URL: with a search/filter it renders a
 * results grid; otherwise it shows the hero, continue-watching, and the themed
 * rails. Reading `searchParams` makes this route server-rendered on demand.
 */
export default async function HomePage({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const type = sp.type === "movie" || sp.type === "series" ? sp.type : undefined;

  const isFiltering = Boolean(q || category || type);

  if (isFiltering) {
    const results = await catalogService.query({ search: q, category, type });
    return (
      <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{resultsHeading(q, category, type)}</h1>
          <p className="text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "title" : "titles"}
          </p>
        </div>
        {results.length > 0 ? <TitleGrid titles={results} /> : <EmptyState query={q} />}
      </div>
    );
  }

  const [featured, rails] = await Promise.all([
    catalogService.getFeatured(),
    catalogService.getRails(),
  ]);

  return (
    <div className="mx-auto max-w-screen-2xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
      {featured && <Hero title={featured} />}
      <ContinueWatchingRow />
      <LazyRails rails={rails} />
    </div>
  );
}
