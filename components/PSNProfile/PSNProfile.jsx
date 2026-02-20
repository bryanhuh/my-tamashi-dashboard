'use client';

import { useState, useEffect } from 'react';
import { Trophy, Gamepad2, ExternalLink } from 'lucide-react';
import styles from './PSNProfile.module.css';

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
        <div className="sectionIndex">03 — PlayStation</div>
        <div className={styles.loadingState}>
          <div className={`skeleton`} style={{ width: '100%', height: 120 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="sectionIndex">03 — PlayStation</div>

      {data?.recentGame ? (
        <>
          <div className={styles.gameHeader}>
            {data.recentGame.image && (
              <img src={data.recentGame.image} alt={data.recentGame.title} className={styles.gameImg} />
            )}
            <div className={styles.gameInfo}>
              <h3 className={styles.gameTitle}>{data.recentGame.title}</h3>
              {data.recentGame.platform && (
                <span className="tag">{data.recentGame.platform}</span>
              )}
            </div>
          </div>

          {data.recentGame.trophyProgress !== undefined && (
            <div className={styles.progress}>
              <div className={styles.progressLabel}>
                <span>Trophy Progress</span>
                <span className={styles.progressValue}>{data.recentGame.trophyProgress}%</span>
              </div>
              <div className="progressBar">
                <div className="progressFill" style={{ width: `${data.recentGame.trophyProgress}%`, background: 'var(--psn)' }} />
              </div>
            </div>
          )}

          <div className={styles.trophies}>
            <div className={styles.trophy}>
              <span className={styles.trophyIcon}>🏆</span>
              <span className={styles.trophyCount}>{data.trophies?.platinum || 0}</span>
              <span className={styles.trophyLabel}>Platinum</span>
            </div>
            <div className={styles.trophy}>
              <span className={styles.trophyIcon}>🥇</span>
              <span className={styles.trophyCount}>{data.trophies?.gold || 0}</span>
              <span className={styles.trophyLabel}>Gold</span>
            </div>
            <div className={styles.trophy}>
              <span className={styles.trophyIcon}>🥈</span>
              <span className={styles.trophyCount}>{data.trophies?.silver || 0}</span>
              <span className={styles.trophyLabel}>Silver</span>
            </div>
            <div className={styles.trophy}>
              <span className={styles.trophyIcon}>🥉</span>
              <span className={styles.trophyCount}>{data.trophies?.bronze || 0}</span>
              <span className={styles.trophyLabel}>Bronze</span>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <Gamepad2 size={24} className={styles.emptyIcon} />
          <p>Could not load PSN data</p>
        </div>
      )}

      <a
        href="https://psnprofiles.com/bryxnhuh"
        target="_blank"
        rel="noopener noreferrer"
        className={`pill ${styles.profileLink}`}
      >
        <ExternalLink size={12} /> PSN Profile
      </a>
    </div>
  );
}
