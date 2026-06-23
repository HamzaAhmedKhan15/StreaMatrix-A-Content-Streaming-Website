"use client";

import { SearchIcon, CloseIcon } from "@/components/ui/icons";
import { BarsLoader } from "@/components/ui/BarsLoader";
import { useI18n } from "@/lib/i18n/I18nProvider";

/**
 * Controlled search input. Laid out with flexbox (icon · input · clear) so the
 * placeholder can never overlap the icon. Presentational only — the parent owns
 * the value, which keeps this reusable. When `loading` is set, the leading icon
 * is swapped for an animated three-bar "searching" indicator.
 */
export function SearchBar({
  value,
  onChange,
  loading = false,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  placeholder?: string;
}) {
  const { t } = useI18n();
  return (
    <div
      role="search"
      className="flex h-10 w-full items-center gap-2.5 rounded-full surface-card px-4 transition-colors focus-within:border-brand"
    >
      <SearchIcon className="size-4.5 shrink-0 text-muted" />
      <input
        type="text"
        inputMode="search"
        aria-label={t("search.aria")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? t("search.placeholder")}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
      />
      {/* Searching indicator sits at the right, just after the typed text */}
      {loading && <BarsLoader className="shrink-0" />}
      {value && (
        <button
          type="button"
          aria-label={t("search.clear")}
          onClick={() => onChange("")}
          className="shrink-0 cursor-pointer text-muted transition-colors hover:text-foreground"
        >
          <CloseIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
