"use client";

import { useState } from "react";
import type { Title } from "@/services/catalog";
import { VideoPlayer } from "./VideoPlayer";
import { TrailerPlayer } from "./TrailerPlayer";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { getResumePosition } from "@/lib/continueWatching";

/**
 * Wires the player to the Continue-watching store for one title. It resumes
 * from the last saved spot and saves progress as it plays.
 *
 * Uses the YouTube trailer when there is one, otherwise the HLS stream. Both
 * players share the same progress/resume props so storage works the same way.
 */
export function TitlePlayer({ title, trailerKey }: { title: Title; trailerKey?: string | null }) {
  const { record } = useContinueWatching();
  // Grab the saved resume position once on mount (client only).
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
