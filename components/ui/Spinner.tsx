import { cn } from "@/lib/cn";

/**
 * Loading spinner: a spinning gradient ring (see `.loader-ring` in globals.css).
 * Default size is `size-8`, override with `className`.
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("loader-ring inline-block size-8 animate-spin", className)}
    />
  );
}
