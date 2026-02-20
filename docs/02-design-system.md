# 🎨 Design System & Inspiration

## The Inspiration: obake.blue

Before writing a single line of code, I studied [obake.blue](https://obake.blue/) — a Japanese creative portfolio by a motion graphics artist. What makes it special:

### What I Observed

1. **Strict 2-Color Palette** — The entire site uses cobalt blue (`#2b00ff`) on light grey (`#e5e5e5`). No gradients, no rainbow. Just two colors creating maximum contrast.

2. **Visible Grid Lines** — Instead of hiding the layout grid, obake.blue *shows* it. Thin blue lines divide sections like a technical blueprint or architectural drawing. This gives it an engineered, intentional feel.

3. **PP Neue Machina Typography** — A high-contrast typeface that blends high-tech with vintage typewriter aesthetics. Used for all headings and index numbers.

4. **Massive Index Numbers** — Each work item gets a large "01", "02", etc. in monospace. This creates visual hierarchy without needing different heading sizes.

5. **Staggered Layout** — Content isn't perfectly aligned in boring boxes. Elements are sometimes tilted, offset, or overlapping, creating a dynamic collage effect.

6. **Bold Page Transitions** — A full-page blue wipe happens between pages. High-energy, memorable.

7. **Pill-Shaped Navigation** — Links use thin-bordered pill shapes instead of traditional buttons.

8. **Vertical Text** — Secondary information (copyright, labels) rotated 90° along edges.

### How I Adapted It for Tamashi

I couldn't copy obake.blue directly — it's a light-themed portfolio, and I needed a dark dashboard. Here's how I translated each element:

| obake.blue | Tamashi Adaptation |
|---|---|
| Light grey background `#e5e5e5` | Deep dark `#0a0a14` with wallpaper underneath |
| Cobalt blue `#2b00ff` accent | Same cobalt blue — it *glows* on dark backgrounds |
| PP Neue Machina font | **Space Grotesk** (display) + **JetBrains Mono** (data/code) |
| Visible grid lines | 1px `rgba(43, 0, 255, 0.12)` borders on every card |
| Massive index numbers | Section labels like `01 — NOW PLAYING` in monospace |
| Blue page wipe | `fadeInUp` staggered entrance animations per component |
| Pill navigation | Pill-shaped buttons for links and toggles |
| Light, airy spacing | Dense bento grid — dashboard needs to show more data |

## CSS Custom Properties (Design Tokens)

Every visual decision is stored as a CSS variable in `globals.css`. This means changing the accent color from blue to purple is a single line change.

```css
:root {
  /* The critical ones */
  --accent: #2b00ff;           /* THE color — obake.blue's cobalt */
  --bg-base: #0a0a14;          /* Deep dark base */
  --bg-card: rgba(255, 255, 255, 0.03);  /* Glass cards */
  --border: rgba(43, 0, 255, 0.12);      /* The visible grid lines */
  --font-display: 'Space Grotesk';        /* Headlines */
  --font-mono: 'JetBrains Mono';          /* Data, code, clock */
}
```

### Why These Specific Values?

- **`--bg-card: rgba(255, 255, 255, 0.03)`** — This is *barely visible* transparency. The cards shouldn't feel like cards — they should feel like sections of a blueprint. The wallpaper bleeds through very subtly.

- **`--border: rgba(43, 0, 255, 0.12)`** — The grid lines are visible but not distracting. At 12% opacity, the blue accent creates a faint blueprint pattern. On hover, it jumps to 30% (`--border-hover`) for clear feedback.

- **`--card-radius: 2px`** — obake.blue uses sharp corners. No rounded cards. This creates a technical, engineered feel rather than a friendly/soft one.

## The Card System

Every component sits inside the same base card style:

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);     /* 2px — sharp corners */
  padding: var(--card-padding);           /* 28px */
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card:hover {
  background: var(--bg-card-hover);       /* Slightly more visible */
  border-color: var(--border-hover);      /* Blue becomes more visible */
  box-shadow: 0 0 40px rgba(43, 0, 255, 0.06);  /* Subtle blue glow */
}

/* Top-edge glow line on hover */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-muted), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.card:hover::before {
  opacity: 1;  /* Subtle top-edge highlight appears */
}
```

The `::before` pseudo-element creates a glowing top border on hover — a subtle effect that makes the card feel "alive" when you interact with it.

## Section Index Pattern

Every component starts with a section label:

```html
<div class="sectionIndex">01 — Now Playing</div>
```

```css
.sectionIndex {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--accent);           /* Blue */
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.sectionIndex::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);      /* Extends a line to fill remaining space */
}
```

The `::after` creates a horizontal line that extends from the label text to the edge. This directly mimics obake.blue's blueprint-line aesthetic.

## Animation System

### Entrance Animations

Components animate in with a staggered `fadeInUp`:

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Staggered delays in page.module.css */
.section:nth-child(1) { animation-delay: 0.05s; }
.section:nth-child(2) { animation-delay: 0.1s; }
/* ...and so on */
```

This creates a waterfall effect where components cascade down the page as they appear.

### Micro-Interactions

- **Colon pulse in clock** — The `:` between hours/minutes pulses with a 2-second opacity animation, mimicking a real digital clock
- **Coffee cup float** — The ☕ emoji in BuyMeACoffee floats up and down with a 3-second `translateY` animation
- **Heart pulse** — The ❤️ in BuyMeACoffee button pulses
- **Progress bars** — Width transitions with a 1-second ease-out for smooth fill animations
- **Card hover lift** — Cards lift 2px on hover with a box-shadow glow

## Responsive Strategy

Mobile-first? No — **desktop-first**. This is a dashboard I open on my computer. Mobile is a secondary concern but still handled:

```css
/* Desktop: 2-column grid */
.mainGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;  /* 1px gap = the grid lines */
}

/* Mobile: single column */
@media (max-width: 768px) {
  .mainGrid {
    grid-template-columns: 1fr;
  }
}
```

The `gap: 1px` with border styling creates the visible grid effect — the gap itself IS the grid line.

---

*Continue to [Foundation & Architecture →](./03-foundation.md)*
