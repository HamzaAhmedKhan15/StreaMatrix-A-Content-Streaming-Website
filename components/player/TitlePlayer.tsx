"use client";

import { useState } from "react";
import type { Title } from "@/services/catalog";
import { VideoPlayer } from "./VideoPlayer";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { getResumePosition } from "@/lib/continueWatching";

/**
 * Connects the generic VideoPlayer to the Continue-watching store for a
 * specific title: resumes from the last saved position and records progress as
 * it plays. Kept separate so VideoPlayer stays reusable and storage-agnostic.
 */
export function TitlePlayer({ title }: { title: Title }) {
  const { record } = useContinueWatching();
  // Read the saved resume position once on mount (client only).
  const [startPositionSec] = useState(() => getResumePosition(title.id));

  return (
    <VideoPlayer
      src={title.streamUrl}
      poster={title.backdropUrl}
      title={title.name}
      startPositionSec={startPositionSec}
      onProgress={({ positionSec, durationSec }) =>
        record({
          id: title.id,
          name: title.name,
          thumbnailUrl: title.backdropUrl,
          positionSec,
          durationSec,
        })
      }
    />
  );
}
