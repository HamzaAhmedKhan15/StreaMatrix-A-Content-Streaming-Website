/** @format */

import type { Title } from "@/services/catalog";
import { TitleCard } from "./TitleCard";

/**
 * Horizontally scrollable row of cards with a heading. Reused for "More like
 * this" and any other shelf-style listing. Renders nothing when empty.
 */
export function TitleRow({ heading, titles }: { heading: string; titles: Title[] }) {
  if (titles.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{heading}</h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:gap-4">
        {titles.map((title) => (
          <div key={title.id} className="w-36 shrink-0 sm:w-44">
            <TitleCard title={title} />
          </div>
        ))}
      </div>
    </section>
  );
}
