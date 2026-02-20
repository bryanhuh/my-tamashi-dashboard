# 🎮 PlayStation Profile Scraper

## The Approach: Web Scraping

PlayStation doesn't offer a public API for trophy data. Sony's API requires authentication and is designed for app developers, not personal use. The solution: **scrape PSNProfiles.com**, a community site that indexes PSN profiles publicly.

### Why PSNProfiles Instead of Sony's API?

1. **No authentication needed** — PSNProfiles is a public website
2. **Rich data** — They parse and display trophy data better than Sony does
3. **Community standard** — Most PSN tracking tools use PSNProfiles
4. **Reliable** — The site has been running for 10+ years

## Server-Side Scraping with Cheerio

```javascript
import * as cheerio from 'cheerio';

export async function GET() {
  const response = await fetch(`https://psnprofiles.com/${PSN_USERNAME}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
    },
    next: { revalidate: 21600 }, // Cache for 6 hours
  });

  const html = await response.text();
  const $ = cheerio.load(html);
```

### Why a User-Agent Header?

Many sites block requests without a browser-like User-Agent. Without it, PSNProfiles might return a 403 or a captcha page. Setting a realistic Chrome-on-Mac User-Agent makes the request look like a normal browser visit.

### Caching Strategy

```javascript
next: { revalidate: 21600 }, // 6 hours
```

Trophy data doesn't change frequently. Caching for 6 hours means:
- Maximum 4 scrape requests per day
- Near-instant responses for subsequent visits
- Respectful to PSNProfiles' servers

## Parsing Trophy Data

### Trophy Counts

```javascript
const trophies = {
  platinum: parseInt($('.platinum').first().text().trim()) || 0,
  gold: parseInt($('.gold').first().text().trim()) || 0,
  silver: parseInt($('.silver').first().text().trim()) || 0,
  bronze: parseInt($('.bronze').first().text().trim()) || 0,
};
```

PSNProfiles uses CSS classes `.platinum`, `.gold`, `.silver`, `.bronze` for trophy count badges. Cheerio's jQuery-like API makes this straightforward.

### Recent Game Extraction

```javascript
const gameRow = $('#gamesTable tr').first();
const gameLink = gameRow.find('a.title').first();
const gameImg = gameRow.find('img').first();
const progressText = gameRow.find('.progress-bar .percentage').first().text();
```

### Struggle: Inconsistent HTML Structure

This was the most challenging part. PSNProfiles uses different HTML structures depending on:
- **Profile privacy settings** — Some elements are hidden
- **Number of games** — Empty profiles have no game table
- **Page layout changes** — The site updates its HTML occasionally

**Solution: Multiple fallback selectors**

```javascript
// Try primary selector
const gameRow = $('#gamesTable tr, .game-table-container table tr, #game-table tr').first();

// If that fails, try alternative structure
if (!recentGame || recentGame.title === 'Unknown Game') {
  const recentGameEl = $('.recent-game, .game-image-holder').first();
  // ... try alternative extraction
}

// If everything fails, provide a minimal response
if (!recentGame) {
  recentGame = {
    title: 'Check PSN Profile',
    image: '',
    trophyProgress: 0,
    platform: 'PS5',
  };
}
```

This three-tier fallback ensures the component always has *something* to display, even if scraping partially fails.

## The Component Display

### Trophy Grid

```jsx
<div className={styles.trophies}>
  <div className={styles.trophy}>
    <span className={styles.trophyIcon}>🏆</span>
    <span className={styles.trophyCount}>{data.trophies?.platinum || 0}</span>
    <span className={styles.trophyLabel}>Platinum</span>
  </div>
  {/* ... gold, silver, bronze */}
</div>
```

A 4-column grid with emoji icons instead of custom icons. Emojis are universally rendered, require no imports, and look great at small sizes.

### Trophy Progress Bar

```jsx
<div className="progressBar">
  <div className="progressFill" style={{ 
    width: `${data.recentGame.trophyProgress}%`, 
    background: 'var(--psn)'  /* PlayStation blue */
  }} />
</div>
```

Uses the global `progressBar` class but with `--psn` blue color to match PlayStation branding.

### Profile Link Pill

```jsx
<a href="https://psnprofiles.com/bryxnhuh" className={`pill ${styles.profileLink}`}>
  <ExternalLink size={12} /> PSN Profile
</a>
```

A pill button using the global `.pill` class, tinted with PSN blue. External links always open in new tabs with `target="_blank" rel="noopener noreferrer"`.

---

*Continue to [AniList GraphQL Integration →](./07-anilist.md)*
