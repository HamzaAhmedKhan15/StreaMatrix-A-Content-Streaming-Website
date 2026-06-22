import { formatRating } from "@/lib/format";
import { cn } from "@/lib/cn";
import { StarIcon } from "./icons";

/** Star icon + numeric rating, e.g. ★ 8.7. */
export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", className)}>
      <StarIcon className="size-4 text-brand-to" />
      <span>{formatRating(value)}</span>
    </span>
  );
}
