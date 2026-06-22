/** Format a duration in minutes as a friendly "2h 18m" string. */
export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/** Always show one decimal place, e.g. 8 -> "8.0". */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** Format seconds as "m:ss" for the player / progress labels. */
export function formatTimecode(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
