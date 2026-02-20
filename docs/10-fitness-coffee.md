# 🏃 Fitness Tracker & ☕ BuyMeACoffee

## RunningGymTracker

### The Thinking

A fitness section adds a dimension most developer dashboards skip. It shows commitment beyond code — discipline in physical health parallels discipline in development.

### Component Sections

The fitness tracker packs a lot of data into a single component:

```
┌─────────────────────────────────────┐
│  🔥 5 day streak                    │  ← Streak banner
├─────────────────────────────────────┤
│  9.5 km / 15 km    ████████░░       │  ← Weekly running progress
│  3 sessions / 4    ████████░░░      │  ← Weekly gym progress
├─────────────────────────────────────┤
│  Last Run                           │
│  4.2km  24:30  5:50/km  320cal     │  ← 4-column stat grid
├─────────────────────────────────────┤
│  Last Gym — Upper Body              │
│  Bench Press          4×8-10        │  ← Exercise list
│  Overhead Press       3×10          │
│  Dumbbell Rows        4×12          │
│  Lateral Raises       3×15          │
├─────────────────────────────────────┤
│  Monthly: 38/60 km  ██████░░░       │  ← Monthly progress
└─────────────────────────────────────┘
```

### The Streak Banner

```jsx
<div className={styles.streakBanner}>
  <Flame size={16} className={styles.flameIcon} />
  <span className={styles.streakCount}>{workoutStreak} day streak</span>
</div>
```

Styled with the `--fire` orange color and a subtle tinted background:

```css
.streakBanner {
  border: 1px solid rgba(255, 107, 53, 0.2);
  background: rgba(255, 107, 53, 0.04);
}
```

This is a departure from the blue accent — the fire color draws attention to the streak. Color variety in specific sections prevents the dashboard from feeling monotone.

### Progress Bar Color Coding

```jsx
{/* Running → teal (success) */}
<div className="progressFill" style={{ width: `${runProgress}%`, background: 'var(--success)' }} />

{/* Gym → blue (accent) */}
<div className="progressFill" style={{ width: `${gymProgress}%`, background: 'var(--accent)' }} />

{/* Monthly → orange (fire) */}
<div className="progressFill" style={{ width: `${monthlyKmPct}%`, background: 'var(--fire)' }} />
```

Three different colors for three different metrics. Each uses the global `progressBar` base but with unique fill colors.

### Exercise List Layout

```css
.exercise {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid var(--border);
  font-family: var(--font-mono);
}

.exerciseName { color: var(--text-secondary); }
.exerciseDetail { color: var(--accent-light); font-weight: 500; }
```

Each exercise is a row with name on the left and sets×reps on the right. The reps are highlighted in accent blue — the important number stands out.

### Data Source Philosophy

Currently using local JSON (`fitness.json`). Future improvement: integrate Strava API for automatic running data or Apple Health via HealthKit.

---

## BuyMeACoffee

### The Thinking

The simplest component, but it serves an important purpose — it humanizes the dashboard. "This person builds cool things AND accepts coffee" is more approachable than a cold, data-only dashboard.

### Placeholder Design

Since the user hasn't finished BuyMeACoffee onboarding:

```jsx
<a href="#" className={styles.button}>
  <Coffee size={16} />
  <span>Buy Me a Coffee</span>
  <Heart size={12} className={styles.heart} />
</a>
<span className={styles.hint}>BuyMeACoffee link coming soon</span>
```

The `href="#"` is intentional — it's a placeholder that clicks to nowhere. The "coming soon" hint sets expectations.

### The Yellow Button

```css
.button {
  background: var(--coffee);    /* #ffdd00 — BuyMeACoffee brand yellow */
  color: #1a1a2e;               /* Dark text on yellow */
  border-radius: 100px;         /* Fully rounded */
  padding: 10px 24px;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 221, 0, 0.25);
}
```

This is the only element that uses the BuyMeACoffee yellow as a background. Everything else uses it as an accent. The button literally *pops* against the dark dashboard.

### Floating Coffee Animation

```css
.icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
```

The ☕ emoji gently floats up and down. It's a small, delightful touch — the kind of micro-animation that makes a dashboard feel alive.

### Heart Pulse

```css
.heart {
  animation: pulse 1.5s ease-in-out infinite;
}
```

The ❤️ icon pulses next to "Buy Me a Coffee". Combined with the float animation, the whole section has a warm, inviting energy.

---

*Continue to [Challenges & Lessons Learned →](./11-challenges.md)*
