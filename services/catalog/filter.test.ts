import { describe, expect, it } from "vitest";
import { filterTitles, sortTitles } from "./filter";
import type { Title } from "./types";

/** Build a Title from a small set of fields; the rest get sensible defaults. */
function make(partial: Partial<Title> & Pick<Title, "id" | "name" | "category">): Title {
  return {
    type: "movie",
    genres: [],
    year: 2020,
    rating: 7,
    maturity: "PG",
    durationMinutes: 100,
    synopsis: "",
    cast: [],
    posterUrl: "",
    backdropUrl: "",
    streamUrl: "",
    ...partial,
  };
}

const titles: Title[] = [
  make({ id: "a", name: "Neon Horizon", type: "movie", category: "Sci-Fi", genres: ["Adventure"], rating: 8.7, year: 2024, featured: true }),
  make({ id: "b", name: "Iron Veil", type: "movie", category: "Action", genres: ["Spy"], rating: 7.9, year: 2023 }),
  make({ id: "c", name: "Paper Cranes", type: "series", category: "Drama", genres: ["Family"], rating: 8.4, year: 2022 }),
  make({ id: "d", name: "Cosmic Drift", type: "series", category: "Sci-Fi", genres: ["Drama"], rating: 8.0, year: 2021 }),
];

describe("filterTitles", () => {
  it("returns every title when the query is empty", () => {
    expect(filterTitles(titles)).toHaveLength(4);
  });

  it("matches by title name, case-insensitively", () => {
    expect(filterTitles(titles, { search: "NEON" }).map((t) => t.id)).toEqual(["a"]);
  });

  it("matches by genre", () => {
    expect(filterTitles(titles, { search: "spy" }).map((t) => t.id)).toEqual(["b"]);
  });

  it("filters by category", () => {
    expect(
      filterTitles(titles, { category: "Sci-Fi" })
        .map((t) => t.id)
        .sort(),
    ).toEqual(["a", "d"]);
  });

  it("treats category 'all' as no filter", () => {
    expect(filterTitles(titles, { category: "all" })).toHaveLength(4);
  });

  it("filters by media type", () => {
    expect(
      filterTitles(titles, { type: "series" })
        .map((t) => t.id)
        .sort(),
    ).toEqual(["c", "d"]);
  });

  it("combines search and category", () => {
    expect(filterTitles(titles, { search: "drift", category: "Sci-Fi" }).map((t) => t.id)).toEqual([
      "d",
    ]);
  });

  it("combines category and type", () => {
    expect(filterTitles(titles, { category: "Sci-Fi", type: "series" }).map((t) => t.id)).toEqual([
      "d",
    ]);
  });

  it("filters by genre matching the primary category", () => {
    expect(
      filterTitles(titles, { genre: "Sci-Fi" })
        .map((t) => t.id)
        .sort(),
    ).toEqual(["a", "d"]);
  });

  it("filters by genre matching the genres list", () => {
    // 'Drama' is c's category and also appears in d's genres list.
    expect(
      filterTitles(titles, { genre: "Drama" })
        .map((t) => t.id)
        .sort(),
    ).toEqual(["c", "d"]);
  });

  it("filters by year", () => {
    expect(filterTitles(titles, { year: 2024 }).map((t) => t.id)).toEqual(["a"]);
  });

  it("treats genre 'all' as no filter", () => {
    expect(filterTitles(titles, { genre: "all" })).toHaveLength(4);
  });

  it("combines genre and year", () => {
    expect(filterTitles(titles, { genre: "Sci-Fi", year: 2021 }).map((t) => t.id)).toEqual(["d"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterTitles(titles, { search: "zzzz" })).toEqual([]);
  });
});

describe("sortTitles", () => {
  it("sorts by rating, highest first", () => {
    expect(sortTitles(titles, "rating").map((t) => t.rating)).toEqual([8.7, 8.4, 8.0, 7.9]);
  });

  it("sorts by year, newest first", () => {
    expect(sortTitles(titles, "year").map((t) => t.year)).toEqual([2024, 2023, 2022, 2021]);
  });

  it("sorts by name alphabetically", () => {
    expect(sortTitles(titles, "name").map((t) => t.name)).toEqual([
      "Cosmic Drift",
      "Iron Veil",
      "Neon Horizon",
      "Paper Cranes",
    ]);
  });

  it("puts the featured title first when trending", () => {
    expect(sortTitles(titles, "trending")[0].id).toBe("a");
  });

  it("does not mutate the input array", () => {
    const input = [...titles];
    sortTitles(input, "rating");
    expect(input.map((t) => t.id)).toEqual(["a", "b", "c", "d"]);
  });
});
