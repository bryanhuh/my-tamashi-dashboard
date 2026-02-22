'use client';

import { useState, useEffect } from 'react';
import { Music, ExternalLink, Disc3 } from 'lucide-react';
import styles from './SpotifyNowPlaying.module.css';

export default function SpotifyNowPlaying() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const res = await fetch('/api/spotify/now-playing');
        const json = await res.json();
        setData(json);
        if (json.isPlaying && json.progressMs && json.durationMs) {
          setProgress((json.progressMs / json.durationMs) * 100);
        }
      } catch (err) {
        console.error('Spotify fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (!data?.isPlaying) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = (1000 / data.durationMs) * 100;
        return Math.min(prev + increment, 100);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={`skeleton ${styles.skeletonArt}`} />
          <div className={styles.skeletonInfo}>
            <div className={`skeleton ${styles.skeletonTitle}`} />
            <div className={`skeleton ${styles.skeletonArtist}`} />
          </div>
        </div>
      </div>
    );
  }

  const isPlaying = data?.isPlaying;
  const needsSetup = data?.needsSetup;

  return (
    <div className={styles.container}>
      {data?.songUrl && (
        <a
          href={data.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.spotifyIconLink}
          aria-label="Open in Spotify"
        >
          <ExternalLink size={11} />
          <span className={styles.tooltip}>Open in Spotify</span>
        </a>
      )}
      
      {needsSetup ? (
        <div className={styles.setup}>
          <Disc3 size={24} className={styles.setupIcon} />
          <p className={styles.setupText}>Spotify not connected</p>
          <span className={styles.setupHint}>Set up API credentials in .env.local</span>
        </div>
      ) : isPlaying ? (
        <>
          <div className={styles.player}>
            {data.albumArt && (
              <div className={styles.artWrapper}>
                <img src={data.albumArt} alt={data.album} className={styles.art} />
                <div className={styles.artGlow} style={{ backgroundImage: `url(${data.albumArt})` }} />
              </div>
            )}
            <div className={styles.info}>
              <h3 className={styles.track}>{data.title}</h3>
              <p className={styles.artist}>{data.artist}</p>
              <p className={styles.album}>{data.album}</p>
            </div>
          </div>
          <div className={styles.progressContainer}>
            <div className="progressBar">
              <div className="progressFill" style={{ width: `${progress}%`, background: 'var(--spotify)' }} />
            </div>
            <div className={styles.timestamps}>
              <span>{formatTime(data.progressMs)}</span>
              <span>{formatTime(data.durationMs)}</span>
            </div>
          </div>

        </>
      ) : (
        <div className={styles.notPlaying}>
          <Music size={20} className={styles.icon} />
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Not playing right now
            <img src="/osaka.png" alt="osaka" style={{ height: '30px', width: 'auto' }} />
          </p>
        </div>
      )}
    </div>
  );
}

function formatTime(ms) {
  if (!ms) return '0:00';
  const seconds = Math.floor(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
