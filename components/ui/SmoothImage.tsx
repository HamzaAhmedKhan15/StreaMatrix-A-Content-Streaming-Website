"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * `next/image` that fades in smoothly once the real image has decoded.
 *
 * A shimmer placeholder sits on top while loading and fades out on `onLoad`,
 * so artwork never "pops" in and there's never a blank/gradient flash. The
 * image keeps native lazy-loading (unless `priority` is set), so off-screen
 * posters only download as they approach the viewport.
 *
 * Requires a positioned parent (used with `fill`, as everywhere in this app).
 */
export function SmoothImage({ className, onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Image
        {...props}
        alt={alt}
        className={className}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
      <span
        aria-hidden
        className={cn(
          "shimmer pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out",
          loaded && "opacity-0",
        )}
      />
    </>
  );
}
