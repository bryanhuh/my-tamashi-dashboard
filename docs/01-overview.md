# 🏯 Tamashi — Implementation Guide

> A comprehensive guide to how every feature in Tamashi was built, the thinking behind each decision, and the challenges encountered along the way.

---

## Table of Contents

1. [Project Overview & Philosophy](#project-overview)
2. [Design Inspiration & Process](./02-design-system.md)
3. [Foundation & Architecture](./03-foundation.md)
4. [Hero Section: Clock, Quote & Wallpaper](./04-hero-section.md)
5. [Spotify Integration](./05-spotify.md)
6. [PlayStation Profile Scraper](./06-psn.md)
7. [AniList GraphQL Integration](./07-anilist.md)
8. [Life Roadmap & Productivity](./08-productivity.md)
9. [Blog & Agent Logs](./09-content.md)
10. [Fitness Tracker & BuyMeACoffee](./10-fitness-coffee.md)
11. [Challenges & Lessons Learned](./11-challenges.md)

---

## Project Overview

### What is Tamashi?

Tamashi (魂 — "soul") is a **personal dashboard** — not a portfolio, not a resume site. It's the page I open every single day. Think of it as a digital command center that reflects what I'm doing, watching, playing, reading, and building *right now*.

### Why Build This?

Most developers have portfolios. But a portfolio is outward-facing — it shows what you've done. Tamashi is **inward-facing** — it shows what you're *currently* doing. It's a living document of my life across multiple dimensions:

- 🎵 **Music** — What am I listening to right now?
- 🎮 **Gaming** — What game am I grinding? What trophies have I earned?
- 📺 **Anime** — What am I watching? How many have I completed?
- 🗺️ **Goals** — Where am I in my life roadmap?
- 🔥 **Productivity** — Am I maintaining my task streak?
- 💻 **Learning** — What am I currently studying?
- 📝 **Writing** — What have I been thinking about?
- 🏃 **Fitness** — Am I keeping up with my workout goals?

### Tech Stack Decision

| Technology | Why |
|---|---|
| **Next.js 14 (App Router)** | SSR/SSG for performance, API routes for proxying external services, file-based routing for simplicity |
| **Vanilla CSS + CSS Modules** | Full control over the design system, no framework overhead, scoped styles per component |
| **Framer Motion** | Smooth entrance animations and micro-interactions |
| **Lucide React** | Lightweight, consistent icon set |
| **Cheerio** | Server-side HTML parsing for PSNProfiles scraping |

**Why not Tailwind?** I wanted pixel-perfect control over the design system. The obake.blue-inspired aesthetic requires custom CSS variables, specific glassmorphism effects, and precise border/spacing that's easier to manage with vanilla CSS. Tailwind would add unnecessary abstraction for a deeply customized design.

**Why not a database?** This is a personal dashboard. Most data is either pulled from external APIs (Spotify, AniList) or stored in local JSON files that I edit manually. A database would be overkill — JSON files are version-controlled, easy to edit, and deploy-friendly.

### Architecture at a Glance

```
┌─────────────────────────────────────────┐
│              BROWSER (Client)           │
│                                         │
│  page.js ─── assembles 14 components   │
│  ├── DigitalClock (client-side state)   │
│  ├── QuoteOfTheDay (daily rotation)     │
│  ├── WallpaperBackground (random img)   │
│  ├── SpotifyNowPlaying ─── polls API ──┐│
│  ├── SpotifyTopArtists ─── polls API ──┤│
│  ├── PSNProfile ─── polls API ─────────┤│
│  ├── AniListStats ─── polls API ───────┤│
│  ├── LifeRoadmap (static JSON import)  ││
│  ├── TaskStreak (static JSON import)   ││
│  ├── CurrentlyGrinding (static JSON)   ││
│  ├── BlogPosts (static JSON import)    ││
│  ├── AgentLogs (static JSON import)    ││
│  ├── RunningGymTracker (static JSON)   ││
│  └── BuyMeACoffee (static)             ││
│                                         │
├─────────────────────────────────────────┤
│              SERVER (API Routes)        │
│                                         │
│  /api/spotify/now-playing ──── Spotify  │◄── OAuth Refresh Token
│  /api/spotify/top-artists ──── Spotify  │◄── OAuth Refresh Token
│  /api/psn ─────────────────── Scraper   │◄── Cheerio + HTTP
│  /api/anilist ─────────────── GraphQL   │◄── Public API
└─────────────────────────────────────────┘
```

---

*Continue to [Design System & Inspiration →](./02-design-system.md)*
