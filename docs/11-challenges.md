# ⚡ Challenges & Lessons Learned

## Development Challenges

### 1. The `create-next-app` Conflict

**Problem:** I had already created `PLAN.md` in the project directory before running `create-next-app`. The CLI refuses to initialize in a non-empty directory.

**Solution:** Moved PLAN.md to `/tmp/`, ran the initializer, moved it back. Simple but annoying.

**Lesson:** Always initialize the project first, plan second. Or use a temporary directory for scaffolding.

---

### 2. SSR Hydration Mismatch with DigitalClock

**Problem:** Server renders the clock at time X, client hydrates at time Y. React throws a hydration mismatch error because the HTML doesn't match.

**Solution:**
```jsx
const [time, setTime] = useState(null);
if (!time) return null;  // Don't render during SSR
```

By initializing state as `null` and rendering nothing until the client mounts, we avoid the mismatch entirely. The clock simply appears once the client is ready.

**Lesson:** Any component that depends on real-time client data (Date, window dimensions, localStorage) needs this pattern in Next.js.

---

### 3. Spotify 204 No Content Response

**Problem:** When Spotify returns 204 ("nothing playing"), the response body is empty. Calling `.json()` on an empty body throws an error.

**Solution:**
```javascript
if (response.status === 204 || response.status > 400) {
  return NextResponse.json({ isPlaying: false });
}
```

Check the status code *before* attempting to parse the body.

**Lesson:** Always handle non-200 responses before parsing. APIs can return empty bodies, redirects, or error pages.

---

### 4. PSNProfiles HTML Structure Instability

**Problem:** PSNProfiles updates their HTML layout periodically. CSS selectors that work today might break tomorrow. During development, the primary selectors didn't find the expected elements.

**Solution:** Implemented a three-tier fallback system:
1. Try primary CSS selectors (`#gamesTable tr`, `.title`, etc.)
2. Try alternative selectors (`.recent-game`, `.game-image-holder`)
3. Fall back to a minimal placeholder response

**Lesson:** When scraping, NEVER trust a single selector. Build fallbacks and always return a valid response even if scraping partially fails. The component should show "Could not load data" gracefully, not crash.

---

### 5. CSS Modules + Global Classes

**Problem:** I wanted shared utility classes (`.card`, `.pill`, `.tag`, `.progressBar`) that work across all components, But CSS Modules scope everything locally by default.

**Solution:** Global classes are defined in `globals.css` without CSS Modules syntax. Components use them as plain class names:

```jsx
{/* This uses the global "pill" class + local module class */}
<a className={`pill ${styles.profileLink}`}>
```

CSS Modules classes are accessed via `styles.xxx`, while global classes are used as literal strings. They compose naturally.

**Lesson:** CSS Modules and global styles coexist well. Use modules for component-specific styles, globals for the design system.

---

### 6. External Image Domains

**Problem:** Next.js blocks images from external domains by default for security. Spotify album art, AniList cover images, and PSNProfiles game images would all fail to load.

**Solution:** Configure `next.config.mjs`:
```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'i.scdn.co' },          // Spotify
    { protocol: 'https', hostname: 's4.anilist.co' },       // AniList
    { protocol: 'https', hostname: 'psnprofiles.com' },     // PSN
    { protocol: 'https', hostname: 'images.unsplash.com' }, // Wallpapers
  ],
},
```

Note: The components use `<img>` tags, not Next.js `<Image>` (which requires width/height). For external, dynamic images where dimensions aren't known, plain `<img>` with CSS sizing is simpler.

**Lesson:** Plan your external image sources early. Every new CDN requires a config update and redeployment.

---

### 7. Grid Gap as Design Element

**Problem:** I wanted visible grid lines between components (the obake.blue blueprint look), but CSS Grid's `gap` property just adds empty space.

**Solution:** Instead of relying on `gap`, I use borders on each grid child:

```css
.mainGrid {
  gap: var(--gap);  /* 1px */
}

.mainGrid > * {
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.mainGrid > *:nth-child(2n) {
  border-right: none;  /* Right column = no right border */
}
```

The 1px gap + individual borders create a uniform grid line pattern.

**Lesson:** CSS is a creative tool. "Gaps" don't have to be invisible. Borders can be structural design elements, not just decorations.

---

## Architectural Lessons

### Data Proximity

Keep data close to where it's consumed. Static JSON files imported directly by components means:
- No API calls for static data
- Zero loading states for local data
- Data is version-controlled with the code
- Editing is as simple as editing a JSON file

### Graceful Degradation

Every external integration has a fallback:
- Spotify not configured → "Setup instructions" message
- PSN scraping fails → "Could not load data" + link to profile
- AniList fails → Error state with icon

The dashboard ALWAYS renders, regardless of API status. No blank screens, no crashes.

### Single-Purpose Components

Each component does one thing. No component fetches data for another component. No component has logic for something outside its scope. This means:
- Components can be added/removed without breaking others
- Each folder is self-contained (JSX + CSS)
- Testing any component is just testing that one folder

### Color-as-Brand

Each external service keeps its brand color:
- Spotify: `#1db954` (green)
- PlayStation: `#003791` (blue)
- AniList: `#3db4f2` (light blue)
- BuyMeACoffee: `#ffdd00` (yellow)

This creates instant visual recognition — "green section = Spotify" becomes subconscious.

---

## What I'd Do Differently

1. **TypeScript** — For a project this size with multiple data structures, TypeScript interfaces would catch JSON schema mismatches at build time.

2. **ISR (Incremental Static Regeneration)** — The AniList/PSN data could be fetched at build time and revalidated hourly, eliminating loading states entirely.

3. **Content Layer** — Tools like Contentlayer or MDX would make blog posts richer (code highlighting, embedded components) compared to JSON.

4. **Strava API** — Automatic fitness data instead of manually editing `fitness.json`.

5. **Admin Panel** — A simple `/admin` page to edit data files through a form instead of editing JSON directly.

---

## Final Thoughts

Tamashi started as "I want a cool page to open every day" and became a master class in:

- **Design system engineering** — Building from design tokens up
- **API integration patterns** — OAuth, GraphQL, web scraping
- **Component architecture** — Self-contained, composable, resilient
- **CSS as a first-class creative tool** — Not just "making things look right" but "making things feel right"

The project name, Tamashi (魂, "soul"), was chosen because this dashboard IS the soul of my digital life. Every section reflects a piece of who I am — what I listen to, what I play, what I watch, what I build, and what I'm working toward.
