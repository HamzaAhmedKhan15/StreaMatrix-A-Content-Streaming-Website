"use client";

import Link from "next/link";
import { Suspense, type ComponentType, type SVGProps } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/services/catalog";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/dictionaries";
import { buttonStyles } from "@/components/ui/Button";
import { CloseIcon, FilmIcon, PlayIcon, SparklesIcon, TvIcon } from "@/components/ui/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
interface NavItem {
  labelKey: MessageKey;
  href: string;
  icon: Icon;
}

const BROWSE: NavItem[] = [
  { labelKey: "nav.trending", href: "/", icon: SparklesIcon },
  { labelKey: "nav.hollywood", href: "/?type=movie", icon: FilmIcon },
  { labelKey: "nav.series", href: "/?type=series", icon: TvIcon },
  { labelKey: "nav.animated", href: "/?category=Animation", icon: PlayIcon },
];

const GENRE_LINKS: NavItem[] = CATEGORIES.map((category) => ({
  labelKey: `cat.${category}` as MessageKey,
  href: `/?category=${encodeURIComponent(category)}`,
  icon: PlayIcon,
}));

/** Which nav href is currently active, based on the URL. */
function useActiveHref(): string | null {
  const pathname = usePathname();
  const params = useSearchParams();
  if (pathname !== "/") return null;

  if (params.get("q")) return null;
  const type = params.get("type");
  const category = params.get("category");

  if (type === "movie") return "/?type=movie";
  if (type === "series") return "/?type=series";
  if (category) return `/?category=${encodeURIComponent(category)}`;
  return "/";
}

function SidebarNav({ onNavigate }: { onNavigate: () => void }) {
  const activeHref = useActiveHref();
  const { t } = useI18n();

  const renderLink = ({ labelKey, href, icon: Icon }: NavItem) => {
    const active = href === activeHref;
    return (
      <Link
        key={labelKey}
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active ? "bg-foreground/10" : "text-muted hover:bg-surface-2 hover:text-foreground",
        )}
      >
        {/* Active: brand-tinted icon + gradient label (text-gradient makes its
            own color transparent, so it can't be on the icon's stroke). */}
        <Icon className={cn("size-5 shrink-0", active && "text-brand")} />
        <span className={cn(active && "text-gradient")}>{t(labelKey)}</span>
      </Link>
    );
  };

  return (
    <nav className="space-y-6">
      <div className="space-y-1">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted/70">
          {t("nav.browse")}
        </p>
        {BROWSE.map(renderLink)}
      </div>
      <div className="space-y-1">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted/70">
          {t("nav.genres")}
        </p>
        {GENRE_LINKS.map(renderLink)}
      </div>
    </nav>
  );
}

/**
 * Navigation sidebar. On desktop it sits in the flow under the header and
 * collapses by width (pushing content). On mobile it slides in as an overlay
 * (no backdrop, so the page stays visible). Toggled by the header hamburger.
 */
export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  // On phones (overlay) selecting a destination closes the drawer; from tablet
  // up the sidebar is inline and stays open.
  const handleNavigate = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      onClose();
    }
  };

  return (
    <aside
      aria-label={t("nav.menu")}
      aria-hidden={!open}
      className={cn(
        // Fixed and slides in/out. On phones it overlays the content; from
        // tablet up the content's margin (see AppShell) makes room beside it.
        // `top-28` clears the two-row header (search + filter bar) above it.
        "fixed bottom-0 left-0 top-28 z-20 w-64 border-r border-border bg-surface transition-transform duration-300 ease-out",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-full w-64 flex-col">
        {/* Phone-only close affordance (tablet & up use the header hamburger) */}
        <div className="flex h-12 items-center justify-between px-4 md:hidden">
          <span className="text-sm font-semibold text-muted">{t("nav.menu")}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("nav.close")}
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="sidebar-scroll flex-1 overflow-y-auto p-3">
          <Suspense fallback={null}>
            <SidebarNav onNavigate={handleNavigate} />
          </Suspense>
        </div>

        {/* Pinned subscription promo — stays fixed at the bottom of the sidebar,
            above the page footer, while the nav above it scrolls. */}
        <div className="shrink-0 border-t border-border/60 p-3">
          <div className="space-y-2.5 rounded-xl border border-brand/30 bg-surface-2/60 p-3.5">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg gradient-brand text-black">
                <SparklesIcon className="size-4" />
              </span>
              <p className="text-sm font-semibold">{t("subscribe.promoTitle")}</p>
            </div>
            <p className="text-xs leading-relaxed text-muted">{t("subscribe.pitch")}</p>
            <Link
              href="/subscribe"
              onClick={handleNavigate}
              className={buttonStyles({ variant: "primary", size: "sm", className: "w-full" })}
            >
              {t("subscribe.cta")}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
