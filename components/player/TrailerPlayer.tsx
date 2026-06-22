"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { AlertIcon } from "@/components/ui/icons";
import type { PlaybackProgress } from "./VideoPlayer";

type Status = "loading" | "ready" | "error";

interface TrailerPlayerProps {
  /** YouTube video id of the trailer. */
  videoId: string;
  /** Used for the player's accessible label. */
  title?: string;
  /** Resume position in seconds, applied once the trailer is ready. */
  startPositionSec?: number;
  /** Called (throttled) as playback advances. */
  onProgress?: (progress: PlaybackProgress) => void;
  /** Called when the trailer reaches the end. */
  onEnded?: () => void;
}

// Minimal typings for the slice of the YouTube IFrame API we use, so we avoid
// pulling in @types/youtube for a couple of methods.
type YTPlayer = {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};
type YTPlayerEvent = { target: YTPlayer; data: number };
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: YTPlayerEvent) => void;
        onStateChange?: (event: YTPlayerEvent) => void;
        onError?: (event: YTPlayerEvent) => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// YouTube player states we care about.
const ENDED = 0;
const PLAYING = 1;

// Load the IFrame API script once and resolve when it's ready.
let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise<YTNamespace>((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        if (window.YT) resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
  }
  return apiPromise;
}

/**
 * Plays a title's trailer via the YouTube IFrame API. It mirrors VideoPlayer's
 * `onProgress` / `startPositionSec` interface so the Continue-watching store
 * works exactly the same whether the source is a trailer or an HLS stream.
 */
export function TrailerPlayer({
  videoId,
  title,
  startPositionSec = 0,
  onProgress,
  onEnded,
}: TrailerPlayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  // Bumping this re-runs the setup effect, which is how "Retry" works.
  const [attempt, setAttempt] = useState(0);

  const onProgressRef = useRef(onProgress);
  const onEndedRef = useRef(onEnded);
  const startRef = useRef(startPositionSec);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onEndedRef.current = onEnded;
    startRef.current = startPositionSec;
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    setStatus("loading");
    let cancelled = false;
    let player: YTPlayer | null = null;
    let interval: number | undefined;
    // YT replaces its target node with an iframe, so give it a throwaway child
    // and leave React's own div untouched.
    const host = document.createElement("div");
    wrap.appendChild(host);

    const stopPolling = () => {
      if (interval !== undefined) window.clearInterval(interval);
      interval = undefined;
    };
    const report = () => {
      if (!player) return;
      const durationSec = player.getDuration();
      if (durationSec > 0) {
        onProgressRef.current?.({ positionSec: player.getCurrentTime(), durationSec });
      }
    };

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        player = new YT.Player(host, {
          videoId,
          width: "100%",
          height: "100%",
          host: "https://www.youtube-nocookie.com",
          playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              if (startRef.current > 0) event.target.seekTo(startRef.current, true);
              setStatus("ready");
            },
            onStateChange: (event) => {
              if (event.data === PLAYING) {
                stopPolling();
                interval = window.setInterval(report, 5000);
              } else {
                stopPolling();
                report();
                if (event.data === ENDED) onEndedRef.current?.();
              }
            },
            onError: () => {
              if (!cancelled) setStatus("error");
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      stopPolling();
      player?.destroy();
      host.remove();
    };
  }, [videoId, attempt]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
      <div
        ref={wrapRef}
        className="size-full [&>iframe]:size-full"
        aria-label={title ? `Trailer: ${title}` : "Trailer"}
      />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center bg-black/70">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-10" />
            <p className="text-sm text-muted">Loading trailer…</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-black/85 p-6 text-center">
          <div className="flex max-w-sm flex-col items-center gap-3">
            <AlertIcon className="size-9 text-red-400" />
            <div className="space-y-1">
              <p className="font-semibold">This trailer couldn’t be played</p>
              <p className="text-sm text-muted">The trailer may be unavailable in your region.</p>
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
