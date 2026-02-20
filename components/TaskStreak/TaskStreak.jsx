'use client';

import styles from './TaskStreak.module.css';
import streakData from '@/data/streaks.json';

export default function TaskStreak() {
  const { currentStreak, longestStreak, totalCompleted, weeks } = streakData;

  return (
    <div className={styles.container}>
      <div className="sectionIndex">06 — Task Streak</div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statEmoji}>🔥</span>
          <span className={styles.statValue}>{currentStreak}</span>
          <span className={styles.statLabel}>Current</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statEmoji}>⚡</span>
          <span className={styles.statValue}>{longestStreak}</span>
          <span className={styles.statLabel}>Longest</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statEmoji}>✅</span>
          <span className={styles.statValue}>{totalCompleted}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
      </div>

      <div className={styles.heatmap}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map((day, di) => (
              <div
                key={di}
                className={styles.day}
                data-level={day.level}
                title={`${day.date}: ${day.count} tasks`}
              >
                <div
                  className={styles.dayFill}
                  style={{
                    opacity: day.level === 0 ? 0.08 : day.level * 0.25 + 0.1,
                    background: day.level > 0 ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className={styles.legendDay}>
            <div
              className={styles.dayFill}
              style={{
                opacity: level === 0 ? 0.08 : level * 0.25 + 0.1,
                background: level > 0 ? 'var(--accent)' : 'var(--text-muted)',
              }}
            />
          </div>
        ))}
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
}
