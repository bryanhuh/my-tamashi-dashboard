# ⏰ Hero Section: Clock, Quote & Wallpaper

The hero is the first thing you see every day. It needs to feel *alive* — a real-time clock, a daily quote, and a random atmospheric wallpaper.

## DigitalClock Component

### The Thinking

A dashboard needs a clock. But not just any clock — it needs to feel like a command center. Think sci-fi HUD, not alarm clock widget.

### Implementation

```jsx
'use client';  // Required for useState + setInterval

import { useState, useEffect } from 'react';

export default function DigitalClock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const update = () => setTime(new Date());
    update();  // Set immediately (don't wait 1 second)
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);  // Cleanup on unmount
  }, []);

  if (!time) return null;  // Prevent hydration mismatch
```

### Key Design Decisions

**1. `useState(null)` + hydration guard**

The biggest gotcha with SSR clocks: the server renders at one time, the client hydrates at a different time. This causes a hydration mismatch error. By initializing as `null` and returning `null` until the client mounts, we avoid this entirely.

**2. Individual character rendering**

```jsx
{timeStr.split('').map((char, i) => (
  <span key={i} className={char === ':' ? styles.colon : styles.digit}>
    {char}
  </span>
))}
```

Each character is a separate `<span>`. This allows:
- **Colons** to pulse with a separate animation (`pulse 2s ease-in-out infinite`)
- **Digits** to have `min-width: 0.65em` so the clock doesn't jump when numbers change width (e.g., `1` vs `0`)
- Future: per-digit flip animations

**3. Greeting logic**

```jsx
const hours = time.getHours();
const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
```

Simple three-way split. Personalized with "Bryan" hardcoded (it's a personal dashboard).

### Styling Highlights

```css
.time {
  font-family: var(--font-mono);      /* JetBrains Mono */
  font-size: clamp(3rem, 8vw, 6rem); /* Responsive: 3rem min, 6rem max */
  font-weight: 300;                   /* Light weight = elegant */
  letter-spacing: 0.05em;
}

.colon {
  color: var(--accent);               /* Blue */
  animation: pulse 2s ease-in-out infinite;  /* Blink effect */
}
```

The `clamp()` function makes the clock responsive — it scales with viewport width but never gets too small or too large.

---

## QuoteOfTheDay Component

### The Thinking

A daily quote adds personality. But I didn't want to depend on an external API (they go down, have rate limits, etc.). Solution: a local array of curated quotes with deterministic daily rotation.

### Implementation

```jsx
useEffect(() => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % fallbackQuotes.length;
  setQuote(fallbackQuotes[index]);
}, []);
```

### Why Day-of-Year?

Using `Math.random()` would give a different quote on every page load (annoying). Using `dayOfYear % quotes.length` ensures:
- **Same quote all day** — Consistent experience
- **Different quote tomorrow** — Freshness
- **Deterministic** — No API needed, no randomness issues
- **Cycles through all quotes** — Every quote gets shown

### The Quote Selection

14 curated quotes mixing programming wisdom (Kent Beck, Linus Torvalds) with life wisdom (Marcus Aurelius, Aristotle). This reflects the dashboard's dual nature — code + life.

---

## WallpaperBackground Component

### The Thinking

A dashboard on a solid dark background is boring. A wallpaper adds atmosphere — but it can't overpower the content. The solution: a random wallpaper at very low opacity with multiple overlay layers.

### Implementation

```jsx
const wallpapers = [
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80',
  // ... 9 more curated URLs
];

useEffect(() => {
  const index = Math.floor(Math.random() * wallpapers.length);
  const img = new Image();
  img.onload = () => {
    setWallpaper(wallpapers[index]);
    setLoaded(true);
  };
  img.src = wallpapers[index];
}, []);
```

### Design Decision: Hardcoded URLs vs. Unsplash API

I chose hardcoded Unsplash URLs because:
1. **No API key needed** — Unsplash API requires registration
2. **Curated quality** — I hand-picked images that work with the dark theme
3. **Fast loading** — Direct CDN URLs, no API round-trip
4. **Never breaks** — Unsplash CDN is extremely reliable

### The Four Layers

```jsx
<div className={styles.background}>
  <div className={styles.image} />     {/* Wallpaper at 25% opacity */}
  <div className={styles.overlay} />   {/* Dark gradient overlay */}
  <div className={styles.noise} />     {/* Subtle noise texture */}
  <div className={styles.vignette} />  {/* Edge darkening */}
</div>
```

**Layer 1: Image** — 25% opacity with a slow zoom animation (`transform: scale(1.05) → scale(1)` over 20 seconds). This creates a subtle cinematic "breathing" effect.

**Layer 2: Overlay** — A gradient from 90% dark at the top to 95% dark at the bottom. This ensures text is always readable regardless of the wallpaper.

**Layer 3: Noise** — An SVG-based noise texture at 3% opacity. This adds film-grain quality and prevents the background from looking too clean/digital.

**Layer 4: Vignette** — Radial gradient darkening the edges. Draws the eye toward the center where the clock lives.

### Struggle: Image Load Flash

When the wallpaper loads, there's a brief flash from dark → image. I solved this with a CSS transition:

```css
.image {
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 2s var(--ease-out), transform 20s linear;
}

.image.loaded {
  opacity: 0.25;
  transform: scale(1);
}
```

The image starts invisible and slowly fades in over 2 seconds. The user never sees a jarring pop — just a gentle atmospheric reveal.

---

*Continue to [Spotify Integration →](./05-spotify.md)*
