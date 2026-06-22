"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { SiteHeader } from "./SiteHeader";
import { Sidebar } from "./Sidebar";
import { SiteFooter } from "./SiteFooter";
import { BackToTop } from "./BackToTop";

/**
 * Client shell that owns the sidebar state and lays out the app.
 *
 * The sidebar is fixed and slides in/out; the content's left margin animates in
 * step (`md:ml-64` ⇄ `md:ml-0`), so closing the sidebar slides the content
 * smoothly to the left instead of snapping wider. Pages stay Server Components,
 * passed in as `children`.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader onToggleSidebar={() => setSidebarOpen((open) => !open)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
