import { Coffee, Heart } from 'lucide-react';
import styles from './BuyMeACoffee.module.css';

export default function BuyMeACoffee() {
  return (
    <div className={styles.container}>
      {/* Long left arrow that extends outside the container */}
      <div className={styles.arrow}>
        <svg width="220" height="40" viewBox="0 0 220 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hand-drawn wobbly arrow line */}
          <path
            d="M215 22 C180 18, 150 28, 120 20 C90 12, 60 30, 30 20"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Sketchy arrowhead */}
          <path
            d="M38 12 L26 20 L40 28"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      <div className={styles.content}>
        <div className={styles.icon}>☕</div>
        <div className={styles.text}>
          <h3 className={styles.title}>Fuel My Grind</h3>
          <p className={styles.description}>
            If you enjoy what I build, consider buying me a coffee. Every cup helps keep the late-night coding sessions going.
          </p>
        </div>
        <a
          href="https://buymeacoffee.com/bryanhuh"
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Coffee size={16} />
          <span>Buy Me a Coffee</span>
          <Heart size={12} className={styles.heart} />
        </a>

      </div>
    </div>
  );
}
