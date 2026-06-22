import Link from "next/link";
import { FilmIcon } from "@/components/ui/icons";

const FOOTER_SECTIONS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Browse",
    links: [
      { label: "Trending", href: "/" },
      { label: "Hollywood", href: "/?type=movie" },
      { label: "Television Series", href: "/?type=series" },
      { label: "Animated", href: "/?category=Animation" },
    ],
  },
  {
    title: "Genres",
    links: [
      { label: "Action", href: "/?category=Action" },
      { label: "Sci-Fi", href: "/?category=Sci-Fi" },
      { label: "Drama", href: "/?category=Drama" },
      { label: "Thriller", href: "/?category=Thriller" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Documentaries", href: "/?category=Documentary" },
      { label: "Comedies", href: "/?category=Comedy" },
    ],
  },
];

/** Site footer with the brand and grouped navigation links. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-border/60">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl gradient-brand text-black">
                <FilmIcon className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-gradient">Stream</span>ly
              </span>
            </Link>
            <p className="text-sm text-muted">
              Your next favorite movie or series — just a search away.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-2.5">
                <p className="text-sm font-semibold">{section.title}</p>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Streamly — Stream more, search less.</p>
          <p>
            Crafted by <span className="text-gradient font-semibold">Hamza Ahmed Khan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
