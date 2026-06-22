import { backdropArt, posterArt } from "@/lib/artwork";
import type { MediaType } from "./types";
import type { Title } from "./types";

/**
 * In-memory catalog — the "database" behind the catalog service.
 *
 * Using local mock data keeps the app self-contained: no API keys, no rate
 * limits, and it works offline and in CI. Because everything goes through the
 * service layer, this module could later be swapped for a real database or a
 * TMDB client without touching any UI code.
 */

// A handful of well-known, reliable public HLS test streams. Each title points
// at one of these so the player always has something real to play.
const STREAMS = {
  bunny: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  tears: "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  bipbop:
    "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8",
  shift: "https://test-streams.mux.dev/pts_shift/master.m3u8",
} as const;

/** Builder: fills in derived artwork/stream URLs so each entry stays compact. */
type Seed = Omit<Title, "posterUrl" | "backdropUrl" | "streamUrl"> & { stream: keyof typeof STREAMS };

function build({ stream, ...rest }: Seed): Title {
  return {
    ...rest,
    posterUrl: posterArt(rest),
    backdropUrl: backdropArt(rest),
    streamUrl: STREAMS[stream],
  };
}

const movie: MediaType = "movie";
const series: MediaType = "series";

export const CATALOG: Title[] = [
  build({ id: "neon-horizon", name: "Neon Horizon", type: movie, category: "Sci-Fi", genres: ["Sci-Fi", "Adventure", "Mystery"], year: 2024, rating: 8.7, maturity: "PG-13", durationMinutes: 138, synopsis: "A deep-space salvage crew intercepts a decades-old distress signal and uncovers a secret that rewrites humanity's map of the galaxy.", cast: ["Mara Quinn", "Devon Aoki", "Idris Calloway"], stream: "bunny", featured: true }),
  build({ id: "the-last-signal", name: "The Last Signal", type: movie, category: "Thriller", genres: ["Thriller", "Mystery"], year: 2023, rating: 8.1, maturity: "R", durationMinutes: 121, synopsis: "A night-shift radio operator hears a broadcast that hasn't aired in forty years — and someone will do anything to keep it off the air.", cast: ["Helena Cross", "Marcus Webb"], stream: "tears" }),
  build({ id: "iron-veil", name: "Iron Veil", type: movie, category: "Action", genres: ["Action", "Spy"], year: 2024, rating: 7.9, maturity: "PG-13", durationMinutes: 109, synopsis: "A retired operative is pulled back in for one last extraction when the agency she built turns against its own.", cast: ["Nadia Rourke", "Theo Vance"], stream: "bipbop" }),
  build({ id: "paper-cranes", name: "Paper Cranes", type: movie, category: "Drama", genres: ["Drama", "Family"], year: 2022, rating: 8.4, maturity: "PG", durationMinutes: 117, synopsis: "Three siblings return to their grandmother's coastal house and spend one final summer untangling the stories she never told them.", cast: ["Yuki Tanaka", "Ren Sato", "Aimee Lin"], stream: "shift" }),
  build({ id: "blue-planet-rising", name: "Blue Planet Rising", type: movie, category: "Documentary", genres: ["Documentary", "Nature"], year: 2024, rating: 9.1, maturity: "G", durationMinutes: 92, synopsis: "A breathtaking journey through the world's recovering coral reefs and the scientists racing to bring them back to life.", cast: ["Narrated by Eleanor Frost"], stream: "tears" }),
  build({ id: "starfall-academy", name: "Starfall Academy", type: movie, category: "Animation", genres: ["Animation", "Fantasy", "Adventure"], year: 2023, rating: 8.2, maturity: "PG", durationMinutes: 104, synopsis: "A clumsy apprentice mage enrolls at a floating school for sky-sailors and discovers she may be the storm everyone fears.", cast: ["Lily Park", "Owen Reyes"], stream: "bipbop" }),
  build({ id: "the-quiet-mile", name: "The Quiet Mile", type: movie, category: "Drama", genres: ["Drama", "Sport"], year: 2021, rating: 7.8, maturity: "PG-13", durationMinutes: 126, synopsis: "A washed-up marathon coach and a teenager with nothing to lose train for a race that could change both their lives.", cast: ["Carl Devine", "Priya Anand"], stream: "shift" }),
  build({ id: "ghost-protocol-zero", name: "Ghost Protocol Zero", type: movie, category: "Action", genres: ["Action", "Sci-Fi"], year: 2025, rating: 7.3, maturity: "PG-13", durationMinutes: 132, synopsis: "When a rogue AI seizes the world's defense grid, the only counter is a unit that officially never existed.", cast: ["Jax Moreau", "Lena Petrova"], stream: "bunny" }),
  build({ id: "cosmic-drift", name: "Cosmic Drift", type: movie, category: "Sci-Fi", genres: ["Sci-Fi", "Drama"], year: 2022, rating: 8.0, maturity: "PG-13", durationMinutes: 115, synopsis: "Two stranded astronauts must rebuild a failing station — and their friendship — before their orbit decays for good.", cast: ["Hana Cole", "Dmitri Vale"], stream: "tears" }),
  build({ id: "the-understudy", name: "The Understudy", type: movie, category: "Comedy", genres: ["Comedy", "Romance"], year: 2024, rating: 7.1, maturity: "PG-13", durationMinutes: 95, synopsis: "A perpetual second-choice actor finally lands the lead — the night the entire production falls apart around him.", cast: ["Noah Bennett", "Zoe Hart"], stream: "bipbop" }),
  build({ id: "deep-current", name: "Deep Current", type: movie, category: "Thriller", genres: ["Thriller", "Crime"], year: 2023, rating: 7.7, maturity: "R", durationMinutes: 113, synopsis: "A harbor detective follows a string of disappearances into the tangled politics of a town that lives off the tide.", cast: ["Rosa Mendez", "Frank Healy"], stream: "shift" }),
  build({ id: "wild-frequencies", name: "Wild Frequencies", type: movie, category: "Documentary", genres: ["Documentary", "Music"], year: 2022, rating: 8.5, maturity: "PG", durationMinutes: 88, synopsis: "Field recordists travel to the edges of the map to capture the vanishing sounds of the natural world.", cast: ["Featuring Amara Singh"], stream: "bunny" }),
  build({ id: "little-robot-big-city", name: "Little Robot, Big City", type: movie, category: "Animation", genres: ["Animation", "Comedy", "Family"], year: 2025, rating: 8.3, maturity: "G", durationMinutes: 91, synopsis: "A delivery bot with one cracked sensor gets lost downtown and learns the city — and itself — one wrong turn at a time.", cast: ["Voice of Milo Trent", "Voice of Bea Ruiz"], stream: "tears" }),
  build({ id: "crimson-harbor", name: "Crimson Harbor", type: movie, category: "Thriller", genres: ["Thriller", "Noir"], year: 2021, rating: 7.6, maturity: "R", durationMinutes: 118, synopsis: "A forensic accountant stumbles onto a laundering ring and learns the only way out is straight through it.", cast: ["Eva Lindqvist", "Sam Boateng"], stream: "shift" }),
  build({ id: "solar-requiem", name: "Solar Requiem", type: movie, category: "Sci-Fi", genres: ["Sci-Fi", "Thriller"], year: 2025, rating: 8.6, maturity: "PG-13", durationMinutes: 141, synopsis: "As the sun begins to flicker, a lone engineer aboard a sun-grazing probe holds the last plan that might save Earth.", cast: ["Iris Chen", "Mateo Alvarez"], stream: "bunny" }),
  build({ id: "the-paper-tiger", name: "The Paper Tiger", type: movie, category: "Action", genres: ["Action", "Martial Arts"], year: 2022, rating: 7.4, maturity: "PG-13", durationMinutes: 106, synopsis: "A mild-mannered calligrapher is mistaken for a legendary assassin and has to fight his way out of the lie.", cast: ["Kenji Mori", "Lucia Fang"], stream: "bipbop" }),
  build({ id: "midnight-in-cairo", name: "Midnight in Cairo", type: movie, category: "Drama", genres: ["Drama", "Romance"], year: 2023, rating: 8.0, maturity: "PG-13", durationMinutes: 122, synopsis: "Two strangers share one sleepless night wandering a city that keeps rearranging itself around their secrets.", cast: ["Layla Haddad", "Omar Said"], stream: "tears" }),
  build({ id: "laugh-track", name: "Laugh Track", type: movie, category: "Comedy", genres: ["Comedy", "Music"], year: 2024, rating: 7.0, maturity: "PG-13", durationMinutes: 99, synopsis: "A failing sitcom's cast discovers their canned laughter is reacting to things that haven't happened yet.", cast: ["Dana Pryce", "Theo Park"], stream: "shift" }),
  build({ id: "the-glass-forest", name: "The Glass Forest", type: movie, category: "Documentary", genres: ["Documentary", "Science"], year: 2021, rating: 8.7, maturity: "G", durationMinutes: 84, synopsis: "Inside the world's largest seed vault, the quiet keepers of every plant we might one day need.", cast: ["Narrated by Joon Park"], stream: "bunny" }),
  build({ id: "pixel-pioneers", name: "Pixel Pioneers", type: movie, category: "Animation", genres: ["Animation", "Adventure"], year: 2022, rating: 7.9, maturity: "PG", durationMinutes: 97, synopsis: "Four arcade sprites escape their dying cabinet and road-trip across a city of forgotten machines.", cast: ["Voice of Remy Cole", "Voice of Ada Frost"], stream: "bipbop" }),
  build({ id: "velocity-9", name: "Velocity 9", type: movie, category: "Action", genres: ["Action", "Racing"], year: 2025, rating: 7.5, maturity: "PG-13", durationMinutes: 112, synopsis: "An ex-getaway driver enters an underground race where the finish line is a one-way ticket off the grid.", cast: ["Cole Ramirez", "Tasha Bright"], stream: "tears" }),
  build({ id: "echoes-of-tomorrow", name: "Echoes of Tomorrow", type: movie, category: "Sci-Fi", genres: ["Sci-Fi", "Mystery"], year: 2023, rating: 8.3, maturity: "PG-13", durationMinutes: 129, synopsis: "A physicist starts receiving messages from herself — sent from a future she's trying very hard to prevent.", cast: ["Dr. Elise Mara", "Victor Haas"], stream: "shift" }),

  build({ id: "midnight-diner-club", name: "Midnight Diner Club", type: series, category: "Comedy", genres: ["Comedy", "Slice of Life"], year: 2023, rating: 7.5, maturity: "PG-13", durationMinutes: 30, synopsis: "At a 24-hour diner, a mismatched crew of regulars turn every late-night order into a small, ridiculous adventure.", cast: ["Gabby Flores", "Sam Okafor"], stream: "bunny" }),
  build({ id: "the-hollow-crown-chronicles", name: "The Hollow Crown Chronicles", type: series, category: "Drama", genres: ["Drama", "History"], year: 2024, rating: 8.8, maturity: "TV-MA", durationMinutes: 52, synopsis: "Across a divided kingdom, four families scheme, betray and bargain for a throne nobody can hold for long.", cast: ["Rowan Ashby", "Cora Vane", "Elias Thorne"], stream: "tears" }),
  build({ id: "orbit-station", name: "Orbit Station", type: series, category: "Sci-Fi", genres: ["Sci-Fi", "Drama"], year: 2025, rating: 8.4, maturity: "TV-14", durationMinutes: 45, synopsis: "The crew of humanity's first deep-space hub juggle politics, sabotage and the slow terror of the dark outside.", cast: ["Commander Reyes", "Dr. Okonkwo"], stream: "bipbop" }),
  build({ id: "precinct-seven", name: "Precinct Seven", type: series, category: "Thriller", genres: ["Thriller", "Crime"], year: 2022, rating: 8.2, maturity: "TV-MA", durationMinutes: 48, synopsis: "A cold-case unit reopens the files nobody wanted, and finds the city's worst secrets were filed on purpose.", cast: ["Det. Mara Ruiz", "Det. Cole Park"], stream: "shift" }),
  build({ id: "wild-earth", name: "Wild Earth", type: series, category: "Documentary", genres: ["Documentary", "Nature"], year: 2024, rating: 9.0, maturity: "TV-G", durationMinutes: 50, synopsis: "Six continents, six episodes, and the astonishing daily survival stories of the animals that share them.", cast: ["Narrated by Eleanor Frost"], stream: "bunny" }),
  build({ id: "toon-squad", name: "Toon Squad", type: series, category: "Animation", genres: ["Animation", "Comedy"], year: 2023, rating: 7.7, maturity: "TV-Y7", durationMinutes: 24, synopsis: "A team of cartoon misfits keep accidentally saving their town while trying to get out of doing homework.", cast: ["Voice of Pip Nolan", "Voice of Goose"], stream: "tears" }),
  build({ id: "the-bake-off-house", name: "The Bake-Off House", type: series, category: "Comedy", genres: ["Comedy", "Reality"], year: 2025, rating: 7.3, maturity: "TV-PG", durationMinutes: 42, synopsis: "Twelve amateur bakers share one chaotic house and one very flammable kitchen for a shot at the golden whisk.", cast: ["Hosted by Bea Sloane"], stream: "bipbop" }),
  build({ id: "shadow-division", name: "Shadow Division", type: series, category: "Action", genres: ["Action", "Spy"], year: 2024, rating: 8.1, maturity: "TV-MA", durationMinutes: 47, synopsis: "An off-book intelligence cell takes the missions that don't exist — and pays for them in ways that do.", cast: ["Agent Vance", "Agent Sol"], stream: "shift" }),
  build({ id: "coastal-lines", name: "Coastal Lines", type: series, category: "Drama", genres: ["Drama", "Family"], year: 2021, rating: 7.9, maturity: "TV-14", durationMinutes: 44, synopsis: "Three generations of a fishing family weather every storm the sea — and each other — can throw at them.", cast: ["Maeve Sullivan", "Tom Sullivan"], stream: "bunny" }),
  build({ id: "quantum-detectives", name: "Quantum Detectives", type: series, category: "Sci-Fi", genres: ["Sci-Fi", "Mystery"], year: 2023, rating: 8.0, maturity: "TV-14", durationMinutes: 46, synopsis: "Two investigators solve crimes that haven't fully happened yet, in a city where every choice splits the world.", cast: ["Inspector Vega", "Dr. Lune"], stream: "tears" }),
];
