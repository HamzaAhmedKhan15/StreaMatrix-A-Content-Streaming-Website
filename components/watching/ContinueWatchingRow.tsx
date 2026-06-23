"use client";

import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ContinueWatchingCard } from "./ContinueWatchingCard";

/**
 * "Continue watching" shelf for the home page. Reads from localStorage, so it
 * shows nothing until hydrated and nothing when the list is empty.
 */
export function ContinueWatchingRow() {
  const { items, remove } = useContinueWatching();
  const { t } = useI18n();

  // Empty during SSR and first paint, then fills in after hydration.
  if (items.length === 0) return null;

  return (
    <section className="space-y-3" aria-label={t("continue.heading")}>
      <h2 className="text-xl font-semibold">{t("continue.heading")}</h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:gap-4">
        {items.map((item) => (
          <div key={item.id} className="w-44 shrink-0 sm:w-52">
            <ContinueWatchingCard item={item} onRemove={() => remove(item.id)} />
          </div>
        ))}
      </div>
    </section>
  );
}
