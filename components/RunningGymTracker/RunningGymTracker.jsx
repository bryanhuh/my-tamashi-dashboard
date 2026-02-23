import { Activity, Dumbbell, Flame } from 'lucide-react';
import styles from './RunningGymTracker.module.css';
import fitnessData from '@/data/fitness.json';

export default function RunningGymTracker() {
  const { weeklyGoal, currentWeek, lastRun, lastGym, monthlyProgress, workoutStreak } = fitnessData;

  const runProgress  = Math.round((currentWeek.totalKm       / weeklyGoal.totalKm)      * 100);
  const gymProgress  = Math.round((currentWeek.gymCompleted  / weeklyGoal.gymSessions)  * 100);
  const monthlyKmPct = Math.round((monthlyProgress.currentKm / monthlyProgress.goalKm)  * 100);

  return (
    <div className={styles.container}>
      <div className="sectionIndex">Fitness</div>



      {/* Weekly stats — white cards */}
      <div className={styles.weekStats}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <Activity size={14} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{currentWeek.totalKm} km</span>
              <span className={styles.statGoal}>/ {weeklyGoal.totalKm} km goal</span>
            </div>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${runProgress}%`, background: '#10b981' }} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTop}>
            <Dumbbell size={14} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{currentWeek.gymCompleted} sessions</span>
              <span className={styles.statGoal}>/ {weeklyGoal.gymSessions} goal</span>
            </div>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${gymProgress}%`, background: '#2b00ff' }} />
          </div>
        </div>
      </div>

      {/* Last Run — white card */}
      <div className={styles.card}>
        <div className={styles.sessionLabel}>Last Run</div>
        <div className={styles.sessionGrid}>
          {[
            { label: 'Distance', value: `${lastRun.distance} km` },
            { label: 'Time',     value: lastRun.time },
            { label: 'Pace',     value: lastRun.pace },
            { label: 'Cal',      value: lastRun.calories },
          ].map(({ label, value }) => (
            <div key={label} className={styles.sessionItem}>
              <span className={styles.sessionValue}>{value}</span>
              <span className={styles.sessionKey}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Gym — white card */}
      <div className={styles.card}>
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

      {/* Monthly — white card */}
      <div className={styles.card}>
        <div className={styles.sessionLabel}>
          Monthly: {monthlyProgress.currentKm} / {monthlyProgress.goalKm} km
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${monthlyKmPct}%`, background: '#f59e0b' }} />
        </div>
      </div>
    </div>
  );
}
