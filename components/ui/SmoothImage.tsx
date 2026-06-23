"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * `next/image` that fades in once the image has decoded.
 *
 * A shimmer sits on top while loading and fades out on `onLoad`, so artwork
 * never pops in and there's no blank flash. Keeps native lazy-loading unless
 * `priority` is set, so off-screen posters only download as you scroll near
 * them.
 *
 * Needs a positioned parent (used with `fill` everywhere in this app).
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
