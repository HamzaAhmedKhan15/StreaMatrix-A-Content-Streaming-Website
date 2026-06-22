import { cn } from "@/lib/cn";

/** Animated placeholder block. Compose several to build loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-lg", className)} />;
}
