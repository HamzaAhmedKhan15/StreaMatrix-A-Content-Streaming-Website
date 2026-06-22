import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "outline" | "brand";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-surface-2 text-muted border border-border",
  outline: "border border-border text-foreground/80",
  brand: "gradient-brand text-black font-semibold border-none",
};

/** Small pill used for categories, genres, maturity ratings, etc. */
export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
