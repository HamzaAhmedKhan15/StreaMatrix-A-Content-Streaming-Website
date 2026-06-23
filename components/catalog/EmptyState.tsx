"use client";

import { SearchIcon } from "@/components/ui/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** Shown when a search/filter combination returns no titles. */
export function EmptyState({ query }: { query?: string }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl surface-card py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-surface-2 text-muted">
        <SearchIcon className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="text-lg font-semibold">{t("empty.title")}</p>
        <p className="text-sm text-muted">
          {query ? (
            <>
              {t("empty.nothingMatches")} <span className="text-foreground">“{query}”</span>.{" "}
              {t("empty.tryDifferent")}
            </>
          ) : (
            t("empty.tryDifferent")
          )}
        </p>
      </div>
    </div>
  );
}
