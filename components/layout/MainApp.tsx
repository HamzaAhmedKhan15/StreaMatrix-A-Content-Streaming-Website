/** @format */

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
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

export function MainApp({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const sidebarOpen = userOpen ?? !isMobile;

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setUserOpen(null);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onToggleSidebar={() => setUserOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setUserOpen(false)} />

      <div
        className={cn(
          "flex flex-1 flex-col transition-[margin] duration-300 ease-out",
          sidebarOpen ? "md:ml-64" : "md:ml-0",
        )}
      >
        <main className="flex-1">{children}</main>
        <Footer />
      </div>

      <BackToTop />
    </div>
  );
}
