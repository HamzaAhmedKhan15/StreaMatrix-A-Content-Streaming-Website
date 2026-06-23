import type { Title } from "@/services/catalog";
import { TitleCard } from "./TitleCard";

/** Responsive grid of content cards, 2 columns up to 5. */
export function TitleGrid({ titles }: { titles: Title[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {titles.map((title, index) => (
        // First row loads eagerly to help LCP.
        <TitleCard key={title.id} title={title} priority={index < 5} />
      ))}
    </div>
  );
}
