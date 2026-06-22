import Image from "next/image";
import Link from "next/link";
import type { Title } from "@/services/catalog";
import { buttonStyles } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { PlayIcon } from "@/components/ui/icons";
import { formatRuntime } from "@/lib/format";

/**
 * Cinematic banner for the featured title.
 *
 * The backdrop is an absolutely-positioned background and the content sits in
 * normal flow with a responsive `min-height`. This way the section grows to fit
 * its content on small screens (nothing is ever clipped), while keeping the
 * tall cinematic look on larger ones.
 */
export function Hero({ title }: { title: Title }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border">
      {/* Backdrop fills the section, which is sized by its content */}
      <div className="absolute inset-0">
        <Image src={title.backdropUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/10" />
        <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/40 to-transparent" />
      </div>

      <div className="relative flex min-h-88 flex-col justify-end p-5 sm:min-h-96 sm:p-8 md:min-h-112 md:justify-center md:p-12">
        <div className="max-w-xl space-y-3 sm:space-y-4">
          <Badge variant="brand">Featured</Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title.name}</h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <Rating value={title.rating} />
            <span>{title.year}</span>
            <span>{formatRuntime(title.durationMinutes)}</span>
            <Badge variant="outline">{title.maturity}</Badge>
          </div>

          <p className="line-clamp-2 text-sm text-muted sm:line-clamp-3 sm:text-base md:text-lg">
            {title.synopsis}
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={`/title/${title.id}`}
              className={buttonStyles({ variant: "primary", size: "lg" })}
            >
              <PlayIcon className="size-5" />
              Play now
            </Link>
            <Link
              href={`/title/${title.id}`}
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              More info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
