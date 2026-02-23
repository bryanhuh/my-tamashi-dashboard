"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './LifeRoadmap.module.css';
import roadmapData from '@/data/roadmap.json';

const statusIcons = {
  done: '✅',
  'in-progress': '🔄',
  planned: '📌',
};

// Character images mapped to each card index
const characterImages = [
  '/daioh/chiyo.png',
  '/daioh/osaka.png',
  '/daioh/sakaki.png',
  '/daioh/tomo.png',
  '/daioh/yomi.png',
  '/daioh/kagura.png',
  '/daioh/kaorin.png',
];

// Simple fade-in only — colors are static in CSS
const boxVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const imageVariants = {
  hidden:  { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.15 } },
};

// Varied SVG paths — all in a 0–100 × 0–100 viewBox.
const leftPaths  = [
  'M 46,0 C 50,40 50,60 54,100',
  'M 5,0  C 20,80 80,20 95,100',
  'M 46,0 C 80,30 20,70 54,100',
  'M 5,0  C 10,60 90,40 54,100',
];
const rightPaths = [
  'M 54,0 C 50,40 50,60 46,100',
  'M 95,0 C 80,80 20,20  5,100',
  'M 54,0 C 20,30 80,70 46,100',
  'M 95,0 C 90,60 10,40 46,100',
];

export default function LifeRoadmap() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={styles.container}>
      {/* Black-bordered grid background */}
      <div className={styles.gridBg}>
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className={styles.gridCell} />
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 500, color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'left', marginBottom: '24px', paddingLeft: '48px' }}>
        Life Roadmap
      </div>

      <div className={styles.timeline}>
        {roadmapData.map((item, i) => {
          const isLeft = i % 2 === 0;
          const isLast = i === roadmapData.length - 1;
          const pathArr = isLeft ? leftPaths : rightPaths;
          const svgPath = pathArr[i % pathArr.length];
          const isDimmed = hoveredIndex !== null && hoveredIndex !== i;

          return (
            <div key={item.id}>
              {/* Row: Card + Image */}
              <div
                className={`${styles.itemWrapper} ${isLeft ? styles.rowLeft : styles.rowRight} ${isDimmed ? styles.dimmed : ''}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card */}
                <motion.div
                  variants={boxVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-15%' }}
                  className={styles.box}
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

                {/* Character Image */}
                <motion.div
                  variants={imageVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-15%' }}
                  className={styles.imageWrapper}
                >
                  <Image
                    src={characterImages[i] || characterImages[0]}
                    alt={`Character ${i + 1}`}
                    width={200}
                    height={300}
                    className={styles.characterImage}
                    unoptimized
                  />
                </motion.div>
              </div>

              {/* SVG connector between rows */}
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
