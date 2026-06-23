import type { CastMember } from "@/services/catalog";
import { SmoothImage } from "@/components/ui/SmoothImage";
import { getTranslator } from "@/lib/i18n/server";

/** Two-letter initials, used when an actor has no headshot. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const letters = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);
  return letters.toUpperCase();
}

/**
 * Scrollable cast list: headshot, actor name and character. Renders nothing
 * when there's no cast (like the bundled fallback data).
 */
export async function CastRow({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null;
  const { t } = await getTranslator();

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{t("detail.cast")}</h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:gap-4">
        {cast.map((person) => (
          <div key={person.id} className="w-28 shrink-0 sm:w-32">
            <div className="relative aspect-2/3 overflow-hidden rounded-xl surface-card">
              {person.profileUrl ? (
                <SmoothImage
                  src={person.profileUrl}
                  alt={person.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center bg-surface-2 text-xl font-semibold text-muted">
                  {initials(person.name)}
                </div>
              )}
            </div>
            <p className="mt-1.5 line-clamp-1 text-sm font-medium">{person.name}</p>
            {person.character && (
              <p className="line-clamp-1 text-xs text-muted">{person.character}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
