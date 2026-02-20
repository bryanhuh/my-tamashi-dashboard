# 🗺️ Life Roadmap & Productivity Components

## Life Roadmap

### The Thinking

A roadmap isn't a to-do list. It's a visual representation of where you've been, where you are, and where you're headed. The design choice was a **vertical timeline** — simple, scannable, and naturally maps to chronological progression.

### Data Structure

```json
{
  "id": 3,
  "title": "Dive into AI & LLMs",
  "category": "Skills",
  "status": "in-progress",
  "year": "2025",
  "description": "Study agents, MCP, agentic workflows, and build AI-powered tools"
}
```

Each milestone has exactly 5 fields. The `status` field drives the visual presentation:
- **`done`** → Filled dot (solid color)
- **`in-progress`** → Pulsing dot (animation)
- **`planned`** → Outlined dot, muted text

### Color-Coded Categories

```javascript
const categoryColors = {
  Career: '#7c5cfc',     // Purple
  Skills: '#2b00ff',     // Cobalt blue (accent)
  Health: '#00d4aa',     // Teal
  Personal: '#ff6b35',   // Orange
  Financial: '#ffdd00',  // Yellow
};
```

Each category gets a unique color applied to:
- The timeline dot border
- The category tag border and text

This means scanning the timeline, you can immediately see the distribution of your goals — "lots of blue dots means I'm skills-heavy, maybe I need more green health goals."

### The Timeline CSS

```css
.timeline {
  position: relative;
  padding-left: 24px;
}

.line {
  position: absolute;
  left: 7px;        /* Centered with the dots */
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border);
}

.dot {
  position: absolute;
  left: -24px;      /* Placed on the line */
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  background: var(--bg-base);  /* Hollow by default */
  z-index: 1;
}

.done .dot {
  background: var(--accent);   /* Filled when done */
}
```

The vertical line is a single 1px element. Dots are absolutely positioned on top of it. This approach is more flexible than using CSS `::before` on each item — the line is continuous across the entire timeline.

### Server Component

Life Roadmap is a **Server Component** (no `'use client'`). The data is imported statically:

```jsx
import roadmapData from '@/data/roadmap.json';
```

This means the HTML is generated at build time — zero JavaScript shipped to the client for this component.

---

## Task Streak (GitHub-Style Heatmap)

### The Thinking

GitHub's contribution graph is one of the best visualizations for consistency. A streak tracker needs to answer three questions at a glance:
1. Am I being consistent? (the heatmap pattern)
2. How am I doing right now? (current streak)
3. What's my peak? (longest streak)

### Data Structure

```json
{
  "currentStreak": 12,
  "longestStreak": 34,
  "totalCompleted": 247,
  "weeks": [
    [
      {"date": "2025-01-06", "count": 3, "level": 3},
      {"date": "2025-01-07", "count": 2, "level": 2},
      ...
    ],
    ...
  ]
}
```

The `weeks` array contains 12 arrays (one per week), each with 7 day objects. The `level` (0-4) maps to visual intensity.

### Heatmap Rendering

```jsx
{weeks.map((week, wi) => (
  <div key={wi} className={styles.week}>
    {week.map((day, di) => (
      <div key={di} className={styles.day} title={`${day.date}: ${day.count} tasks`}>
        <div className={styles.dayFill} style={{
          opacity: day.level === 0 ? 0.08 : day.level * 0.25 + 0.1,
          background: day.level > 0 ? 'var(--accent)' : 'var(--text-muted)',
        }} />
      </div>
    ))}
  </div>
))}
```

### Design Decision: Raw CSS vs. Library

I considered using a heatmap library (like `react-calendar-heatmap`). But the implementation is simple enough that a custom solution gives me full styling control:
- **12px × 12px cells** with 3px gaps
- **Cobalt blue intensity** that matches the accent color
- **Tooltip on hover** showing the date and count

---

## Currently Grinding

### The Thinking

This might be the most personal section. It answers "What is Bryan working on RIGHT NOW?" across all areas of life — not just coding.

### Category System

```javascript
const categoryEmojis = {
  coding: '💻',
  learning: '📚',
  gaming: '🎮',
  fitness: '🏋️',
};
```

Emojis provide instant visual categorization without needing custom icons or color legend explanations.

### Status Badge

```jsx
<span className={styles.statusBadge}
  style={{ color: statusColors[item.status], borderColor: statusColors[item.status] }}>
  {item.status}
</span>
```

Each item has a pill-shaped status badge:
- **Active** → Blue accent
- **Paused** → Orange warning
- **Done** → Teal success

Inline styles are used here because the colors vary per item — CSS modules can't handle runtime-dynamic values.

### Progress Bars

Each grinding item has a progress bar using the global `progressBar` class. The width is set via inline `style={{ width: '${item.progress}%' }}`. This creates smooth animated fills thanks to the CSS transition defined globally.

---

*Continue to [Blog & Agent Logs →](./09-content.md)*
