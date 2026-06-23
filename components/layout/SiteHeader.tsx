"use client";

import Link from "next/link";
import { Suspense } from "react";
import { FilmIcon, MenuIcon } from "@/components/ui/icons";
import { SearchBar } from "@/components/catalog/SearchBar";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { HeaderSearch } from "./HeaderSearch";
import { FilterBar } from "./FilterBar";
import { LanguageSwitcher } from "./LanguageSwitcher";

/** Sticky top bar: hamburger (toggles the sidebar), brand mark, search and language. */
export function SiteHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={t("header.toggleMenu")}
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg text-foreground transition-colors hover:bg-surface-2"
        >
          <MenuIcon className="size-6" />
        </button>

        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`StreaMatrix — ${t("header.home")}`}
        >
          <span className="grid size-9 place-items-center rounded-xl gradient-brand text-black">
            <FilmIcon className="size-5" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight sm:block">
            <span className="text-gradient">Strea</span>Matrix
          </span>
        </Link>

        {/* Search sits next to the brand; min-w-0 lets it shrink on small screens */}
        <div className="min-w-0 max-w-lg flex-1">
          {/* Suspense keeps the rest of the page static while search reads the URL */}
          <Suspense fallback={<SearchBar value="" onChange={() => {}} />}>
            <HeaderSearch />
          </Suspense>
        </div>

        {/* Language selector pinned to the right end */}
        <LanguageSwitcher />
      </div>

      {/* Second row: stackable filters, pinned to the right end. Scrolls
          horizontally on narrow screens so the header keeps a fixed height
          (the sidebar is offset to match). */}
      <div className="no-scrollbar flex h-12 items-center justify-end gap-3 overflow-x-auto border-t border-border/60 px-3 sm:px-6">
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
      </div>
    </header>
  );
}
