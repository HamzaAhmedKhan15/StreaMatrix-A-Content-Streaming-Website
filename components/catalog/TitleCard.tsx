import Link from "next/link";
import type { Title } from "@/services/catalog";
import { SmoothImage } from "@/components/ui/SmoothImage";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { PlayIcon } from "@/components/ui/icons";

/**
 * A single content card: poster, title and metadata, linking to the detail
 * page. `priority` should be set on the first row so the poster counts toward
 * LCP instead of being lazy-loaded.
 */
export function TitleCard({ title, priority = false }: { title: Title; priority?: boolean }) {
  return (
    <Link
      href={`/title/${title.id}`}
      className="group block rounded-xl focus:outline-none focus-visible:outline-none"
    >
      <article className="overflow-hidden rounded-xl surface-card transition-all duration-300 group-hover:-translate-y-1 group-hover:border-foreground/25 group-focus-visible:-translate-y-1 group-focus-visible:border-brand">
        <div className="relative aspect-2/3 overflow-hidden">
          <SmoothImage
            src={title.posterUrl}
            alt={`${title.name} poster`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
          {/* Bottom scrim keeps the category badge readable over any artwork */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

          {/* Play affordance revealed on hover/focus */}
          <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="grid size-12 place-items-center rounded-full gradient-brand text-black shadow-lg">
              <PlayIcon className="size-5" />
            </span>
          </div>

          <div className="absolute left-2 top-2">
            <Badge variant="brand">{title.category}</Badge>
          </div>
        </div>

        <div className="space-y-1.5 p-3">
          <h3 className="line-clamp-1 font-semibold">{title.name}</h3>
          <div className="flex items-center justify-between text-sm text-muted">
            <span>{title.year}</span>
            <Rating value={title.rating} />
          </div>
        </div>
      </article>
    </Link>
  );
}
