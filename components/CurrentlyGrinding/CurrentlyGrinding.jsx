'use client';

import { useState, useRef, useCallback } from 'react';
import styles from './CurrentlyGrinding.module.css';
import grindingData from '@/data/grinding.json';

const categoryEmojis = {
  coding:   '💻',
  learning: '📚',
  gaming:   '🎮',
  fitness:  '🏋️',
};

const statusColors = {
  active: '#2b00ff',
  paused: '#f59e0b',
  done:   '#10b981',
};

function DraggableProgressBar({ initialProgress, id }) {
  const [progress, setProgress] = useState(initialProgress);
  const barRef = useRef(null);
  const dragging = useRef(false);

  const computeProgress = useCallback((clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.round(((clientX - rect.left) / rect.width) * 100);
    return Math.min(100, Math.max(0, pct));
  }, []);

  const onMouseDown = (e) => {
    dragging.current = true;
    setProgress(computeProgress(e.clientX));

    const onMove = (e) => {
      if (dragging.current) setProgress(computeProgress(e.clientX));
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onTouchStart = (e) => {
    const onMove = (e) => setProgress(computeProgress(e.touches[0].clientX));
    const onEnd = () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
    setProgress(computeProgress(e.touches[0].clientX));
  };

  return (
    <div className={styles.progressSection}>
      <div className={styles.progressLabel}>
        <span>Progress</span>
        <span className={styles.progressValue}>{progress}%</span>
      </div>
      <div
        ref={barRef}
        className={styles.progressTrack}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        role="slider"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        <div className={styles.progressThumb} style={{ left: `${progress}%` }} />
      </div>
    </div>
  );
}

export default function CurrentlyGrinding() {
  return (
    <div className={styles.container}>
      <div className="sectionIndex">Currently Grinding</div>

      <div className={styles.grid}>
        {grindingData.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.emoji}>{categoryEmojis[item.category] || '⚡'}</span>
              <span
                className={styles.statusBadge}
                style={{ color: statusColors[item.status], borderColor: statusColors[item.status] }}
              >
                {item.status}
              </span>
            </div>
            <h4 className={styles.title}>{item.title}</h4>
            <p className={styles.description}>{item.description}</p>
            <DraggableProgressBar initialProgress={item.progress} id={item.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
