# StreaMatrix — a small video streaming content browser

Browse a catalog of movies and series, search and filter them, open a title's
detail page, and play an HLS video stream. Built with **Next.js 16** (App
Router) and **TypeScript**, styled with **Tailwind CSS v4** in a black +
blue→green gradient theme.

> **Live demo:** _add your Vercel link here_

---

## Quick start

```bash
npm install
npm run dev      # start the dev server  → http://localhost:3000
npm run build    # production build (also type-checks + prerenders pages)
npm start        # serve the production build
npm test         # run the unit tests (Vitest)
npm run lint     # run ESLint
```

Node 20+ recommended.

---

## What it does

Everything in the brief's **required** list, plus several of the optional ones.

**Required**

- ✅ Next.js + TypeScript.
- ✅ Home page with a **responsive grid of cards** — each shows a thumbnail,
  title, category, year and rating.
- ✅ **Search** (in the header) by title/genre and **filter** by category & type.
- ✅ **Detail page** for a single title on its own route (`/title/[id]`).
- ✅ Working **HLS video player** (`.m3u8`) using `hls.js`, with native HLS on
  Safari.
- ✅ **Loading and error states** everywhere (route skeletons, player states,
  empty results, 404s, error boundaries).
- ✅ **Responsive, mobile-first** layout.

**Optional / bonus**

- ✅ **SSG + dynamic SSR** — detail pages are statically generated; see [Rendering](#rendering).
- ✅ **Lazy-loaded images** via `next/image`; artwork is generated locally as
  inline SVG, so it always renders with no network dependency.
- ✅ **Accessibility** — semantic HTML, labelled controls, visible focus rings,
  `aria-live` result counts, Escape-to-close drawer.
- ✅ **Continue watching** row saved in the browser (localStorage).
- ✅ **Unit tests** for the filtering/sorting logic (14 tests).
- ✅ A small **REST API** that exposes the catalog (`/api/titles`).

**Layout & navigation**

- A **header** with a hamburger menu, the brand, and a global search box.
- A **persistent, collapsible sidebar** (toggled by the hamburger) that pushes
  the content beside it — browse by collection (Trending, Hollywood, Television
  Series, Animated) and by genre. On mobile it slides in as an overlay.
- A home page of **themed rails** (Netflix-style rows) that **load as you
  scroll** instead of rendering every row up front.

---

## Architecture

The guiding idea from the brief was **clean, decoupled boundaries** — so the app
is split into small modules that each do one job, instead of one big blob.

```
app/                         ← routes only (thin; they just compose components)
  layout.tsx                 ← wraps everything in <AppShell>
  page.tsx                   ← home: rails by default, results grid when filtering
  loading.tsx · error.tsx · not-found.tsx
  title/[id]/                ← detail page + its own loading / not-found
  api/titles/                ← REST endpoints (the data layer over HTTP)

services/catalog/            ← THE DATA LAYER (the "service")
  types.ts                   ← domain types (Title, Category, MediaType, Rail…)
  data.ts                    ← mock dataset (the "database")
  filter.ts                  ← pure search/sort logic (no I/O) — unit tested
  catalog.service.ts         ← async service API (query, getById, getRails…)
  index.ts                   ← the only public entry point

components/                  ← presentation, grouped by purpose
  ui/                        ← generic reusable primitives (Button, Badge, …)
  catalog/                   ← cards, grid, rails, hero, search input, skeletons
  player/                    ← HLS video player + the title-specific wrapper
  watching/                  ← continue-watching row + card
  layout/                    ← AppShell, header, sidebar drawer, footer

hooks/                       ← reusable client hooks (useContinueWatching)
lib/                         ← tiny helpers (formatting, classnames, storage)
```

### How data flows

```
URL (?q / ?category / ?type)
        │
        ▼
Home Server Component ─▶ catalogService (the boundary) ─▶ mock data
                                  │
        REST API /api/titles  ────┘   (same boundary, over HTTP)
```

The UI **never** touches the raw dataset — it always goes through
`catalogService`. Because everything sits behind that one boundary, the mock
data could be replaced with a real database or the TMDB API by changing **one
file** (`catalog.service.ts`), and nothing else would need to change.

### One filtering function, one source of truth

The search/sort/type rules live in `services/catalog/filter.ts` as **pure
functions**. `filterTitles` is the single implementation used by the service
(and therefore by both the home page and the REST API), and it's exactly what
the **unit tests** check — so the rules can never drift between the UI, the API
and the tests.

---

## Key decisions & trade-offs

**Search & filtering go through the URL.**
The header search and the sidebar/footer links all resolve to a URL
(`/?q=…`, `/?type=series`, `/?category=Action`). The home Server Component reads
those params and asks the service to filter. One filtering path for everything,
and every result is a shareable, bookmarkable link that works from any page.
Search is debounced (300ms) so it doesn't navigate on every keystroke. Trade-off:
reading `searchParams` makes the home route server-rendered on demand rather than
fully static.

**Themed rails that load on scroll.**
The default home is a set of horizontal rails. Only the first few mount up front;
the rest reveal as you scroll (an `IntersectionObserver` sentinel), keeping the
initial page light instead of rendering every shelf at once.

**Mock data instead of a live API.**
Keeps the app self-contained — no API keys, no rate limits, works offline and in
CI. The service boundary means swapping in TMDB later is a one-file change. The
trade-off is that the catalog is small and fixed, which is fine for a demo.

**`hls.js` with a native-HLS fallback.**
Most browsers (Chrome, Firefox, Edge) can't play `.m3u8` natively, so `hls.js`
handles them. Safari/iOS play HLS natively, so there we skip the library
entirely. `hls.js` is **lazy-loaded inside an effect**, so it never runs on the
server and isn't downloaded by Safari users.

**`useSyncExternalStore` for "continue watching".**
localStorage is an external store, so this is the correct React primitive for
reading it — it's SSR-safe, avoids hydration mismatches, and keeps multiple tabs
in sync, all without a `setState`-in-effect.

**A REST API _and_ direct service calls.**
Server Components import the service directly (faster, no self-fetch). The same
service is *also* published at `/api/titles` to prove the boundary is real — a
client widget or a separate microservice could consume it without touching the
UI.

---

## Rendering

This uses the right rendering mode per route (run `npm run build` to see the
table):

- **`/` (home)** — **dynamic**: it reads the search/filter params from the URL
  and renders results on the server.
- **`/title/[id]` (detail)** — **SSG** via `generateStaticParams`: every title
  page is prerendered to static HTML at build time, so it's instant and
  CDN-cacheable. `generateMetadata` adds per-title `<title>`/description and
  Open Graph tags for SEO and sharing.
- **`/api/titles`**, **`/api/titles/[id]`** — **dynamic**, server-rendered on
  demand.

Interactive bits (the search box, sidebar drawer, scroll-loading rails, the
player and continue-watching) are small **Client Components** layered on top, so
most of the page stays server-rendered and ships less JavaScript.

---

## Tech stack

| Concern   | Choice                                   |
| --------- | ---------------------------------------- |
| Framework | Next.js 16 (App Router) + React 19       |
| Language  | TypeScript (strict)                      |
| Styling   | Tailwind CSS v4 (CSS-based theme tokens) |
| Video     | hls.js (+ native HLS on Safari)          |
| Tests     | Vitest                                   |
| Images    | `next/image` + locally-generated SVG art |

## Try the API

```bash
curl "http://localhost:3000/api/titles?search=neon"
curl "http://localhost:3000/api/titles?type=series"
curl "http://localhost:3000/api/titles?category=Sci-Fi&sort=rating"
curl "http://localhost:3000/api/titles/neon-horizon"
```

## Notes

- **Artwork** is generated locally as inline SVG gradient posters
  (`lib/artwork.ts`), so images always render with no network dependency or
  rate limits. Point `posterUrl`/`backdropUrl` in `services/catalog/data.ts` at
  real images (e.g. TMDB) anytime.
- **Video** uses public HLS test streams (Mux, Apple) referenced from the
  dataset.
