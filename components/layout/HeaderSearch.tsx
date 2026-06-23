"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/catalog/SearchBar";

/**
 * Global search, living in the header. The URL is the source of truth: typing
 * pushes `/?q=...` (debounced), which the home page reads and renders results
 * for. Navigation happens in the change handler — never in an effect — so the
 * browser Back button is never fought.
 *
 * `searching` (the debounce window + the pending route transition) drives the
 * three-bar loader, so it shows from the first keystroke until results render.
 */
export function HeaderSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(() => params.get("q") ?? "");
  const [debouncing, setDebouncing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (next: string) => {
    setValue(next);
    setDebouncing(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDebouncing(false);
      const trimmed = next.trim();
      startTransition(() => {
        router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
      });
    }, 300);
  };

  return <SearchBar value={value} onChange={handleChange} loading={debouncing || isPending} />;
}
