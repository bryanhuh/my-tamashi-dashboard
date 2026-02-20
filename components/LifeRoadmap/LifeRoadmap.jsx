import styles from './LifeRoadmap.module.css';
import roadmapData from '@/data/roadmap.json';

const statusIcons = {
  done: '✅',
  'in-progress': '🔄',
  planned: '📌',
};

const categoryColors = {
  Career: '#7c5cfc',
  Skills: '#2b00ff',
  Health: '#00d4aa',
  Personal: '#ff6b35',
  Financial: '#ffdd00',
};

export default function LifeRoadmap() {
  return (
    <div className={styles.container}>
      <div className="sectionIndex">05 — Life Roadmap</div>

      <div className={styles.timeline}>
        <div className={styles.line} />
        {roadmapData.map((item, i) => (
          <div
            key={item.id}
            className={`${styles.milestone} ${styles[item.status]}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={styles.dot} style={{ borderColor: categoryColors[item.category] || 'var(--accent)' }} />
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.year}>{item.year}</span>
                <span className={styles.status}>{statusIcons[item.status]}</span>
                <span className="tag" style={{ borderColor: categoryColors[item.category] || 'var(--border)', color: categoryColors[item.category] || 'var(--text-muted)' }}>
                  {item.category}
                </span>
              </div>
              <h4 className={styles.title}>{item.title}</h4>
              <p className={styles.description}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
