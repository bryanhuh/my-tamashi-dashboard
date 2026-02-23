import styles from './BlogPosts.module.css';

export default function BlogPosts() {
  // 8 columns × 4 rows = 32 cells
  const cells = Array.from({ length: 40 });

  return (
    <div className={styles.container}>
      {/* Blue-bordered grid background */}
      <div className={styles.grid}>
        {cells.map((_, i) => (
          <div key={i} className={styles.cell} />
        ))}
      </div>

      {/* Centered text */}
      <div className={styles.content}>
        <h2 className={styles.heading}>
          Blog <span className={styles.headingAccent}>Coming Soon</span>
        </h2>
        <p className={styles.subtitle}>
          Thoughts on life, lol.
        </p>
      </div>
    </div>
  );
}
