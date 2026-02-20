'use client';

import { useState, useEffect } from 'react';
import styles from './DigitalClock.module.css';

export default function DigitalClock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const update = () => setTime(new Date());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const hours = time.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
  
  const timeStr = time.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false 
  });

  const dateStr = time.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className={styles.clock}>
      <div className={styles.greeting}>{greeting}, Bryan</div>
      <div className={styles.time}>
        {timeStr.split('').map((char, i) => (
          <span key={i} className={char === ':' ? styles.colon : styles.digit}>
            {char}
          </span>
        ))}
      </div>
      <div className={styles.date}>{dateStr}</div>
    </div>
  );
}
