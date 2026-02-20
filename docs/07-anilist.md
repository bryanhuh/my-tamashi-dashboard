# 📺 AniList GraphQL Integration

## Why AniList Was the Easiest Integration

Unlike Spotify (OAuth) and PSN (scraping), AniList has a **public GraphQL API** that requires no authentication for public profiles. This makes it the cleanest integration in the entire project.

## GraphQL Query Design

```graphql
query ($username: String) {
  User(name: $username) {
    avatar { medium }
    statistics {
      anime {
        count
        meanScore
        minutesWatched
        episodesWatched
      }
      manga {
        count
        chaptersRead
        volumesRead
      }
    }
  }
  MediaListCollection(userName: $username, type: ANIME, status: CURRENT) {
    lists {
      entries {
        progress
        media {
          title { english romaji }
          episodes
          coverImage { medium }
        }
      }
    }
  }
}
```

### Query Design Decisions

**Two root queries in one request.** GraphQL allows batching — instead of making separate requests for user stats and currently watching list, we ask for both in a single query. This halves the number of network requests.

**`english` with `romaji` fallback.** Many anime don't have English titles. By requesting both, the component can display `title.english || title.romaji`.

**`status: CURRENT`** — Only fetches anime the user is currently watching, not the full list of 1000+.

## API Route Implementation

```javascript
export async function GET() {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: ANILIST_QUERY,
      variables: { username: ANILIST_USERNAME },
    }),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  const json = await response.json();
```

### Why 1 Hour Cache?

AniList data changes when:
- You mark an episode as watched
- You add a new anime to your list
- Your mean score changes

None of these happen more than a few times a day. 1-hour caching is aggressive enough to feel fresh while being respectful to AniList's servers.

## Data Transformation

### Minutes to Days

```javascript
daysWatched: ((animeStats.minutesWatched || 0) / 60 / 24)
```

AniList returns `minutesWatched` (e.g., `403,776` minutes). We convert to days because "280.4 days" is more impactful than "403,776 minutes".

### Currently Watching List

```javascript
const watching = [];
const lists = listData?.lists || [];
for (const list of lists) {
  for (const entry of list.entries || []) {
    watching.push({
      title: entry.media.title.english || entry.media.title.romaji,
      progress: entry.progress,
      episodes: entry.media.episodes,
      coverImage: entry.media.coverImage?.medium,
    });
  }
}
return { watching: watching.slice(0, 5) };  // Max 5 shown
```

The `MediaListCollection` can have multiple lists (custom lists). We flatten all entries and take the first 5 — more than enough for a dashboard widget.

## Component: 4-Stat Grid + Currently Watching

### Stats Grid

```jsx
<div className={styles.statsGrid}>
  <div className={styles.stat}>
    <Tv size={16} />
    <span className={styles.statValue}>{stats.animeCount}</span>
    <span className={styles.statLabel}>Anime</span>
  </div>
  {/* manga, mean score, days watched */}
</div>
```

A 2×2 grid showing the four key metrics. Each stat has:
1. An icon (from Lucide)
2. A large number value (monospace, 1.3rem)
3. A tiny uppercase label

### Currently Watching List

```jsx
{watching.slice(0, 4).map((anime) => (
  <div className={styles.watchingItem}>
    <img src={anime.coverImage} className={styles.watchingImg} />
    <div className={styles.watchingInfo}>
      <span className={styles.watchingTitle}>{anime.title}</span>
      <span className={styles.watchingProgress}>
        Ep {anime.progress}{anime.episodes ? ` / ${anime.episodes}` : ''}
      </span>
    </div>
  </div>
))}
```

Each item shows:
- **Cover image** — 36×50px, matching anime poster aspect ratio
- **Title** — Truncated with `text-overflow: ellipsis`
- **Progress** — "Ep 150 / 293" in AniList blue

### The Data Was Real

During verification, AniList returned live data for the `breezarre` profile:
- 1310 anime watched
- 310 manga read
- 84.13 mean score
- Currently watching: Boruto (Ep 150/293), Gurren Lagann, Summer Wars, Re:ZERO

This was satisfying — the API worked on the first try with no credential setup needed.

---

*Continue to [Productivity Components →](./08-productivity.md)*
