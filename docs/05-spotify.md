# 🎵 Spotify Integration

The Spotify integration is the most complex feature in terms of authentication. It requires an OAuth2 flow with refresh tokens.

## Architecture

```
Browser                    Next.js API Route            Spotify API
  │                              │                          │
  │  fetch('/api/spotify/…')     │                          │
  ├─────────────────────────────►│                          │
  │                              │  POST /api/token         │
  │                              │  (refresh_token → token) │
  │                              ├─────────────────────────►│
  │                              │◄─────────────────────────┤
  │                              │  access_token            │
  │                              │                          │
  │                              │  GET /v1/me/player/…     │
  │                              │  (Bearer access_token)   │
  │                              ├─────────────────────────►│
  │                              │◄─────────────────────────┤
  │                              │  now playing data        │
  │  { title, artist, … }       │                          │
  │◄─────────────────────────────┤                          │
```

### Why a Proxy?

1. **API keys stay server-side** — Client never sees `SPOTIFY_CLIENT_SECRET`
2. **Token refresh happens automatically** — The API route refreshes the access token on every request using the long-lived refresh token
3. **No CORS issues** — Browser calls our own API, which calls Spotify

## The OAuth2 Refresh Token Flow

### One-Time Setup (Manual)

This is the part you have to do once:

```
1. Create app at https://developer.spotify.com/dashboard
2. Set redirect URI: http://localhost:3000/api/spotify/callback
3. Visit this URL in browser:
   https://accounts.spotify.com/authorize?
     client_id=YOUR_CLIENT_ID&
     response_type=code&
     redirect_uri=http://localhost:3000/api/spotify/callback&
     scope=user-read-currently-playing user-read-recently-played user-top-read
4. After authorization, grab the `code` from the URL
5. Exchange it for tokens:
   curl -X POST https://accounts.spotify.com/api/token \
     -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=…&client_id=…&client_secret=…"
6. Save the `refresh_token` — it never expires
```

### Automatic Token Refresh (Per Request)

```javascript
async function getAccessToken() {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();  // { access_token: "...", ... }
}
```

The refresh token is eternal — once you have it, you never need to re-authenticate. Each API request gets a fresh access token.

## Now Playing Component

### Client-Side Polling

```jsx
useEffect(() => {
  async function fetchNowPlaying() {
    const res = await fetch('/api/spotify/now-playing');
    const json = await res.json();
    setData(json);
  }

  fetchNowPlaying();
  const interval = setInterval(fetchNowPlaying, 30000);  // Every 30 seconds
  return () => clearInterval(interval);
}, []);
```

### Why 30 Seconds?

- Too fast (5s) = excessive API calls, risk of rate limiting
- Too slow (5min) = stale data, feels broken
- 30 seconds = reasonable compromise for a "live" feel

### Progress Bar Interpolation

The real magic: between API polls, the progress bar moves smoothly.

```jsx
useEffect(() => {
  if (!data?.isPlaying) return;
  const interval = setInterval(() => {
    setProgress(prev => {
      const increment = (1000 / data.durationMs) * 100;  // 1 second as % of total
      return Math.min(prev + increment, 100);
    });
  }, 1000);
  return () => clearInterval(interval);
}, [data]);
```

Every second, the progress bar advances by `(1 second / total duration) * 100%`. This creates a smooth, real-time progress bar that only corrects itself every 30 seconds when the API is polled.

### Album Art Glow Effect

```jsx
<div className={styles.artWrapper}>
  <img src={data.albumArt} className={styles.art} />
  <div className={styles.artGlow} style={{ backgroundImage: `url(${data.albumArt})` }} />
</div>
```

The glow is the *same album art* but blurred and offset:

```css
.artGlow {
  position: absolute;
  top: 4px; left: 4px;
  right: -4px; bottom: -4px;
  filter: blur(20px);
  opacity: 0.4;
}
```

This creates a colored glow behind the album art that matches the cover's dominant colors. It's a premium touch that makes the player feel alive.

### Three States

1. **`needsSetup: true`** — No API keys configured. Shows disc icon + setup instructions.
2. **`isPlaying: true`** — Music is playing. Shows album art, track info, progress bar.
3. **`isPlaying: false`** — Nothing playing. Shows "Not playing right now" with muted icon.

### Struggle: Spotify Returns 204

When nothing is playing, Spotify returns a `204 No Content` response with an empty body. Trying to parse this as JSON crashes the app:

```javascript
if (response.status === 204 || response.status > 400) {
  return NextResponse.json({ isPlaying: false });
}
```

This guard catches the empty response before attempting `.json()`.

## Top Artists Component

### Time Range Toggle

```jsx
const TIME_RANGES = [
  { value: 'short_term', label: '4 Weeks' },
  { value: 'medium_term', label: '6 Months' },
  { value: 'long_term', label: 'All Time' },
];
```

Spotify supports three time ranges for top artists. The active range gets a green-border pill button:

```css
.active {
  border-color: var(--spotify) !important;  /* Spotify green */
  color: var(--spotify) !important;
  background: rgba(29, 185, 84, 0.08) !important;
}
```

### Ranked Grid with Index Numbers

Each artist card shows its rank in the top-right corner:

```jsx
<div className={styles.rank}>{String(i + 1).padStart(2, '0')}</div>
```

Zero-padded (`01`, `02`, `03`…) matching the obake.blue index number aesthetic.

### Image Desaturation Effect

```css
.artistImg {
  filter: grayscale(20%);
  transition: filter 0.2s;
}

.artistCard:hover .artistImg {
  filter: grayscale(0%);  /* Full color on hover */
}
```

Artist images are slightly desaturated by default, becoming fully colorful on hover. This keeps the dark dashboard aesthetic while still showing the images.

---

*Continue to [PlayStation Profile Scraper →](./06-psn.md)*
