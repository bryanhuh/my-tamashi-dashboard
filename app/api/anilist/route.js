import { NextResponse } from 'next/server';

const ANILIST_USERNAME = process.env.ANILIST_USERNAME || 'breezarre';

const ANILIST_QUERY = `
query ($username: String) {
  User(name: $username) {
    id
    name
    avatar {
      medium
    }
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
}
`;

const ACTIVITY_QUERY = `
query ($userId: Int, $page: Int) {
  Page(page: $page, perPage: 10) {
    activities(userId: $userId, sort: ID_DESC) {
      ... on ListActivity {
        id
        type
        status
        progress
        createdAt
        media {
          title {
            english
            romaji
          }
          type
          coverImage {
            medium
          }
          siteUrl
        }
      }
    }
  }
}
`;

export async function GET() {
  try {
    // Step 1: Fetch user stats + user ID
    const userRes = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: { username: ANILIST_USERNAME },
      }),
      next: { revalidate: 3600 },
    });

    const userJson = await userRes.json();
    const userData = userJson.data?.User;

    if (!userData) throw new Error('User not found');

    const animeStats = userData.statistics?.anime || {};
    const mangaStats = userData.statistics?.manga || {};

    const stats = {
      animeCount: animeStats.count || 0,
      mangaCount: mangaStats.count || 0,
      meanScore: animeStats.meanScore || 0,
      daysWatched: (animeStats.minutesWatched || 0) / 60 / 24,
      episodesWatched: animeStats.episodesWatched || 0,
      chaptersRead: mangaStats.chaptersRead || 0,
    };

    // Step 2: Fetch recent activity with user ID
    const activityRes = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: ACTIVITY_QUERY,
        variables: { userId: userData.id, page: 1 },
      }),
      next: { revalidate: 1800 }, // Cache 30 min for activity
    });

    const activityJson = await activityRes.json();
    const rawActivities = activityJson.data?.Page?.activities ?? [];

    const activity = rawActivities
      .filter((a) => a?.media) // Only ListActivity with a media item
      .slice(0, 6)
      .map((a) => ({
        id: a.id,
        type: a.type,         // ANIME_LIST or MANGA_LIST
        status: a.status,     // "watched episode", "completed", "plans to watch", etc.
        progress: a.progress, // e.g. "5" or "1 - 5"
        createdAt: a.createdAt,
        media: {
          title: a.media.title.english || a.media.title.romaji,
          type: a.media.type,
          coverImage: a.media.coverImage?.medium,
          siteUrl: a.media.siteUrl,
        },
      }));

    return NextResponse.json({
      username: userData.name,
      avatar: userData.avatar?.medium,
      stats,
      activity,
    });
  } catch (error) {
    console.error('AniList error:', error);
    return NextResponse.json({
      username: ANILIST_USERNAME,
      stats: null,
      activity: [],
      error: 'Failed to fetch AniList data',
    });
  }
}
