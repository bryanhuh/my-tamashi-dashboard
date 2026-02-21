/**
 * Spotify Now Playing API Route
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://developer.spotify.com/dashboard
 * 2. Create a new app
 * 3. Set redirect URI to: http://localhost:3000/api/spotify/callback
 * 4. Copy Client ID and Client Secret
 * 5. Generate a refresh token:
 *    - Visit: https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/api/spotify/callback&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read
 *    - After authorization, you'll get a code in the URL
 *    - Exchange it for tokens:
 *      curl -X POST https://accounts.spotify.com/api/token \
 *        -H "Content-Type: application/x-www-form-urlencoded" \
 *        -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://localhost:3000/api/spotify/callback&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
 *    - Save the refresh_token from the response
 * 6. Add to .env.local:
 *    SPOTIFY_CLIENT_ID=your_client_id
 *    SPOTIFY_CLIENT_SECRET=your_client_secret
 *    SPOTIFY_REFRESH_TOKEN=your_refresh_token
 */

import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';

async function getAccessToken() {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
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

  return response.json();
}

export async function GET() {
  if (!client_id || !client_secret || !refresh_token) {
    return NextResponse.json({ isPlaying: false, needsSetup: true });
  }

  try {
    const tokenData = await getAccessToken();
    const { access_token } = tokenData;

    if (!access_token) {
      console.error('Spotify token error:', tokenData);
      return NextResponse.json({ isPlaying: false, error: 'Token fetch failed', detail: tokenData });
    }

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (response.status === 204) {
      return NextResponse.json({ isPlaying: false });
    }

    if (response.status >= 400) {
      const errBody = await response.json().catch(() => ({}));
      console.error('Spotify API error:', response.status, errBody);
      return NextResponse.json({ isPlaying: false, error: `Spotify ${response.status}`, detail: errBody });
    }

    const song = await response.json();

    if (!song.item) {
      return NextResponse.json({ isPlaying: false });
    }

    return NextResponse.json({
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((a) => a.name).join(', '),
      album: song.item.album.name,
      albumArt: song.item.album.images?.[0]?.url,
      songUrl: song.item.external_urls.spotify,
      progressMs: song.progress_ms,
      durationMs: song.item.duration_ms,
    });
  } catch (error) {
    console.error('Spotify error:', error);
    return NextResponse.json({ isPlaying: false, error: 'Failed to fetch', detail: error.message });
  }
}
