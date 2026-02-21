/**
 * PSN API Route — Rich Profile Data
 *
 * Fetches profile, presence, trophy summary, and recent games in parallel.
 *
 * SETUP (one-time):
 * 1. Log in to https://www.playstation.com in your browser
 * 2. In the same browser, open: https://ca.account.sony.com/api/v1/ssocookie
 * 3. Copy the `npsso` value (64-char token)
 * 4. Add to .env.local:
 *    PSN_NPSSO=your_64_char_token_here
 *    PSN_USERNAME=your_psn_username
 *
 * NPSSO token lasts ~2 months — repeat steps 1-3 when expired.
 */

import { NextResponse } from 'next/server';
import {
  exchangeNpssoForAccessCode,
  exchangeCodeForAccessToken,
  getUserTrophyProfileSummary,
  getProfileFromUserName,
  getBasicPresence,
  getUserPlayedGames,
} from 'psn-api';

const PSN_USERNAME = process.env.PSN_USERNAME || 'bryxnhuh';
const PSN_NPSSO = process.env.PSN_NPSSO;

async function getAuth() {
  const accessCode = await exchangeNpssoForAccessCode(PSN_NPSSO);
  const authorization = await exchangeCodeForAccessToken(accessCode);
  return authorization;
}

export async function GET() {
  if (!PSN_NPSSO) {
    return NextResponse.json({ needsSetup: true });
  }

  try {
    const auth = await getAuth();

    // Fetch everything in parallel
    const [profileRes, presenceRes, trophyRes, gamesRes] = await Promise.allSettled([
      getProfileFromUserName(auth, PSN_USERNAME),
      getBasicPresence(auth, PSN_USERNAME),
      getUserTrophyProfileSummary(auth, 'me'),
      getUserPlayedGames(auth, 'me', { limit: 5 }),
    ]);

    // Profile
    const profile = profileRes.status === 'fulfilled' ? profileRes.value?.profile : null;
    const avatarUrl = profile?.avatarUrls?.[profile.avatarUrls.length - 1]?.avatarUrl ?? null;
    const onlineId = profile?.onlineId ?? PSN_USERNAME;

    // Presence
    const presence = presenceRes.status === 'fulfilled' ? presenceRes.value?.basicPresence : null;
    const isOnline = presence?.availability === 'availableToPlay';
    const currentGame = presence?.gameTitleInfoList?.[0]?.titleName ?? null;

    // Trophies
    const trophyData = trophyRes.status === 'fulfilled' ? trophyRes.value : null;
    const trophies = {
      platinum: trophyData?.earnedTrophies?.platinum ?? 0,
      gold: trophyData?.earnedTrophies?.gold ?? 0,
      silver: trophyData?.earnedTrophies?.silver ?? 0,
      bronze: trophyData?.earnedTrophies?.bronze ?? 0,
    };
    const trophyLevel = trophyData?.trophyLevel ?? null;
    const trophyLevelProgress = trophyData?.progress ?? 0;

    // Recent games (up to 5)
    const gamesData = gamesRes.status === 'fulfilled' ? gamesRes.value : null;
    const recentGames = (gamesData?.titles ?? []).slice(0, 5).map((g) => ({
      id: g.titleId,
      name: g.name,
      image: g.imageUrl ?? null,
      platform: g.category ?? 'PS5',
      playCount: g.playCount ?? null,
      playDuration: g.playDuration ?? null,
      firstPlayedAt: g.firstPlayedDateTime ?? null,
      lastPlayedAt: g.lastPlayedDateTime ?? null,
    }));

    return NextResponse.json(
      {
        username: onlineId,
        avatarUrl,
        isOnline,
        currentGame,
        trophies,
        trophyLevel,
        trophyLevelProgress,
        recentGames,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('PSN API error:', error?.message || error);
    return NextResponse.json({
      username: PSN_USERNAME,
      avatarUrl: null,
      isOnline: false,
      currentGame: null,
      trophies: { platinum: 0, gold: 0, silver: 0, bronze: 0 },
      trophyLevel: null,
      trophyLevelProgress: 0,
      recentGames: [],
      error: 'Failed to fetch PSN data',
      detail: error?.message,
    });
  }
}
