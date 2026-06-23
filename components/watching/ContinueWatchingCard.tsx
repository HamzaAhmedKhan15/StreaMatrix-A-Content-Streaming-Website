import Link from "next/link";
import type { WatchProgress } from "@/lib/continueWatching";
import { SmoothImage } from "@/components/ui/SmoothImage";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { CloseIcon, PlayIcon } from "@/components/ui/icons";

/** Landscape card with a progress bar, used in the Continue watching row. */
export function ContinueWatchingCard({
  item,
  onRemove,
}: {
  item: WatchProgress;
  onRemove: () => void;
}) {
  const { t } = useI18n();
  const percent =
    item.durationSec > 0
      ? Math.min(100, Math.round((item.positionSec / item.durationSec) * 100))
      : 0;

  return (
    <div className="group relative">
      <Link href={`/title/${item.id}`} className="block overflow-hidden rounded-xl surface-card">
        <div className="relative aspect-video">
          <SmoothImage
            src={item.thumbnailUrl}
            alt={`${item.name} thumbnail`}
            fill
            sizes="(max-width: 640px) 45vw, 200px"
            className="object-cover"
          />
          <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="grid size-10 place-items-center rounded-full gradient-brand text-black">
              <PlayIcon className="size-5" />
            </span>
          </div>
          {/* Watch progress */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <div className="h-full gradient-brand" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="p-2.5">
          <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
          <p className="text-xs text-muted">
            {percent}% {t("continue.watched")}
          </p>
        </div>
      </Link>

      <button
        type="button"
        aria-label={t("continue.remove")}
        onClick={onRemove}
        className="absolute right-2 top-2 grid size-7 cursor-pointer place-items-center rounded-full bg-black/70 text-white opacity-0 transition hover:bg-black focus-visible:opacity-100 group-hover:opacity-100"
      >
        <CloseIcon className="size-4" />
      </button>
    </div>
  );
}
