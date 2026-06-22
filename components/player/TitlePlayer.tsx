"use client";

import { useState } from "react";
import type { Title } from "@/services/catalog";
import { VideoPlayer } from "./VideoPlayer";
import { TrailerPlayer } from "./TrailerPlayer";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { getResumePosition } from "@/lib/continueWatching";

/**
 * Connects the player to the Continue-watching store for a specific title:
 * resumes from the last saved position and records progress as it plays.
 *
 * Prefers the title's YouTube trailer (`trailerKey`) when one is available, and
 * falls back to the HLS stream otherwise. Both players share the same
 * progress/resume interface so storage works identically either way.
 */
export function TitlePlayer({ title, trailerKey }: { title: Title; trailerKey?: string | null }) {
  const { record } = useContinueWatching();
  // Read the saved resume position once on mount (client only).
  const [startPositionSec] = useState(() => getResumePosition(title.id));

  const onProgress = ({ positionSec, durationSec }: { positionSec: number; durationSec: number }) =>
    record({
      id: title.id,
      name: title.name,
      thumbnailUrl: title.backdropUrl,
      positionSec,
      durationSec,
    });

  if (trailerKey) {
    return (
      <TrailerPlayer
        videoId={trailerKey}
        title={title.name}
        startPositionSec={startPositionSec}
        onProgress={onProgress}
      />
    );
  }

  return (
    <VideoPlayer
      src={title.streamUrl}
      poster={title.backdropUrl}
      title={title.name}
      startPositionSec={startPositionSec}
      onProgress={onProgress}
    />
  );
}
