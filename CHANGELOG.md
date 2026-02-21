# Changelog

[2026-02-22]

#added
- **Spotify Artist Details Route (`/api/spotify/artist-details`)**: New comprehensive API endpoint fetching artist info (followers, popularity), top tracks, latest releases, and related artists simultaneously.
- **Drawers Component (`ArtistDrawer`)**: New slide-in frosted glass panel revealing detailed statistics triggered on artist selection, leveraging the new API route.
- **Three.js Magical Particle Shader (`ArtistEffect`)**: Custom GLSL shader component utilizing WebGL and Perlin Noise to display a vanishing, fading particle wind effect anchored in the bottom-left corner of the Top Artists layout.
- Added `three` dependency to `package.json`.

#changed
- **Top Artists Layout**: Scaled Spotify top artist fetched results limit from **8** up to **20** to form a denser orbital "constellation" graph.
- **Background Aesthetics**: Swapped 3D globe visualization out for a horizontally-panning flat 2D ASCII world map.
- Removed default ASCII Spotify logo branding from the bottom layer.
- Turned Top Artists grid lines into a solid cobalt `--accent` blue.
- Updated `ArtistDrawer` section titles and font-family to sync with `DigitalClock` serif style guidelines.
- Changed Drawer Play buttons to accent blue and updated Close button styling.
- Resolved `mix-blend-mode` collisions and texture loader desynchronization on the Three.js shaders.
