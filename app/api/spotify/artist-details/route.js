import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

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
    return NextResponse.json({ error: 'Missing credentials' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get('id');

  if (!artistId) {
    return NextResponse.json({ error: 'Missing artist id' }, { status: 400 });
  }

  try {
    const { access_token } = await getAccessToken();
    const headers = { Authorization: `Bearer ${access_token}` };

    // Run all Spotify fetches in parallel
    const [artistRes, tracksRes, albumsRes, relatedRes] = await Promise.all([
      fetch(`https://api.spotify.com/v1/artists/${artistId}`, { headers }),
      fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, { headers }),
      fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=5&include_groups=album,single`, { headers }),
      fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, { headers }),
    ]);

    const artistData  = await artistRes.json();
    const tracksData  = await tracksRes.json();
    const albumsData  = await albumsRes.json();
    const relatedData = await relatedRes.json();

    return NextResponse.json({
      artist: {
        id: artistData.id,
        name: artistData.name,
        image: artistData.images?.[0]?.url,
        followers: artistData.followers?.total,
        popularity: artistData.popularity,
        url: artistData.external_urls?.spotify,
        genres: artistData.genres
      },
      topTracks: (tracksData.tracks || []).slice(0, 5).map(t => ({
        id: t.id,
        name: t.name,
        album: t.album.name,
        image: t.album.images?.[2]?.url || t.album.images?.[0]?.url,
        duration_ms: t.duration_ms,
        preview_url: t.preview_url,
        url: t.external_urls?.spotify
      })),
      latestReleases: (albumsData.items || []).slice(0, 4).map(a => ({
        id: a.id,
        name: a.name,
        type: a.album_type,
        release_date: a.release_date,
        image: a.images?.[1]?.url || a.images?.[0]?.url,
        url: a.external_urls?.spotify
      })),
      relatedArtists: (relatedData.artists || []).slice(0, 6).map(a => ({
        id: a.id,
        name: a.name,
        image: a.images?.[2]?.url || a.images?.[0]?.url,
        url: a.external_urls?.spotify
      }))
    });

  } catch (error) {
    console.error('Spotify artist details error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
