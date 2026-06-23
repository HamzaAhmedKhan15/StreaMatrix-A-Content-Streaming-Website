/**
 * TMDB (The Movie Database) client.
 *
 * Turns TMDB's "popular movies / popular TV" endpoints into our own `Title`
 * shape so the rest of the app keeps consuming the catalog service unchanged.
 * Real posters/backdrops come straight from TMDB's image CDN; everything the
 * popular lists don't provide (runtime, cast) gets a sensible default, and any
 * title missing artwork falls back to the locally-generated gradient so a card
 * is never blank.
 *
 * The API key is read from `TMDB_API_KEY` (server-only — see `.env.local`). If
 * it is missing or a request fails, `fetchTmdbCatalog` returns `[]` and the
 * caller falls back to the bundled mock catalog, so the app still builds/runs
 * offline and in CI.
 */

import { backdropArt, posterArt } from "@/lib/artwork";
import type { Category, MediaType, Title } from "@/services/catalog";

const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";
const POSTER_SIZE = "w500";
const BACKDROP_SIZE = "w1280";
const PROFILE_SIZE = "w185";

// How many pages (20 titles each) to pull from each list. 3 pages × 2 media
// types ≈ 120 titles, plenty to fill every rail.
const PAGES_PER_LIST = 3;

// Public HLS test streams — reused so the player always has something real to
// play (TMDB does not provide streams). Cycled across titles by index.
const STREAMS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
] as const;

/** TMDB genre id → our fixed catalog category. */
const GENRE_TO_CATEGORY: Record<number, Category> = {
  28: "Action", 12: "Action", 10759: "Action", // Action, Adventure, Action & Adventure
  16: "Animation",
  35: "Comedy",
  99: "Documentary",
  18: "Drama", 10749: "Drama", 10751: "Drama", 36: "Drama", 10402: "Drama", 10766: "Drama", 10768: "Drama",
  53: "Thriller", 80: "Thriller", 27: "Thriller", 9648: "Thriller", // Thriller, Crime, Horror, Mystery
  878: "Sci-Fi", 14: "Sci-Fi", 10765: "Sci-Fi", // Sci-Fi, Fantasy, Sci-Fi & Fantasy
};

/** TMDB genre id → display name (movie + TV lists merged; stable values). */
const GENRE_NAMES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

interface TmdbResult {
  id: number;
  title?: string; // movies
  name?: string; // tv
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
  release_date?: string; // movies
  first_air_date?: string; // tv
  adult?: boolean;
  original_language: string;
}

function img(path: string | null, size: string): string | null {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

function pickCategory(genreIds: number[]): Category {
  for (const id of genreIds) {
    const category = GENRE_TO_CATEGORY[id];
    if (category) return category;
  }
  return "Drama";
}

function pickGenres(genreIds: number[]): string[] {
  const names = genreIds.map((id) => GENRE_NAMES[id]).filter(Boolean) as string[];
  return names.length > 0 ? names.slice(0, 3) : ["Featured"];
}

function toTitle(result: TmdbResult, type: MediaType, index: number): Title {
  const name = (type === "movie" ? result.title : result.name) ?? "Untitled";
  const date = type === "movie" ? result.release_date : result.first_air_date;
  const year = date ? Number(date.slice(0, 4)) : new Date().getFullYear();
  const id = `${type}-${result.id}`;
  const art = { id, name, category: pickCategory(result.genre_ids) };

  const adult = Boolean(result.adult);
  return {
    id,
    name,
    type,
    category: art.category,
    genres: pickGenres(result.genre_ids),
    year: Number.isFinite(year) ? year : new Date().getFullYear(),
    rating: Math.round(result.vote_average * 10) / 10,
    maturity: type === "movie" ? (adult ? "R" : "PG-13") : adult ? "TV-MA" : "TV-14",
    // Runtime/episode length isn't in the list endpoints; use a typical value.
    durationMinutes: type === "movie" ? 120 : 45,
    synopsis: result.overview?.trim() || "No description available yet.",
    cast: [],
    posterUrl: img(result.poster_path, POSTER_SIZE) ?? posterArt(art),
    backdropUrl:
      img(result.backdrop_path, BACKDROP_SIZE) ?? img(result.poster_path, POSTER_SIZE) ?? backdropArt(art),
    streamUrl: STREAMS[index % STREAMS.length],
  };
}

async function fetchList(path: string, params: string, apiKey: string): Promise<TmdbResult[]> {
  const url = `${API_BASE}${path}?api_key=${apiKey}&language=en-US&${params}`;
  const res = await fetch(url, {
    // Cache the upstream response for a day; the catalog rarely changes.
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`TMDB ${path} (${params}) -> ${res.status}`);
  const data = (await res.json()) as { results?: TmdbResult[] };
  return data.results ?? [];
}

/**
 * Build the catalog from TMDB's popular movies and TV shows. Returns `[]` when
 * no API key is configured or the requests fail, so callers can fall back.
 */
export async function fetchTmdbCatalog(): Promise<Title[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.warn("[tmdb] TMDB_API_KEY is not set — using bundled fallback catalog.");
    return [];
  }

  const pages = Array.from({ length: PAGES_PER_LIST }, (_, i) => i + 1);
  // `discover` with `with_original_language=en` keeps the catalog to
  // English-language (Hollywood) movies + TV and animation, excluding anime
  // (ja), Bollywood (hi), Tamil/Telugu (ta/te) and other regional content.
  const movieParams = (page: number) =>
    `with_original_language=en&sort_by=popularity.desc&include_adult=false&vote_count.gte=150&page=${page}`;
  const tvParams = (page: number) =>
    `with_original_language=en&sort_by=popularity.desc&vote_count.gte=80&page=${page}`;

  const [movieLists, tvLists] = await Promise.all([
    Promise.all(pages.map((page) => fetchList("/discover/movie", movieParams(page), apiKey))),
    Promise.all(pages.map((page) => fetchList("/discover/tv", tvParams(page), apiKey))),
  ]);

  const titles: Title[] = [];
  const seen = new Set<string>();

  const collect = (lists: TmdbResult[][], type: MediaType) => {
    for (const list of lists) {
      for (const result of list) {
        // Require a poster so every card shows real artwork.
        if (!result.poster_path) continue;
        // Safety net in case the API returns a non-English item.
        if (result.original_language !== "en") continue;
        const title = toTitle(result, type, titles.length);
        if (seen.has(title.id)) continue;
        seen.add(title.id);
        titles.push(title);
      }
    }
  };

  collect(movieLists, "movie");
  collect(tvLists, "series");

  // Highlight the highest-rated movie on the home hero.
  const hero = titles
    .filter((t) => t.type === "movie")
    .sort((a, b) => b.rating - a.rating)[0];
  if (hero) hero.featured = true;

  return titles;
}

/** A billed actor, with their character and (optional) headshot. */
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

/**
 * The top-billed cast for a title, or `[]` when unavailable (no key, request
 * failure, or a non-TMDB id such as the bundled fallback data).
 */
export async function fetchCast(titleId: string, limit = 14): Promise<CastMember[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  const [prefix, rawId] = titleId.split("-");
  const path = prefix === "movie" ? "movie" : prefix === "series" ? "tv" : null;
  if (!path || !rawId || !/^\d+$/.test(rawId)) return [];

  try {
    const url = `${API_BASE}/${path}/${rawId}/credits?api_key=${apiKey}&language=en-US`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];

    const data = (await res.json()) as { cast?: TmdbCastMember[] };
    return (data.cast ?? [])
      .slice(0, limit)
      .map((person) => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profileUrl: img(person.profile_path, PROFILE_SIZE),
      }));
  } catch {
    return [];
  }
}

interface TmdbVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

/**
 * The YouTube key of the best available trailer for a title, or `null` if there
 * is none (or the id isn't a real TMDB title — e.g. the bundled fallback data).
 *
 * `titleId` is our catalog id, e.g. `movie-1234` / `series-5678`.
 */
export async function fetchTrailerKey(titleId: string): Promise<string | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const [prefix, rawId] = titleId.split("-");
  const path = prefix === "movie" ? "movie" : prefix === "series" ? "tv" : null;
  if (!path || !rawId || !/^\d+$/.test(rawId)) return null;

  try {
    const url = `${API_BASE}/${path}/${rawId}/videos?api_key=${apiKey}&language=en-US`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const data = (await res.json()) as { results?: TmdbVideo[] };
    const youtube = (data.results ?? []).filter((v) => v.site === "YouTube");
    const pick =
      youtube.find((v) => v.type === "Trailer" && v.official) ??
      youtube.find((v) => v.type === "Trailer") ??
      youtube.find((v) => v.type === "Teaser") ??
      youtube[0];

    return pick?.key ?? null;
  } catch {
    return null;
  }
}
