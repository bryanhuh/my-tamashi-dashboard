import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const TOP_ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists';

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

export async function GET(request) {
  if (!client_id || !client_secret || !refresh_token) {
    return NextResponse.json({ artists: [], needsSetup: true });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || 'medium_term';

  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(
      `${TOP_ARTISTS_ENDPOINT}?time_range=${range}&limit=8`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const data = await response.json();

    const artists = (data.items || []).map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[1]?.url || artist.images?.[0]?.url,
      genres: artist.genres?.slice(0, 2),
      url: artist.external_urls.spotify,
    }));

    return NextResponse.json({ artists });
  } catch (error) {
    console.error('Spotify top artists error:', error);
    return NextResponse.json({ artists: [], error: 'Failed to fetch' });
  }
}
