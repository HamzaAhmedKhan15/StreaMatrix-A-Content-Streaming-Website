"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { SiteHeader } from "./SiteHeader";
import { Sidebar } from "./Sidebar";
import { SiteFooter } from "./SiteFooter";
import { BackToTop } from "./BackToTop";

const MOBILE_QUERY = "(max-width: 767px)";

/** Tracks whether the viewport is mobile-sized, kept in sync with `matchMedia`. */
function useIsMobile(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(MOBILE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false, // Server snapshot: assume desktop (sidebar open).
  );
}

/**
 * Client shell that owns the sidebar state and lays out the app.
 *
 * The sidebar is fixed and slides in/out; the content's left margin animates in
 * step (`md:ml-64` ⇄ `md:ml-0`), so closing the sidebar slides the content
 * smoothly to the left instead of snapping wider. Pages stay Server Components,
 * passed in as `children`.
 *
 * The sidebar auto-collapses on mobile: its open state is derived from the
 * viewport unless the user has explicitly toggled it (`userOpen`), so a phone
 * never loads with the menu covering the page. Crossing the mobile⇄desktop
 * breakpoint clears that manual override, so resizing back up to a laptop view
 * re-opens the sidebar automatically (and resizing down collapses it).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const sidebarOpen = userOpen ?? !isMobile;

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    // On every breakpoint crossing, drop the manual choice so the sidebar
    // follows the viewport default again (open on desktop, collapsed on mobile).
    const onChange = () => setUserOpen(null);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader onToggleSidebar={() => setUserOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setUserOpen(false)} />

      <div
        className={cn(
          "flex flex-1 flex-col transition-[margin] duration-300 ease-out",
          sidebarOpen ? "md:ml-64" : "md:ml-0",
        )}
      >
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>

      <BackToTop />
    </div>
  );
}
