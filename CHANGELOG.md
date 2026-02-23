# Changelog

## [2026-02-23] - Grind & Fitness Section Redesign

- **New Grind Section**: Extracted `CurrentlyGrinding` and `RunningGymTracker` out of the stagger grid into a new shared full-width blue section (`grindSection`), mirroring the Gaming/AniList section pattern with a centered italic serif intro line.
- **CurrentlyGrinding**:
  - All item cards are now white with clean box shadows on the blue background.
  - Status badges use square corners (no border-radius).
  - All items set to `active` status.
  - Progress bars are now **fully draggable** — click, drag, or touch to manually adjust each item's progress percentage.
  - Stagger offset applied at the layout level (`margin-top: 80px`) matching PSN/AniList visual rhythm.
- **RunningGymTracker**:
  - All stat blocks, last run, last gym session, and monthly progress now use white cards.
  - Streak banner uses a frosted translucent white style on the blue background.
  - Exercise rep details tinted blue for visual consistency.

## [2026-02-23] - Life Roadmap Redesign & Component Cleanup

- **Life Roadmap**: Completely redesigned the `LifeRoadmap` component with a creative alternating zig-zag card layout.
  - Extracted from the main staggered grid into its own full-width `100vw / min-height: 100vh` section with a white background.
  - Cards use a blue (`#2b00ff`) background with white borders and white typography, fading in with a smooth `framer-motion` entrance animation.
  - Year labels use the display serif typeface at large scale for visual impact.
  - Each card is connected to the next by a unique animated SVG hand-drawn path that draws itself on scroll.
  - Paths start and end at different corners of each card, cycling through 4 varied curve patterns per alternation side.
- **Component Cleanup**: Commented out `TaskStreak` and `AgentLogs` components in `app/page.js`.
- **Roadmap Data**: Updated `data/roadmap.json` with revised milestone entries.


## [2026-02-23] - Gaming Layout & Stylistic Refinements
- **Gaming & Anime Section**: Grouped PSN Profile and AniList Stats into a new, 100% width `.gamingSection` container.
- **Staggered Design**: Applied a staggered masonry-style layout to the PSN and AniList components. Added an immersive introduction phrase to the section.
- **Component Refinements**: 
  - `AniListStats`: Relocated the profile link into the header as a standalone icon to match the PSN profile link.
  - `PSNProfile`: Replaced plaintext trophy icons with `Trophy` SVGs from `lucide-react`. Clarified that "Recent Games" reflects activity due to API limitations on purchase history.
- **Aesthetic Integration**: 
  - Restored the initial hero section's background to pure white.
  - Aligned the Spotify `musicFull` and `gamingSection` backgrounds to the same cobalt blue accent (`var(--accent)`).
  - Adjusted the Spotify canvas overlay to be transparent with white gridlines and particles, ensuring clarity against the blue container.
  - Made the `AniListStats` and `PSNProfile` cards solid white to contrast cleanly.

## [2026-02-22] - Layout & Constellation Animations
- **Spotify Now Playing**: Added an `osaka.png` image to the "Not playing right now" empty state to add some personality.
- **Layout Adjustments**: Refactored the staggered grid in `app/page.js` so the Hero section and the Top Artists section natively span `100%` width and `100vh` without being constrained by grid columns.
- **Top Artists Aesthetics**: Updated the Top Artists container to use a solid blue background with white text, and styled the active filter button to be solid black with white text.
- **Framer Motion Integration**: Replaced static CSS fade-ins with `framer-motion`, orchestrating a staggered, spring-based entrance animation for the constellation stars, central glow, and UI elements.

## [2026-02-22] - Spotify Drawer & Particle Shader
- **Spotify Artist Details API (`/api/spotify/artist-details`)**: New endpoint fetching artist info, top tracks, releases, and related artists.
- **Artist Drawer (`ArtistDrawer`)**: Slide-in frosted glass panel revealing detailed statistics triggered on artist selection.
- **Magical Particle Shader (`ArtistEffect`)**: Custom Three.js GLSL shader utilizing WebGL and Perlin Noise for a vanishing wind effect.
- **Top Artists Scaling**: Increased fetched results limit from **8** up to **20** to form a denser orbital constellation.
- **Background Adjustments**: Swapped 3D globe out for a horizontally-panning flat 2D ASCII world map.
- Removed default ASCII Spotify logo branding from the bottom layer and turned puzzle grid lines into solid cobalt `--accent` blue.
- Updated `ArtistDrawer` font-family to sync with `DigitalClock` serif guidelines and updated Close/Play button accents.
- Resolved `mix-blend-mode` collisions on Three.js shaders.
- Added `three` dependency to `package.json`.
