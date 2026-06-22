"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/catalog/SearchBar";

/**
 * Global search, living in the header. The URL is the source of truth: typing
 * pushes `/?q=...` (debounced), which the home page reads and renders results
 * for. Navigation happens in the change handler — never in an effect — so the
 * browser Back button is never fought.
 */
export function HeaderSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(() => params.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (next: string) => {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const trimmed = next.trim();
      router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
    }, 300);
  };

  return (
    <SearchBar value={value} onChange={handleChange} placeholder="Search movies, series, genres…" />
  );
}
