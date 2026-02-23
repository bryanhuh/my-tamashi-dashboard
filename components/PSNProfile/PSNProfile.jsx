'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, ExternalLink, Wifi, WifiOff, Trophy } from 'lucide-react';
import styles from './PSNProfile.module.css';

const TROPHY_COLORS = {
  platinum: '#e8e8f0',
  gold: '#d4af37',
  silver: '#a8a9ad',
  bronze: '#cd7f32',
};

const TROPHY_ICONS = {
  platinum: <Trophy size={16} />,
  gold: <Trophy size={16} />,
  silver: <Trophy size={16} />,
  bronze: <Trophy size={16} />,
};

function formatPlaytime(duration) {
  if (!duration) return null;
  // duration is ISO 8601 like PT12H30M
  const h = duration.match(/(\d+)H/)?.[1];
  const m = duration.match(/(\d+)M/)?.[1];
  if (h && parseInt(h) > 0) return `${h}h ${m ? m + 'm' : ''}`.trim();
  if (m) return `${m}m`;
  return null;
}

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function PSNProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPSN() {
      try {
        const res = await fetch('/api/psn');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('PSN fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPSN();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="sectionIndex">PlayStation</div>
        <div className={styles.skeletonHeader}>
          <div className={`skeleton ${styles.skeletonAvatar}`} />
          <div className={styles.skeletonHeaderText}>
            <div className={`skeleton ${styles.skeletonName}`} />
            <div className={`skeleton ${styles.skeletonStatus}`} />
          </div>
        </div>
        <div className={styles.skeletonTrophies}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`skeleton ${styles.skeletonTrophyItem}`} />
          ))}
        </div>
        <div className={styles.skeletonGames}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`skeleton ${styles.skeletonGameItem}`} />
          ))}
        </div>
      </div>
    );
  }

  if (data?.needsSetup) {
    return (
      <div className={styles.container}>
        <div className="sectionIndex">PlayStation</div>
        <div className={styles.empty}>
          <Gamepad2 size={24} className={styles.emptyIcon} />
          <p>PSN not connected</p>
          <span>Set up PSN_NPSSO in .env.local</span>
        </div>
      </div>
    );
  }

  const totalTrophies =
    (data?.trophies?.platinum ?? 0) +
    (data?.trophies?.gold ?? 0) +
    (data?.trophies?.silver ?? 0) +
    (data?.trophies?.bronze ?? 0);

  return (
    <div className={styles.container}>
      <div className="sectionIndex">PlayStation</div>

      {/* ── Profile Header ── */}
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          {data?.avatarUrl ? (
            <img src={data.avatarUrl} alt={data.username} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>
              <Gamepad2 size={20} />
            </div>
          )}
          <span className={`${styles.statusDot} ${data?.isOnline ? styles.online : styles.offline}`} />
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.usernameRow}>
            <h3 className={styles.username}>{data?.username ?? 'bryxnhuh'}</h3>
            {data?.trophyLevel && (
              <span className={styles.levelBadge}>Lv.{data.trophyLevel}</span>
            )}
          </div>

          <div className={styles.statusRow}>
            {data?.isOnline ? (
              <>
                <Wifi size={10} className={styles.statusIcon} />
                <span className={styles.statusOnline}>
                  {data?.currentGame ? `Playing ${data.currentGame}` : 'Online'}
                </span>
              </>
            ) : (
              <>
                <WifiOff size={10} className={styles.statusIconOff} />
                <span className={styles.statusOffline}>Offline</span>
              </>
            )}
          </div>

          {data?.trophyLevel && (
            <div className={styles.levelProgress}>
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{ width: `${data.trophyLevelProgress}%`, background: 'var(--psn)' }}
                />
              </div>
              <span className={styles.levelProgressLabel}>{data.trophyLevelProgress}%</span>
            </div>
          )}
        </div>

        <a
          href={`https://psnprofiles.com/${data?.username ?? 'bryxnhuh'}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`pill ${styles.profileLink}`}
        >
          <ExternalLink size={11} />
        </a>
      </div>

      {/* ── Trophy Summary ── */}
      <div className={styles.trophyBar}>
        {['platinum', 'gold', 'silver', 'bronze'].map((type) => (
          <div key={type} className={styles.trophyItem}>
            <span className={styles.trophyIcon} style={{ color: TROPHY_COLORS[type] }}>
              {TROPHY_ICONS[type]}
            </span>
            <span className={styles.trophyCount}>{data?.trophies?.[type] ?? 0}</span>
            <span className={styles.trophyLabel}>{type}</span>
          </div>
        ))}
        <div className={styles.trophyDivider} />
        <div className={styles.trophyTotal}>
          <span className={styles.trophyCount}>{totalTrophies}</span>
          <span className={styles.trophyLabel}>Total</span>
        </div>
      </div>

      {data?.recentGames?.length > 0 && (
        <div className={styles.gamesSection}>
          <div className={styles.gamesSectionLabel}>Recent Activity (Games)</div>
          <div className={styles.gamesStrip}>
            {data.recentGames.map((game) => (
              <div key={game.id} className={styles.gameCard} title={game.name}>
                {game.image ? (
                  <img src={game.image} alt={game.name} className={styles.gameArt} />
                ) : (
                  <div className={styles.gameArtFallback}>
                    <Gamepad2 size={18} />
                  </div>
                )}
                <div className={styles.gameOverlay}>
                  <span className={styles.gameName}>{game.name}</span>
                  <div className={styles.gameMeta}>
                    {game.platform && <span className="tag">{game.platform}</span>}
                    {game.lastPlayedAt && (
                      <span className={styles.gameTime}>{timeAgo(game.lastPlayedAt)}</span>
                    )}
                  </div>
                  {game.playDuration && (
                    <span className={styles.gameHours}>{formatPlaytime(game.playDuration)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
