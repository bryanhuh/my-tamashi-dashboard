# 🏗️ Foundation & Architecture

## Project Initialization

### Next.js Setup

```bash
npx -y create-next-app@latest ./ --js --app --no-tailwind --eslint --no-src-dir --import-alias "@/*"
```

Key choices:
- **`--js`** — JavaScript, not TypeScript. This is a personal project; type safety adds friction without team benefits.
- **`--app`** — App Router (Next.js 14+) for server components, API routes, and layouts.
- **`--no-tailwind`** — Vanilla CSS for full design control.
- **`--no-src-dir`** — Files live at root (`app/`, `components/`, `data/`) instead of nested under `src/`.
- **`--import-alias "@/*"`** — `@/components/…` resolves to root, keeping imports clean.

### Struggle: PLAN.md Conflict

When I ran `create-next-app`, it refused because `PLAN.md` already existed in the directory:

```
The directory tamashi contains files that could conflict: PLAN.md
```

**Solution:** Moved `PLAN.md` to `/tmp/`, ran the initializer, then moved it back. A minor inconvenience but worth noting — `create-next-app` expects a fully empty directory.

### Dependencies

```bash
npm install framer-motion lucide-react cheerio
```

- **framer-motion** — Animation library (currently imported but can be expanded for scroll-triggered animations)
- **lucide-react** — Icon set (Music, Trophy, ExternalLink, etc.)
- **cheerio** — jQuery-like HTML parser for server-side scraping (PSNProfiles)

## File Structure Philosophy

```
tamashi/
├── app/                    # Next.js App Router
│   ├── layout.js           # Root layout (fonts, metadata)
│   ├── page.js             # THE dashboard — assembles everything
│   ├── page.module.css     # Dashboard-specific layout styles
│   ├── globals.css         # Design system (tokens, base styles, animations)
│   └── api/                # Server-side API routes
│       ├── spotify/        # Spotify OAuth proxy
│       ├── psn/            # PSNProfiles scraper
│       └── anilist/        # AniList GraphQL proxy
├── components/             # 14 self-contained UI components
│   ├── DigitalClock/
│   │   ├── DigitalClock.jsx
│   │   └── DigitalClock.module.css
│   └── ... (each component follows this pattern)
├── data/                   # Static JSON data files
│   ├── roadmap.json
│   ├── streaks.json
│   ├── grinding.json
│   ├── blog.json
│   ├── agent-logs.json
│   └── fitness.json
└── docs/                   # This documentation
```

### Why This Structure?

1. **Each component is a folder** containing both `.jsx` and `.module.css`. This means when I want to modify the Spotify player, I go to one folder. No hunting across separate `styles/` and `components/` directories.

2. **Data files are separate from components.** Components import from `@/data/`, but the data is human-editable JSON. I can update my roadmap milestones or add a new blog post by editing a JSON file — no code changes needed.

3. **API routes are the proxy layer.** External services (Spotify, PSN, AniList) are never called directly from the browser. This protects API keys, handles CORS, and lets me add caching.

## The Main Page Assembly

`page.js` is the orchestrator. It imports all 14 components and arranges them in a grid:

```jsx
import WallpaperBackground from '@/components/WallpaperBackground/WallpaperBackground';
import DigitalClock from '@/components/DigitalClock/DigitalClock';
// ... 12 more imports

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <WallpaperBackground />
      
      {/* Hero: full-width centered section */}
      <section className={styles.hero}>
        <DigitalClock />
        <QuoteOfTheDay />
      </section>

      {/* 2-column grid for all components */}
      <div className={styles.mainGrid}>
        <div className={styles.section}><SpotifyNowPlaying /></div>
        <div className={styles.section}><SpotifyTopArtists /></div>
        {/* ... paired components ... */}
        
        {/* Full-width sections */}
        <div className={`${styles.section} ${styles.fullWidth}`}><BlogPosts /></div>
        <div className={`${styles.section} ${styles.fullWidth}`}><AgentLogs /></div>
      </div>
    </div>
  );
}
```

### The Grid Trick

The 2-column layout uses CSS Grid with a `1px` gap that *becomes* the grid lines:

```css
.mainGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap);            /* 1px */
  border-top: 1px solid var(--border);
}

.mainGrid > * {
  padding: var(--card-padding);
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

/* Right column items don't need right border */
.mainGrid > *:nth-child(2n) {
  border-right: none;
}
```

This creates the blueprint grid effect — every component is separated by thin blue lines, just like obake.blue's sections.

## Server vs. Client Components

Next.js 14 defaults to Server Components. I use this strategically:

| Component | Type | Why |
|---|---|---|
| `DigitalClock` | Client (`'use client'`) | Uses `useState` + `setInterval` for real-time updates |
| `QuoteOfTheDay` | Client (`'use client'`) | Uses `useEffect` for day-based rotation |
| `WallpaperBackground` | Client (`'use client'`) | Random selection + image preloading |
| `SpotifyNowPlaying` | Client (`'use client'`) | Polls API every 30 seconds |
| `SpotifyTopArtists` | Client (`'use client'`) | User-triggered time range toggle |
| `PSNProfile` | Client (`'use client'`) | Fetches on mount |
| `AniListStats` | Client (`'use client'`) | Fetches on mount |
| `LifeRoadmap` | Server | Static JSON import, no interactivity |
| `TaskStreak` | Client (`'use client'`) | Renders data but imported as client for consistency |
| `CurrentlyGrinding` | Server | Static JSON import |
| `BlogPosts` | Server | Static JSON import |
| `AgentLogs` | Client (`'use client'`) | Has expandable sections (useState) |
| `RunningGymTracker` | Server | Static JSON import |
| `BuyMeACoffee` | Server | Completely static |

### The Decision Rule

- **Needs `useState`, `useEffect`, or event handlers?** → Client component
- **Just renders data from imports?** → Server component

---

*Continue to [Hero Section →](./04-hero-section.md)*
