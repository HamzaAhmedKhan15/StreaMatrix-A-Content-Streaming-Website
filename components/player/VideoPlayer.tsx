"use client";

import { useEffect, useRef, useState } from "react";
// `import type` is erased at build time, so importing hls.js here is SSR-safe;
// the actual library is only ever loaded inside the effect, on the client.
import type HlsInstance from "hls.js";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { AlertIcon } from "@/components/ui/icons";

type Status = "loading" | "ready" | "error";

export interface PlaybackProgress {
  positionSec: number;
  durationSec: number;
}

interface VideoPlayerProps {
  /** HLS (.m3u8) stream URL. */
  src: string;
  poster?: string;
  /** Used for the player's accessible label. */
  title?: string;
  /** Resume position in seconds, applied once the stream is ready. */
  startPositionSec?: number;
  /** Called (throttled) as playback advances, and on pause. */
  onProgress?: (progress: PlaybackProgress) => void;
  /** Called when playback reaches the end. */
  onEnded?: () => void;
}

/**
 * Reusable HLS video player.
 *
 * Strategy: prefer the browser's native HLS support (Safari/iOS) so those users
 * never download hls.js; otherwise lazy-load hls.js (Chrome, Firefox, Edge).
 * Loading, error and retry states are handled here so callers just pass a `src`.
 */
export function VideoPlayer({
  src,
  poster,
  title,
  startPositionSec = 0,
  onProgress,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  // Bumping this re-runs the setup effect, which is how "Retry" works.
  const [attempt, setAttempt] = useState(0);

  // Keep the latest callbacks in refs so the playback listeners don't need to
  // re-subscribe whenever the parent passes new function identities.
  const onProgressRef = useRef(onProgress);
  const onEndedRef = useRef(onEnded);
  const startRef = useRef(startPositionSec);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onEndedRef.current = onEnded;
    startRef.current = startPositionSec;
  });

  // Load and attach the HLS stream.
  useEffect(() => {
    if (!videoRef.current) return;
    // Capturing the non-null element in a const keeps it non-null inside the
    // nested closures below (TS resets guard-narrowing across function bounds).
    const media = videoRef.current;

    setStatus("loading");
    let hls: HlsInstance | null = null;
    let cancelled = false;

    const handleReady = () => {
      if (cancelled) return;
      if (startRef.current > 0 && startRef.current < media.duration) {
        media.currentTime = startRef.current;
      }
      setStatus("ready");
    };
    const handleNativeError = () => {
      if (!cancelled) setStatus("error");
    };

    async function setup() {
      // 1. Native HLS (Safari, iOS) — no extra JS needed.
      if (media.canPlayType("application/vnd.apple.mpegurl")) {
        media.src = src;
        media.addEventListener("loadedmetadata", handleReady);
        media.addEventListener("error", handleNativeError);
        return;
      }

      // 2. Everywhere else — load hls.js on demand.
      const { default: Hls } = await import("hls.js");
      if (cancelled) return;

      if (!Hls.isSupported()) {
        setStatus("error");
        return;
      }

      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(media);
      hls.on(Hls.Events.MANIFEST_PARSED, handleReady);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        // Only fatal errors are surfaced; hls.js recovers from the rest.
        if (data.fatal) setStatus("error");
      });
    }

    void setup();

    return () => {
      cancelled = true;
      hls?.destroy();
      media.removeEventListener("loadedmetadata", handleReady);
      media.removeEventListener("error", handleNativeError);
    };
  }, [src, attempt]);

  // Report playback progress (throttled) for the "Continue watching" feature.
  useEffect(() => {
    if (!videoRef.current) return;
    const media = videoRef.current;

    let lastReport = 0;
    const report = () => {
      if (!media.duration || Number.isNaN(media.duration)) return;
      onProgressRef.current?.({ positionSec: media.currentTime, durationSec: media.duration });
    };
    const onTimeUpdate = () => {
      const now = Date.now();
      if (now - lastReport > 5000) {
        lastReport = now;
        report();
      }
    };
    const onPause = () => report();
    const onEndedEvent = () => onEndedRef.current?.();

    media.addEventListener("timeupdate", onTimeUpdate);
    media.addEventListener("pause", onPause);
    media.addEventListener("ended", onEndedEvent);
    return () => {
      media.removeEventListener("timeupdate", onTimeUpdate);
      media.removeEventListener("pause", onPause);
      media.removeEventListener("ended", onEndedEvent);
    };
  }, []);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="size-full"
        aria-label={title ? `Video player: ${title}` : "Video player"}
      />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center bg-black/70">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-10" />
            <p className="text-sm text-muted">Loading stream…</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-black/85 p-6 text-center">
          <div className="flex max-w-sm flex-col items-center gap-3">
            <AlertIcon className="size-9 text-red-400" />
            <div className="space-y-1">
              <p className="font-semibold">This stream couldn’t be played</p>
              <p className="text-sm text-muted">
                The video source may be temporarily unavailable.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setAttempt((n) => n + 1)}>
              Try again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
