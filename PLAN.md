# 🏯 Tamashi — Personal Digital HQ

> Not a portfolio. Not a resume site. This is **your cockpit** — the page you open every single day.

---

## 🧠 Philosophy

Tamashi (魂 — "soul") is a personal dashboard that reflects who you are and what you're doing *right now*. It's a living, breathing digital space — part command center, part life tracker, part vibe board. Every section is a **component**, modular and self-contained.

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR/SSG for fast loads, API routes for scraping/proxies, file-based routing |
| **Styling** | Vanilla CSS + CSS Modules | Full control, no bloat, premium glassmorphism effects |
| **Fonts** | Google Fonts (Inter + JetBrains Mono) | Clean modern UI + monospace for code/clock sections |
| **Animations** | CSS animations + Framer Motion | Smooth micro-interactions and entrance animations |
| **Icons** | Lucide React | Lightweight, consistent, beautiful |
| **Deployment** | Vercel | Zero-config for Next.js, edge functions for API routes |
| **Data Fetching** | Next.js API Routes + Server Components | Proxy external APIs, scrape PSN data, cache responses |

---

## 📐 Layout Architecture

```
┌──────────────────────────────────────────────────────────┐
│  🖼️ RANDOM WALLPAPER BACKGROUND (full page, blurred)    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  🕐 DIGITAL CLOCK + 📜 QUOTE OF THE DAY           │  │
│  │  (Hero / top section — centered, large)            │  │
│  ├────────────────────────────────────────────────────┤  │
│  │                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │ 🎵 Spotify   │  │ 🎵 Top       │                │  │
│  │  │   Now Playing│  │   Artists    │                │  │
│  │  └──────────────┘  └──────────────┘                │  │
│  │                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │ 🎮 PSN       │  │ 📺 AniList   │                │  │
│  │  │   Gaming     │  │   Stats      │                │  │
│  │  └──────────────┘  └──────────────┘                │  │
│  │                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │ 🗺️ Life      │  │ 🔥 Task      │                │  │
│  │  │   Roadmap    │  │   Streak     │                │  │
│  │  └──────────────┘  └──────────────┘                │  │
│  │                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │ ⚡ Currently │  │ 🏃 Running/  │                │  │
│  │  │   Grinding   │  │   Gym Track  │                │  │
│  │  └──────────────┘  └──────────────┘                │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────┐              │  │
│  │  │ 📝 Blog Posts                    │              │  │
│  │  └──────────────────────────────────┘              │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────┐              │  │
│  │  │ 🧪 Agent Experiment Logs         │              │  │
│  │  └──────────────────────────────────┘              │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────┐              │  │
│  │  │ ☕ BuyMeACoffee Widget           │              │  │
│  │  └──────────────────────────────────┘              │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 Component Breakdown

All sections live under `src/components/`. Each component is self-contained with its own styles.

### 1. `DigitalClock`
- **Location**: `src/components/DigitalClock/`
- **Description**: Large, glowing digital clock with date display
- **Features**:
  - Real-time clock updating every second (HH:MM:SS format)
  - Day of week + full date below
  - Greeting based on time of day ("Good morning, Bryan")
  - Monospace font (JetBrains Mono), neon glow effect
- **Data Source**: Client-side `Date()` API
- **Files**: `DigitalClock.jsx`, `DigitalClock.module.css`

---

### 2. `QuoteOfTheDay`
- **Location**: `src/components/QuoteOfTheDay/`
- **Description**: Inspirational or thought-provoking quote that changes daily
- **Features**:
  - Fetches from a quotes API (e.g., [api.quotable.io](https://api.quotable.io) or local JSON)
  - Smooth fade-in animation
  - Author attribution
  - Elegant italic typography
- **Data Source**: External API or local `quotes.json` file with curated quotes
- **Files**: `QuoteOfTheDay.jsx`, `QuoteOfTheDay.module.css`

---

### 3. `WallpaperBackground`
- **Location**: `src/components/WallpaperBackground/`
- **Description**: Full-page random wallpaper with blur overlay
- **Features**:
  - Fetches random wallpaper from Unsplash API (topic: dark, anime, nature, cyberpunk)
  - Subtle parallax or slow zoom animation
  - Blurred overlay so text remains readable
  - Changes on page refresh or on a timer
- **Data Source**: Unsplash API (`https://api.unsplash.com/photos/random`)
- **Files**: `WallpaperBackground.jsx`, `WallpaperBackground.module.css`

---

### 4. `SpotifyNowPlaying`
- **Location**: `src/components/SpotifyNowPlaying/`
- **Description**: Live Spotify "Now Playing" panel
- **Features**:
  - Album art, track name, artist
  - Progress bar (real-time playback position)
  - "Not playing" state with last played track
  - Spotify green accent theming
  - Link to open in Spotify
- **Data Source**: Spotify Web API (requires OAuth — uses Next.js API route as proxy with refresh token flow)
- **API Route**: `src/app/api/spotify/now-playing/route.js`
- **Files**: `SpotifyNowPlaying.jsx`, `SpotifyNowPlaying.module.css`

---

### 5. `SpotifyTopArtists`
- **Location**: `src/components/SpotifyTopArtists/`
- **Description**: Grid/carousel of your top artists from Spotify
- **Features**:
  - Top 5-10 artists with profile images
  - Time range toggle (Last 4 Weeks / Last 6 Months / All Time)
  - Genre tags under each artist
  - Hover effect with subtle scale + glow
- **Data Source**: Spotify Web API — `/me/top/artists`
- **API Route**: `src/app/api/spotify/top-artists/route.js`
- **Files**: `SpotifyTopArtists.jsx`, `SpotifyTopArtists.module.css`

---

### 6. `PSNProfile`
- **Location**: `src/components/PSNProfile/`
- **Description**: Latest PlayStation game played with trophy progress
- **Features**:
  - Game cover art + title
  - Trophy breakdown (Platinum, Gold, Silver, Bronze)
  - Trophy progress bar (percentage)
  - Last played date
  - Total trophies count
  - Link to full PSN profile
- **Data Source**: Scrape from PSNProfiles.com via Next.js API route (using cheerio or similar)
- **API Route**: `src/app/api/psn/route.js`
- **Files**: `PSNProfile.jsx`, `PSNProfile.module.css`

---

### 7. `AniListStats`
- **Location**: `src/components/AniListStats/`
- **Description**: Anime/manga stats from AniList
- **Features**:
  - Total anime watched / manga read
  - Days watched / chapters read
  - Mean score
  - Currently watching list (top 3-5)
  - Favorite genres chart (horizontal bars)
  - Profile avatar
  - Link to AniList profile
- **Data Source**: AniList GraphQL API (`https://graphql.anilist.co`)
- **API Route**: `src/app/api/anilist/route.js`
- **Files**: `AniListStats.jsx`, `AniListStats.module.css`

---

### 8. `LifeRoadmap`
- **Location**: `src/components/LifeRoadmap/`
- **Description**: Visual timeline of life goals, milestones, and progress
- **Features**:
  - Vertical timeline with milestone nodes
  - Categories: Career, Personal, Health, Skills, Financial
  - Status indicators: ✅ Done, 🔄 In Progress, 📌 Planned
  - Color-coded by category
  - Expandable milestone cards with details
  - Animated line drawing effect on scroll
- **Data Source**: Local JSON/MDX file (`src/data/roadmap.json`)
- **Files**: `LifeRoadmap.jsx`, `LifeRoadmap.module.css`

---

### 9. `TaskStreak`
- **Location**: `src/components/TaskStreak/`
- **Description**: GitHub-style contribution/streak heatmap for daily tasks
- **Features**:
  - Heatmap grid (last 12 weeks / 90 days)
  - Current streak counter with fire emoji 🔥
  - Longest streak record
  - Today's task completion status
  - Color intensity based on number of tasks completed
- **Data Source**: Local JSON file or localStorage (`src/data/streaks.json`)
- **Files**: `TaskStreak.jsx`, `TaskStreak.module.css`

---

### 10. `CurrentlyGrinding`
- **Location**: `src/components/CurrentlyGrinding/`
- **Description**: What you're currently focused on / learning / building
- **Features**:
  - Card-based layout
  - Fields: Title, Category (🎮 Gaming / 💻 Coding / 📚 Learning / 🏋️ Fitness), Progress %, Description
  - Progress bars with animated fill
  - Status badge (Active / Paused / Done)
  - Priority indicator
- **Data Source**: Local JSON file (`src/data/grinding.json`)
- **Files**: `CurrentlyGrinding.jsx`, `CurrentlyGrinding.module.css`

---

### 11. `BlogPosts`
- **Location**: `src/components/BlogPosts/`
- **Description**: Latest blog entries in a compact card format
- **Features**:
  - Title, excerpt, date, reading time
  - Category/tags
  - "Read more" link (can link to external blog or internal pages)
  - Markdown rendering support for internal posts
  - Maximum 3-5 latest posts displayed
- **Data Source**: Local MDX files in `src/content/blog/` OR external RSS feed
- **Files**: `BlogPosts.jsx`, `BlogPosts.module.css`

---

### 12. `AgentLogs`
- **Location**: `src/components/AgentLogs/`
- **Description**: Log of AI agent experiments and study sessions
- **Features**:
  - Terminal-style display (dark bg, monospace font, green text)
  - Each entry: Date, Title, Status (🟢 Success / 🔴 Failed / 🟡 In Progress), Summary
  - Expandable entry details
  - Tags: Agent type, model used, tools, topic
  - Filter by status/tag
- **Data Source**: Local JSON or MDX files (`src/data/agent-logs.json` or `src/content/logs/`)
- **Files**: `AgentLogs.jsx`, `AgentLogs.module.css`

---

### 13. `RunningGymTracker`
- **Location**: `src/components/RunningGymTracker/`
- **Description**: Fitness tracking section for runs and gym sessions
- **Features**:
  - Weekly summary: Total km run, gym sessions count
  - Last run: Distance, time, pace, route (optional map)
  - Last gym session: Exercises, sets, reps
  - Monthly progress bar (goal vs actual)
  - Mini chart showing weekly distance/sessions trend
  - Streak counter for consecutive workout days
- **Data Source**: Local JSON (`src/data/fitness.json`) — manual entry or Strava API integration (future)
- **Files**: `RunningGymTracker.jsx`, `RunningGymTracker.module.css`

---

### 14. `BuyMeACoffee`
- **Location**: `src/components/BuyMeACoffee/`
- **Description**: Embedded BuyMeACoffee support widget
- **Features**:
  - Styled button/card matching dashboard theme
  - Custom message: "Fuel my grind ☕"
  - Glassmorphism card with BuyMeACoffee link
  - Hover animation
- **Data Source**: BuyMeACoffee embed script/link
- **Files**: `BuyMeACoffee.jsx`, `BuyMeACoffee.module.css`

---

## 📁 Project Structure

```
tamashi/
├── public/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout (fonts, metadata, global styles)
│   │   ├── page.js                # Main dashboard page — assembles all components
│   │   ├── globals.css            # Global styles, CSS variables, design tokens
│   │   └── api/
│   │       ├── spotify/
│   │       │   ├── now-playing/
│   │       │   │   └── route.js   # Spotify Now Playing proxy
│   │       │   └── top-artists/
│   │       │       └── route.js   # Spotify Top Artists proxy
│   │       ├── psn/
│   │       │   └── route.js       # PSNProfiles scraper
│   │       ├── anilist/
│   │       │   └── route.js       # AniList GraphQL proxy
│   │       └── quote/
│   │           └── route.js       # Quote of the day
│   ├── components/
│   │   ├── DigitalClock/
│   │   │   ├── DigitalClock.jsx
│   │   │   └── DigitalClock.module.css
│   │   ├── QuoteOfTheDay/
│   │   │   ├── QuoteOfTheDay.jsx
│   │   │   └── QuoteOfTheDay.module.css
│   │   ├── WallpaperBackground/
│   │   │   ├── WallpaperBackground.jsx
│   │   │   └── WallpaperBackground.module.css
│   │   ├── SpotifyNowPlaying/
│   │   │   ├── SpotifyNowPlaying.jsx
│   │   │   └── SpotifyNowPlaying.module.css
│   │   ├── SpotifyTopArtists/
│   │   │   ├── SpotifyTopArtists.jsx
│   │   │   └── SpotifyTopArtists.module.css
│   │   ├── PSNProfile/
│   │   │   ├── PSNProfile.jsx
│   │   │   └── PSNProfile.module.css
│   │   ├── AniListStats/
│   │   │   ├── AniListStats.jsx
│   │   │   └── AniListStats.module.css
│   │   ├── LifeRoadmap/
│   │   │   ├── LifeRoadmap.jsx
│   │   │   └── LifeRoadmap.module.css
│   │   ├── TaskStreak/
│   │   │   ├── TaskStreak.jsx
│   │   │   └── TaskStreak.module.css
│   │   ├── CurrentlyGrinding/
│   │   │   ├── CurrentlyGrinding.jsx
│   │   │   └── CurrentlyGrinding.module.css
│   │   ├── BlogPosts/
│   │   │   ├── BlogPosts.jsx
│   │   │   └── BlogPosts.module.css
│   │   ├── AgentLogs/
│   │   │   ├── AgentLogs.jsx
│   │   │   └── AgentLogs.module.css
│   │   ├── RunningGymTracker/
│   │   │   ├── RunningGymTracker.jsx
│   │   │   └── RunningGymTracker.module.css
│   │   └── BuyMeACoffee/
│   │       ├── BuyMeACoffee.jsx
│   │       └── BuyMeACoffee.module.css
│   ├── data/
│   │   ├── roadmap.json           # Life roadmap milestones
│   │   ├── grinding.json          # Currently grinding items
│   │   ├── streaks.json           # Task streak data
│   │   ├── fitness.json           # Running/gym tracker data
│   │   ├── agent-logs.json        # Agent experiment logs
│   │   └── quotes.json            # Curated quotes (fallback)
│   └── content/
│       └── blog/                  # MDX blog posts (optional)
├── .env.local                     # API keys (Spotify, Unsplash, etc.)
├── next.config.js
├── package.json
├── PLAN.md
└── README.md
```

---

## 🎨 Design System

### Color Palette
```css
/* Dark mode base — glass over wallpaper */
--bg-primary:        rgba(10, 10, 20, 0.85);     /* Deep dark base overlay */
--bg-card:           rgba(255, 255, 255, 0.05);   /* Glassmorphism cards */
--bg-card-hover:     rgba(255, 255, 255, 0.08);   /* Card hover state */
--border-glass:      rgba(255, 255, 255, 0.1);    /* Subtle glass borders */

--text-primary:      #f0f0f0;
--text-secondary:    #a0a0b0;
--text-muted:        #6a6a7a;

--accent-primary:    #7c5cfc;                      /* Purple — main accent */
--accent-secondary:  #00d4aa;                      /* Teal — secondary accent */
--accent-spotify:    #1db954;                      /* Spotify green */
--accent-psn:        #003791;                      /* PlayStation blue */
--accent-anilist:    #3db4f2;                      /* AniList blue */
--accent-fire:       #ff6b35;                      /* Streak fire orange */
--accent-coffee:     #ffdd00;                      /* BuyMeACoffee yellow */

--gradient-hero:     linear-gradient(135deg, #7c5cfc 0%, #00d4aa 100%);
--gradient-card:     linear-gradient(135deg, rgba(124,92,252,0.1), rgba(0,212,170,0.05));
```

### Glassmorphism Card Base
```css
.card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(124, 92, 252, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(124, 92, 252, 0.15);
}
```

### Typography
```css
--font-sans:  'Inter', sans-serif;         /* Body text */
--font-mono:  'JetBrains Mono', monospace; /* Clock, logs, code */
```

### Responsive Breakpoints
```css
/* Mobile first */
--bp-sm:  640px;   /* Small tablets */
--bp-md:  768px;   /* Tablets */
--bp-lg:  1024px;  /* Small desktops */
--bp-xl:  1280px;  /* Standard desktops */
```

### Grid System
- CSS Grid with `auto-fill` / `auto-fit` for responsive card layouts
- 2-column layout on desktop, single column on mobile
- Some components (Blog, Agent Logs) span full width

---

## 🔌 External API Setup Required

| Service | What's Needed | Env Variable |
|---|---|---|
| **Spotify** | Create app at [developer.spotify.com](https://developer.spotify.com), get Client ID/Secret, generate refresh token | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` |
| **Unsplash** | Register at [unsplash.com/developers](https://unsplash.com/developers), get API key | `UNSPLASH_ACCESS_KEY` |
| **PSNProfiles** | Your PSN username for scraping | `PSN_USERNAME` |
| **AniList** | Your AniList username (public API, no auth needed) | `ANILIST_USERNAME` |

---

## 🚀 Implementation Phases

### Phase 1: Foundation
- [ ] Initialize Next.js project
- [ ] Set up project structure (folders, globals.css, layout.js)
- [ ] Implement design system (CSS variables, card base, fonts)
- [ ] Create `WallpaperBackground` component
- [ ] Create `DigitalClock` component
- [ ] Create `QuoteOfTheDay` component
- [ ] Assemble in `page.js` — verify hero section works

### Phase 2: Entertainment & Media
- [ ] Create Spotify API routes (now-playing + top-artists)
- [ ] Build `SpotifyNowPlaying` component
- [ ] Build `SpotifyTopArtists` component
- [ ] Create PSN API route (scraper)
- [ ] Build `PSNProfile` component
- [ ] Create AniList API route
- [ ] Build `AniListStats` component

### Phase 3: Productivity & Goals
- [ ] Create data files (roadmap.json, grinding.json, streaks.json)
- [ ] Build `LifeRoadmap` component
- [ ] Build `TaskStreak` component
- [ ] Build `CurrentlyGrinding` component

### Phase 4: Content & Logging
- [ ] Set up blog content structure
- [ ] Build `BlogPosts` component
- [ ] Create agent logs data
- [ ] Build `AgentLogs` component

### Phase 5: Fitness & Support
- [ ] Create fitness data file
- [ ] Build `RunningGymTracker` component
- [ ] Build `BuyMeACoffee` component

### Phase 6: Polish
- [ ] Responsive design pass (all breakpoints)
- [ ] Entrance animations (stagger, fade-in, slide-up)
- [ ] Loading skeletons for async components
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] SEO metadata
- [ ] Final visual QA

---

## ⚡ Data Strategy

| Component | Source | Fetch Method | Cache |
|---|---|---|---|
| DigitalClock | Client-side | `useState` + `setInterval` | None |
| QuoteOfTheDay | Local JSON / API | Server Component or API route | 24h (revalidate daily) |
| WallpaperBackground | Unsplash API | API route | Per session |
| SpotifyNowPlaying | Spotify API | Client-side polling (30s) | None (real-time) |
| SpotifyTopArtists | Spotify API | Server Component | 1h revalidate |
| PSNProfile | PSNProfiles scrape | API route | 6h revalidate |
| AniListStats | AniList GraphQL | Server Component | 1h revalidate |
| LifeRoadmap | Local JSON | Static import | Build-time |
| TaskStreak | Local JSON | Static import | Build-time |
| CurrentlyGrinding | Local JSON | Static import | Build-time |
| BlogPosts | Local MDX | Static import | Build-time |
| AgentLogs | Local JSON | Static import | Build-time |
| RunningGymTracker | Local JSON | Static import | Build-time |
| BuyMeACoffee | Static embed | Static | None |

---

## 🔮 Future Ideas (v2+)
- GitHub contribution graph integration
- Weather widget
- Notion integration for tasks
- Strava API for auto-pulling fitness data
- Dark/Light mode toggle
- Drag-and-drop widget rearrangement
- PWA support (install as app)
- Admin panel to edit data files via UI
