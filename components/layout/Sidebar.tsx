"use client";

import Link from "next/link";
import { Suspense, type ComponentType, type SVGProps } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/services/catalog";
import { CloseIcon, FilmIcon, PlayIcon, SparklesIcon, TvIcon } from "@/components/ui/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
interface NavItem {
  label: string;
  href: string;
  icon: Icon;
}

const BROWSE: NavItem[] = [
  { label: "Trending Now", href: "/", icon: SparklesIcon },
  { label: "Hollywood", href: "/?type=movie", icon: FilmIcon },
  { label: "Television Series", href: "/?type=series", icon: TvIcon },
  { label: "Animated", href: "/?category=Animation", icon: PlayIcon },
];

const GENRE_LINKS: NavItem[] = CATEGORIES.map((category) => ({
  label: category,
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

  const renderLink = ({ label, href, icon: Icon }: NavItem) => {
    const active = href === activeHref;
    return (
      <Link
        key={label}
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active ? "gradient-brand text-black" : "text-muted hover:bg-surface-2 hover:text-foreground",
        )}
      >
        <Icon className="size-5 shrink-0" />
        {label}
      </Link>
    );
  };

  return (
    <nav className="space-y-6">
      <div className="space-y-1">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted/70">Browse</p>
        {BROWSE.map(renderLink)}
      </div>
      <div className="space-y-1">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted/70">Genres</p>
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
  // On phones (overlay) selecting a destination closes the drawer; from tablet
  // up the sidebar is inline and stays open.
  const handleNavigate = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      onClose();
    }
  };

  return (
    <aside
      aria-label="Main navigation"
      aria-hidden={!open}
      className={cn(
        // Fixed and slides in/out. On phones it overlays the content; from
        // tablet up the content's margin (see AppShell) makes room beside it.
        "fixed bottom-0 left-0 top-16 z-20 w-64 border-r border-border bg-surface transition-transform duration-300 ease-out",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-full w-64 flex-col">
        {/* Phone-only close affordance (tablet & up use the header hamburger) */}
        <div className="flex h-12 items-center justify-between px-4 md:hidden">
          <span className="text-sm font-semibold text-muted">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <Suspense fallback={null}>
            <SidebarNav onNavigate={handleNavigate} />
          </Suspense>
        </div>
      </div>
    </aside>
  );
}
