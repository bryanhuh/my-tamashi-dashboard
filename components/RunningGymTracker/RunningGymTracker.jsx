import { Activity, Dumbbell, Flame } from 'lucide-react';
import styles from './RunningGymTracker.module.css';
import fitnessData from '@/data/fitness.json';

export default function RunningGymTracker() {
  const { weeklyGoal, currentWeek, lastRun, lastGym, monthlyProgress, workoutStreak } = fitnessData;

  const runProgress = Math.round((currentWeek.totalKm / weeklyGoal.totalKm) * 100);
  const gymProgress = Math.round((currentWeek.gymCompleted / weeklyGoal.gymSessions) * 100);
  const monthlyKmPct = Math.round((monthlyProgress.currentKm / monthlyProgress.goalKm) * 100);

  return (
    <div className={styles.container}>
      <div className="sectionIndex">10 — Fitness</div>

      <div className={styles.streakBanner}>
        <Flame size={16} className={styles.flameIcon} />
        <span className={styles.streakCount}>{workoutStreak} day streak</span>
      </div>

      <div className={styles.weekStats}>
        <div className={styles.weekStat}>
          <Activity size={14} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{currentWeek.totalKm} km</span>
            <span className={styles.statGoal}>/ {weeklyGoal.totalKm} km goal</span>
          </div>
          <div className="progressBar" style={{ marginTop: 6 }}>
            <div className="progressFill" style={{ width: `${runProgress}%`, background: 'var(--success)' }} />
          </div>
        </div>
        <div className={styles.weekStat}>
          <Dumbbell size={14} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{currentWeek.gymCompleted} sessions</span>
            <span className={styles.statGoal}>/ {weeklyGoal.gymSessions} goal</span>
          </div>
          <div className="progressBar" style={{ marginTop: 6 }}>
            <div className="progressFill" style={{ width: `${gymProgress}%`, background: 'var(--accent)' }} />
          </div>
        </div>
      </div>

      <div className={styles.lastSession}>
        <div className={styles.sessionLabel}>Last Run</div>
        <div className={styles.sessionGrid}>
          <div className={styles.sessionItem}>
            <span className={styles.sessionValue}>{lastRun.distance} km</span>
            <span className={styles.sessionKey}>Distance</span>
          </div>
          <div className={styles.sessionItem}>
            <span className={styles.sessionValue}>{lastRun.time}</span>
            <span className={styles.sessionKey}>Time</span>
          </div>
          <div className={styles.sessionItem}>
            <span className={styles.sessionValue}>{lastRun.pace}</span>
            <span className={styles.sessionKey}>Pace</span>
          </div>
          <div className={styles.sessionItem}>
            <span className={styles.sessionValue}>{lastRun.calories}</span>
            <span className={styles.sessionKey}>Cal</span>
          </div>
        </div>
      </div>

      <div className={styles.lastSession}>
        <div className={styles.sessionLabel}>Last Gym — {lastGym.type}</div>
        <div className={styles.exercises}>
          {lastGym.exercises.map((ex, i) => (
            <div key={i} className={styles.exercise}>
              <span className={styles.exerciseName}>{ex.name}</span>
              <span className={styles.exerciseDetail}>{ex.sets}×{ex.reps}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.monthly}>
        <div className={styles.monthlyLabel}>
          Monthly: {monthlyProgress.currentKm}/{monthlyProgress.goalKm} km
        </div>
        <div className="progressBar">
          <div className="progressFill" style={{ width: `${monthlyKmPct}%`, background: 'var(--fire)' }} />
        </div>
      </div>
    </div>
  );
}
