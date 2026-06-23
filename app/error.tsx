"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertIcon } from "@/components/ui/icons";

/**
 * Error boundary for the home page. Has to be a Client Component.
 * Next 16 passes `unstable_retry`, but we also take `reset` so the retry
 * button works on older versions too.
 */
export default function HomeError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertIcon className="size-10 text-red-400" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-muted">We couldn’t load the catalog. Please try again.</p>
      </div>
      <Button onClick={() => retry?.()}>Try again</Button>
    </div>
  );
}
