"use client";

import Link from "next/link";
import { FilmIcon } from "@/components/ui/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/dictionaries";

const FOOTER_SECTIONS: {
  titleKey: MessageKey;
  links: { labelKey: MessageKey; href: string }[];
}[] = [
  {
    titleKey: "nav.browse",
    links: [
      { labelKey: "nav.trending", href: "/" },
      { labelKey: "nav.hollywood", href: "/?type=movie" },
      { labelKey: "nav.series", href: "/?type=series" },
      { labelKey: "nav.animated", href: "/?category=Animation" },
    ],
  },
  {
    titleKey: "nav.genres",
    links: [
      { labelKey: "cat.Action", href: "/?category=Action" },
      { labelKey: "cat.Sci-Fi", href: "/?category=Sci-Fi" },
      { labelKey: "cat.Drama", href: "/?category=Drama" },
      { labelKey: "cat.Thriller", href: "/?category=Thriller" },
    ],
  },
  {
    titleKey: "footer.more",
    links: [
      { labelKey: "rail.documentary", href: "/?category=Documentary" },
      { labelKey: "rail.comedy", href: "/?category=Comedy" },
    ],
  },
];

/** Footer with the brand and grouped navigation links. */
export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-border/60">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs space-y-3 sm:max-w-md lg:max-w-lg">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl gradient-brand text-black">
                <FilmIcon className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-gradient">Strea</span>Matrix
              </span>
            </Link>
            <p className="text-sm text-muted">{t("footer.tagline")}</p>
            <p className="text-xs leading-relaxed text-muted/80">{t("footer.about")}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.titleKey} className="space-y-2.5">
                <p className="text-sm font-semibold">{t(section.titleKey)}</p>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.labelKey}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} StreaMatrix — {t("footer.copyright")}</p>
          <p>
            {t("footer.builtBy")} <span className="text-gradient font-semibold">Hamza Ahmed Khan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
