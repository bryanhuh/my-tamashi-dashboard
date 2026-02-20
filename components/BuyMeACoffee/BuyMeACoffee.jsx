import { Coffee, Heart } from 'lucide-react';
import styles from './BuyMeACoffee.module.css';

export default function BuyMeACoffee() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>☕</div>
        <div className={styles.text}>
          <h3 className={styles.title}>Fuel My Grind</h3>
          <p className={styles.description}>
            If you enjoy what I build, consider buying me a coffee. Every cup helps keep the late-night coding sessions going.
          </p>
        </div>
        <a
          href="#"
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Coffee size={16} />
          <span>Buy Me a Coffee</span>
          <Heart size={12} className={styles.heart} />
        </a>
        <span className={styles.hint}>BuyMeACoffee link coming soon</span>
      </div>
    </div>
  );
}
