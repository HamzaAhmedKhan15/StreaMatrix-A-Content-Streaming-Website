"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { GlobeIcon, ChevronDownIcon } from "@/components/ui/icons";

/**
 * White globe button with a language dropdown. Picking a language switches the
 * whole UI (via the i18n cookie plus a router refresh). Closes on outside click
 * or Escape.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setOpen(false);
    if (next !== locale) setLocale(next);
  };

  return (
    <div ref={ref} className="relative ms-auto shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("lang.select")}
        className="flex h-10 cursor-pointer items-center gap-1 rounded-full px-2 text-white transition-colors hover:bg-surface-2"
      >
        <GlobeIcon className="size-5.5" />
        <ChevronDownIcon className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
        >
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={code === locale}
              onClick={() => choose(code)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors",
                code === locale
                  ? "bg-surface-2 font-semibold text-foreground"
                  : "text-muted hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <span>{LOCALE_LABELS[code]}</span>
              {code === locale && <span className="size-2 rounded-full gradient-brand" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
