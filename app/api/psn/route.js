import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const PSN_USERNAME = process.env.PSN_USERNAME || 'bryxnhuh';

export async function GET() {
  try {
    const response = await fetch(`https://psnprofiles.com/${PSN_USERNAME}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 21600 }, // Cache for 6 hours
    });

    if (!response.ok) {
      throw new Error(`PSNProfiles returned ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract trophy counts
    const trophies = {
      platinum: parseInt($('.platinum').first().text().trim()) || 0,
      gold: parseInt($('.gold').first().text().trim()) || 0,
      silver: parseInt($('.silver').first().text().trim()) || 0,
      bronze: parseInt($('.bronze').first().text().trim()) || 0,
    };

    // Extract recent game
    let recentGame = null;
    const gameRow = $('#gamesTable tr, .game-table-container table tr, #game-table tr').first();
    
    if (gameRow.length) {
      const gameLink = gameRow.find('a.title').first();
      const gameImg = gameRow.find('img').first();
      const progressText = gameRow.find('.progress-bar .percentage, .progress span').first().text().trim();
      const platformEl = gameRow.find('.tag.platform, .platform').first();

      recentGame = {
        title: gameLink.text().trim() || 'Unknown Game',
        image: gameImg.attr('src') || '',
        trophyProgress: parseInt(progressText) || 0,
        platform: platformEl.text().trim() || 'PS5',
      };
    }

    // Fallback: try to get the recent game from a different selector
    if (!recentGame || !recentGame.title || recentGame.title === 'Unknown Game') {
      const recentGameEl = $('.recent-game, .game-image-holder').first();
      if (recentGameEl.length) {
        recentGame = {
          title: recentGameEl.find('.title, .game-title, a').first().text().trim() || 'Recent Game',
          image: recentGameEl.find('img').first().attr('src') || '',
          trophyProgress: parseInt(recentGameEl.find('.progress, .completion').first().text()) || 0,
          platform: 'PS5',
        };
      }
    }

    // If still no game, provide a minimal response
    if (!recentGame) {
      recentGame = {
        title: 'Check PSN Profile',
        image: '',
        trophyProgress: 0,
        platform: 'PS5',
      };
    }

    return NextResponse.json({
      username: PSN_USERNAME,
      trophies,
      recentGame,
    });
  } catch (error) {
    console.error('PSN scraping error:', error);
    return NextResponse.json({
      username: PSN_USERNAME,
      trophies: { platinum: 0, gold: 0, silver: 0, bronze: 0 },
      recentGame: null,
      error: 'Failed to scrape PSN profile',
    });
  }
}
