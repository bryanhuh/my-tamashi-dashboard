import styles from './CurrentlyGrinding.module.css';
import grindingData from '@/data/grinding.json';

const categoryEmojis = {
  coding: '💻',
  learning: '📚',
  gaming: '🎮',
  fitness: '🏋️',
};

const statusColors = {
  active: 'var(--accent)',
  paused: 'var(--warning)',
  done: 'var(--success)',
};

export default function CurrentlyGrinding() {
  return (
    <div className={styles.container}>
      <div className="sectionIndex">07 — Currently Grinding</div>

      <div className={styles.grid}>
        {grindingData.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.itemHeader}>
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
            <div className={styles.progressSection}>
              <div className={styles.progressLabel}>
                <span>{item.category}</span>
                <span>{item.progress}%</span>
              </div>
              <div className="progressBar">
                <div 
                  className="progressFill" 
                  style={{ width: `${item.progress}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
