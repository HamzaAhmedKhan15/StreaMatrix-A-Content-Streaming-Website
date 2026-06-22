import { cn } from "@/lib/cn";

/**
 * Three vertical bars that pulse like an equalizer. Used as a compact "working"
 * indicator (e.g. while a search is in flight). Sized to sit inline next to
 * text/icons; animation lives in globals.css (`.bars-loader-bar`).
 */
export function BarsLoader({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Searching"
      className={cn("inline-flex h-4.5 items-end gap-0.5", className)}
    >
      {[0, 1, 2].map((index) => (
        <span key={index} className="bars-loader-bar" style={{ animationDelay: `${index * 0.15}s` }} />
      ))}
    </span>
  );
}
