import { NextResponse } from 'next/server';

const ANILIST_USERNAME = process.env.ANILIST_USERNAME || 'breezarre';

const ANILIST_QUERY = `
query ($username: String) {
  User(name: $username) {
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
  MediaListCollection(userName: $username, type: ANIME, status: CURRENT) {
    lists {
      entries {
        progress
        media {
          title {
            english
            romaji
          }
          episodes
          coverImage {
            medium
          }
        }
      }
    }
  }
}
`;

export async function GET() {
  try {
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
    const userData = json.data?.User;
    const listData = json.data?.MediaListCollection;

    if (!userData) {
      throw new Error('User not found');
    }

    const animeStats = userData.statistics?.anime || {};
    const mangaStats = userData.statistics?.manga || {};

    const stats = {
      animeCount: animeStats.count || 0,
      mangaCount: mangaStats.count || 0,
      meanScore: animeStats.meanScore || 0,
      daysWatched: ((animeStats.minutesWatched || 0) / 60 / 24),
      episodesWatched: animeStats.episodesWatched || 0,
      chaptersRead: mangaStats.chaptersRead || 0,
    };

    // Currently watching
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

    return NextResponse.json({
      username: ANILIST_USERNAME,
      avatar: userData.avatar?.medium,
      stats,
      watching: watching.slice(0, 5),
    });
  } catch (error) {
    console.error('AniList error:', error);
    return NextResponse.json({
      username: ANILIST_USERNAME,
      stats: null,
      watching: [],
      error: 'Failed to fetch AniList data',
    });
  }
}
