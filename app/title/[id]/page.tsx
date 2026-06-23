import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogService } from "@/services/catalog";
import { TitlePlayer } from "@/components/player/TitlePlayer";
import { TitleRow } from "@/components/catalog/TitleRow";
import { CastRow } from "@/components/catalog/CastRow";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { formatRuntime } from "@/lib/format";
import { getTranslator } from "@/lib/i18n/server";

type DetailPageProps = { params: Promise<{ id: string }> };

/**
 * Pre-render a static page for every title at build time (SSG). Detail pages
 * don't depend on the request, so they can be fully static and CDN-cached.
 */
export async function generateStaticParams() {
  const ids = await catalogService.getAllIds();
  return ids.map((id) => ({ id }));
}

/** Per-title <title>/description for SEO and social sharing. */
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const title = await catalogService.getById(id);
  if (!title) return { title: "Title not found" };

  return {
    title: title.name,
    description: title.synopsis,
    openGraph: {
      title: title.name,
      description: title.synopsis,
      images: [title.backdropUrl],
    },
  };
}

export default async function TitleDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const title = await catalogService.getById(id);

  // Unknown id -> render the title-level not-found.tsx (404).
  if (!title) notFound();

  const [related, trailerKey, cast, { t }] = await Promise.all([
    catalogService.getRelated(id),
    catalogService.getTrailerKey(id),
    catalogService.getCast(id),
    getTranslator(),
  ]);

  return (
    <article className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        {t("detail.back")}
      </Link>

      {/* Trailer (YouTube) when available, else HLS stream — with resume tracking */}
      <TitlePlayer title={title} trailerKey={trailerKey} />

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">{title.category}</Badge>
          {title.genres.map((genre) => (
            <Badge key={genre}>{genre}</Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title.name}</h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <Rating value={title.rating} />
          <span>{title.year}</span>
          <span>{formatRuntime(title.durationMinutes)}</span>
          <Badge variant="outline">{title.maturity}</Badge>
        </div>

        <p className="max-w-3xl text-lg leading-relaxed text-foreground/90">{title.synopsis}</p>

        {title.cast.length > 0 && (
          <p className="text-sm text-muted">
            <span className="text-foreground">{t("detail.castLabel")}</span> {title.cast.join(", ")}
          </p>
        )}
      </header>

      <CastRow cast={cast} />

      <TitleRow heading={t("detail.moreLikeThis")} titles={related} />
    </article>
  );
}
