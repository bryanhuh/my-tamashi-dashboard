# Changelog

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
