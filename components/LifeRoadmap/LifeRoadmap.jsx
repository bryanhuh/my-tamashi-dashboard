"use client";

import { motion } from 'framer-motion';
import styles from './LifeRoadmap.module.css';
import roadmapData from '@/data/roadmap.json';

const statusIcons = {
  done: '✅',
  'in-progress': '🔄',
  planned: '📌',
};

// Simple fade-in only — colors are static in CSS
const boxVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Varied SVG paths — all in a 0–100 × 0–100 viewBox.
// Left cards occupy roughly x: 0–46; right cards x: 54–100.
// Paths deliberately start/end at different corners of those zones.
const leftPaths  = [
  'M 46,0 C 50,40 50,60 54,100',           // straight S through center
  'M 5,0  C 20,80 80,20 95,100',           // diagonal sweep (left→right)
  'M 46,0 C 80,30 20,70 54,100',           // bulge left
  'M 5,0  C 10,60 90,40 54,100',           // left-corner start → right-card entry
];
const rightPaths = [
  'M 54,0 C 50,40 50,60 46,100',           // straight S through center
  'M 95,0 C 80,80 20,20  5,100',           // diagonal sweep (right→left)
  'M 54,0 C 20,30 80,70 46,100',           // bulge right
  'M 95,0 C 90,60 10,40 46,100',           // right-corner start → left-card entry
];

export default function LifeRoadmap() {
  return (
    <div className={styles.container}>
      <div className="sectionIndex" style={{ textAlign: 'center', marginBottom: '24px', color: '#111' }}>
        05 — Life Roadmap
      </div>

      <div className={styles.timeline}>
        {roadmapData.map((item, i) => {
          const isLeft = i % 2 === 0;
          const isLast = i === roadmapData.length - 1;
          const pathArr = isLeft ? leftPaths : rightPaths;
          const svgPath = pathArr[i % pathArr.length];

          return (
            <div key={item.id} className={styles.itemWrapper}>
              {/* Card */}
              <motion.div
                variants={boxVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-15%' }}
                className={`${styles.box} ${isLeft ? styles.boxLeft : styles.boxRight}`}
              >
                <span className={styles.year}>{item.year}</span>

                <div className={styles.meta}>
                  <span className={styles.statusIcon}>{statusIcons[item.status]}</span>
                  <span
                    className="tag"
                    style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    {item.category}
                  </span>
                </div>

                <h4 className={styles.title}>{item.title}</h4>
                <p className={styles.description}>{item.description}</p>
              </motion.div>

              {/* In-flow SVG connector — sits between cards in the flex column */}
              {!isLast && (
                <svg
                  className={styles.connector}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: '-15%' }}
                    transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.45 }}
                    d={svgPath}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
