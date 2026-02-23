'use client';

import { useState, useEffect } from 'react';
import { Tv, BookOpen, Star, ExternalLink } from 'lucide-react';
import styles from './AniListStats.module.css';

function timeAgo(timestamp) {
  if (!timestamp) return null;
  const diff = Date.now() - timestamp * 1000;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function ActivityLabel({ status, progress, mediaType }) {
  const isAnime = mediaType === 'ANIME';
  const unit = isAnime ? 'Ep' : 'Ch';

  if (status === 'completed') return <span className={styles.statusCompleted}>Completed</span>;
  if (status === 'plans to watch' || status === 'plans to read')
    return <span className={styles.statusPlanned}>Plan to {isAnime ? 'watch' : 'read'}</span>;
  if (status === 'paused') return <span className={styles.statusPaused}>Paused</span>;
  if (status === 'dropped') return <span className={styles.statusDropped}>Dropped</span>;
  if (progress)
    return (
      <span className={styles.statusProgress}>
        {unit} {progress}
      </span>
    );
  return <span className={styles.statusProgress}>{status}</span>;
}

export default function AniListStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAniList() {
      try {
        const res = await fetch('/api/anilist');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('AniList fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAniList();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="sectionIndex">04 — AniList</div>
        <div className={styles.skeletonGrid}>
          {[...Array(4)].map((_, i) => <div key={i} className={`skeleton ${styles.skeletonStat}`} />)}
        </div>
        <div className={styles.skeletonFeed}>
          {[...Array(4)].map((_, i) => <div key={i} className={`skeleton ${styles.skeletonItem}`} />)}
        </div>
      </div>
    );
  }

  if (!data?.stats) {
    return (
      <div className={styles.container}>
        <div className="sectionIndex">04 — AniList</div>
        <div className={styles.empty}>
          <Tv size={24} style={{ opacity: 0.3 }} />
          <p>Could not load AniList data</p>
        </div>
      </div>
    );
  }

  const { stats, activity, username } = data;

  return (
    <div className={styles.container}>
      <div className={styles.headerTop}>
        <div className="sectionIndex">AniList</div>
        <a
          href={`https://anilist.co/user/${username || 'breezarre'}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`pill ${styles.profileLink}`}
        >
          <ExternalLink size={11} />
        </a>
      </div>

      {/* ── Stats Grid ── */}
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <Tv size={14} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.animeCount || 0}</span>
          <span className={styles.statLabel}>Anime</span>
        </div>
        <div className={styles.stat}>
          <BookOpen size={14} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.mangaCount || 0}</span>
          <span className={styles.statLabel}>Manga</span>
        </div>
        <div className={styles.stat}>
          <Star size={14} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.meanScore || 0}</span>
          <span className={styles.statLabel}>Mean Score</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIconEmoji}>📅</span>
          <span className={styles.statValue}>{(stats.daysWatched || 0).toFixed(1)}</span>
          <span className={styles.statLabel}>Days</span>
        </div>
      </div>

      {/* ── Activity Feed ── */}
      {activity?.length > 0 && (
        <div className={styles.feed}>
          <div className={styles.feedLabel}>Recent Activity</div>
          <div className={styles.feedList}>
            {activity.map((item) => (
              <a
                key={item.id}
                href={item.media.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.feedItem}
              >
                {item.media.coverImage && (
                  <img
                    src={item.media.coverImage}
                    alt={item.media.title}
                    className={styles.feedImg}
                  />
                )}
                <div className={styles.feedInfo}>
                  <span className={styles.feedTitle}>{item.media.title}</span>
                  <div className={styles.feedMeta}>
                    <ActivityLabel
                      status={item.status}
                      progress={item.progress}
                      mediaType={item.media.type}
                    />
                    {item.createdAt && (
                      <span className={styles.feedTime}>{timeAgo(item.createdAt)}</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
