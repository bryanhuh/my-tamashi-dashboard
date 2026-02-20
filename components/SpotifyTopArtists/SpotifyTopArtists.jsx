'use client';

import { useState, useEffect } from 'react';
import { Disc3 } from 'lucide-react';
import styles from './SpotifyTopArtists.module.css';

const TIME_RANGES = [
  { value: 'short_term', label: '4 Weeks' },
  { value: 'medium_term', label: '6 Months' },
  { value: 'long_term', label: 'All Time' },
];

export default function SpotifyTopArtists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('medium_term');
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    async function fetchArtists() {
      setLoading(true);
      try {
        const res = await fetch(`/api/spotify/top-artists?range=${range}`);
        const json = await res.json();
        if (json.needsSetup) {
          setNeedsSetup(true);
        } else {
          setArtists(json.artists || []);
        }
      } catch (err) {
        console.error('Top artists fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArtists();
  }, [range]);

  return (
    <div className={styles.container}>
      <div className="sectionIndex">02 — Top Artists</div>

      <div className={styles.controls}>
        {TIME_RANGES.map((r) => (
          <button
            key={r.value}
            className={`pill ${range === r.value ? styles.active : ''}`}
            onClick={() => setRange(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {needsSetup ? (
        <div className={styles.setup}>
          <Disc3 size={24} className={styles.setupIcon} />
          <p>Connect Spotify to see your top artists</p>
        </div>
      ) : loading ? (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.artistCard}>
              <div className={`skeleton ${styles.skeletonImg}`} />
              <div className={`skeleton ${styles.skeletonName}`} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {artists.map((artist, i) => (
            <a
              key={artist.id || i}
              href={artist.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.artistCard}
            >
              <div className={styles.rank}>{String(i + 1).padStart(2, '0')}</div>
              {artist.image ? (
                <img src={artist.image} alt={artist.name} className={styles.artistImg} />
              ) : (
                <div className={styles.artistImgPlaceholder}>
                  <Disc3 size={20} />
                </div>
              )}
              <div className={styles.artistInfo}>
                <span className={styles.artistName}>{artist.name}</span>
                {artist.genres?.[0] && (
                  <span className="tag">{artist.genres[0]}</span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
