"use client";

import Link from "next/link";
import { Suspense } from "react";
import { FilmIcon, MenuIcon } from "@/components/ui/icons";
import { SearchBar } from "@/components/catalog/SearchBar";
import { HeaderSearch } from "./HeaderSearch";

/** Sticky top bar: hamburger (toggles the sidebar), brand mark and search. */
export function SiteHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg text-foreground transition-colors hover:bg-surface-2"
        >
          <MenuIcon className="size-6" />
        </button>

        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Streamly — home"
        >
          <span className="grid size-9 place-items-center rounded-xl gradient-brand text-black">
            <FilmIcon className="size-5" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight sm:block">
            <span className="text-gradient">Stream</span>ly
          </span>
        </Link>

        {/* Search sits next to the brand */}
        <div className="max-w-lg flex-1">
          {/* Suspense keeps the rest of the page static while search reads the URL */}
          <Suspense fallback={<SearchBar value="" onChange={() => {}} />}>
            <HeaderSearch />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
