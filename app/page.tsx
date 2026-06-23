import { Suspense } from "react";
import { catalogService, type MediaType } from "@/services/catalog";
import { Hero } from "@/components/catalog/Hero";
import { LazyRails } from "@/components/catalog/LazyRails";
import { SearchResults } from "@/components/catalog/SearchResults";
import { ContinueWatchingRow } from "@/components/watching/ContinueWatchingRow";
import { Spinner } from "@/components/ui/Spinner";
import { getTranslator } from "@/lib/i18n/server";
import type { MessageKey } from "@/lib/i18n/dictionaries";

type HomeProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: string;
    genre?: string;
    year?: string;
  }>;
};

type Translate = (key: MessageKey) => string;

/** Heading shown above a filtered/search result grid. */
function resultsHeading(t: Translate, q: string, category: string, type?: MediaType, genre = "") {
  if (q) return `${t("results.for")} “${q}”`;
  if (type === "movie") return t("nav.hollywood");
  if (type === "series") return t("nav.series");
  if (category === "Animation") return t("nav.animated");
  if (category) return t(`cat.${category}` as MessageKey);
  if (genre) return t(`cat.${genre}` as MessageKey);
  return t("browse.title");
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
  const genre = typeof sp.genre === "string" ? sp.genre : "";
  const year = typeof sp.year === "string" ? sp.year : "";

  const isFiltering = Boolean(q || category || type || genre || year);
  const { t } = await getTranslator();

  if (isFiltering) {
    return (
      <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {resultsHeading(t, q, category, type, genre)}
        </h1>
        <Suspense
          fallback={
            <div className="grid min-h-[45vh] place-items-center">
              <Spinner className="size-10" />
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </div>
    );
  }

  const [featured, rails] = await Promise.all([
    catalogService.getFeatured(),
    catalogService.getRails(),
  ]);

  // Translate each rail's heading by its id, falling back to the service title.
  const localizedRails = rails.map((rail) => ({
    ...rail,
    title: t(`rail.${rail.id}` as MessageKey) || rail.title,
  }));

  return (
    <div className="mx-auto max-w-screen-2xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
      {featured && <Hero title={featured} />}
      <ContinueWatchingRow />
      <LazyRails rails={localizedRails} />
    </div>
  );
}
