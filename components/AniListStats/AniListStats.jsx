'use client';

import { useState, useEffect } from 'react';
import { Tv, BookOpen, Star, ExternalLink } from 'lucide-react';
import styles from './AniListStats.module.css';

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
        <div className={`skeleton`} style={{ width: '100%', height: 140 }} />
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

  const { stats, watching, avatar } = data;

  return (
    <div className={styles.container}>
      <div className="sectionIndex">04 — AniList</div>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <Tv size={16} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.animeCount || 0}</span>
          <span className={styles.statLabel}>Anime</span>
        </div>
        <div className={styles.stat}>
          <BookOpen size={16} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.mangaCount || 0}</span>
          <span className={styles.statLabel}>Manga</span>
        </div>
        <div className={styles.stat}>
          <Star size={16} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.meanScore || 0}</span>
          <span className={styles.statLabel}>Mean Score</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>📅</span>
          <span className={styles.statValue}>{(stats.daysWatched || 0).toFixed(1)}</span>
          <span className={styles.statLabel}>Days</span>
        </div>
      </div>

      {watching && watching.length > 0 && (
        <div className={styles.watching}>
          <div className={styles.watchingLabel}>Currently Watching</div>
          {watching.slice(0, 4).map((anime, i) => (
            <div key={i} className={styles.watchingItem}>
              {anime.coverImage && (
                <img src={anime.coverImage} alt={anime.title} className={styles.watchingImg} />
              )}
              <div className={styles.watchingInfo}>
                <span className={styles.watchingTitle}>{anime.title}</span>
                <span className={styles.watchingProgress}>
                  Ep {anime.progress || 0}{anime.episodes ? ` / ${anime.episodes}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <a
        href="https://anilist.co/user/breezarre"
        target="_blank"
        rel="noopener noreferrer"
        className={`pill ${styles.profileLink}`}
      >
        <ExternalLink size={12} /> AniList Profile
      </a>
    </div>
  );
}
