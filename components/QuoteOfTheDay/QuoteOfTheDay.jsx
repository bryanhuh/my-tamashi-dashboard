'use client';

import { useState, useEffect } from 'react';
import styles from './QuoteOfTheDay.module.css';

const fallbackQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Programs must be written for people to read.", author: "Harold Abelson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
];

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    // Use day of year as seed for consistent daily quote
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const index = dayOfYear % fallbackQuotes.length;
    setQuote(fallbackQuotes[index]);
  }, []);

  if (!quote) return null;

  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quote}>
        <p className={styles.text}>&ldquo;{quote.text}&rdquo;</p>
        <span className={styles.author}>— {quote.author}</span>
      </div>

      {/* ── Quick Stats Ribbon ── */}
      <div className={styles.statsRibbon}>
        <div className={styles.statItem}>
          <span className={styles.statDot} style={{ backgroundColor: 'var(--spotify)' }}></span>
          !spotify
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statDot} style={{ backgroundColor: 'var(--psn)' }}></span>
          Platinum Hunter
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statDot} style={{ backgroundColor: 'var(--anilist)' }}></span>
          Anime
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollDown}>↓</span>
      </div>
    </div>
  );
}
