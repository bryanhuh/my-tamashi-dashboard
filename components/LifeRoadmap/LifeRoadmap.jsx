"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
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

// ── Particle Canvas ──
const PARTICLE_COLORS = [
  [230, 38, 31],   // #E6261F red
  [235, 117, 50],  // #EB7532 orange
  [247, 208, 56],  // #F7D038 yellow
  [163, 224, 72],  // #A3E048 green
  [73, 218, 154],  // #49DA9A teal
  [52, 187, 230],  // #34BBE6 light blue
  [67, 85, 219],   // #4355DB indigo
  [210, 59, 231],  // #D23BE7 purple
];

function ParticleField({ direction, isHovered }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  const createParticle = useCallback((w, h, dir) => {
    const fromRight = dir === 'right';
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    return {
      x: fromRight ? Math.random() * w * 0.4 : w * 0.6 + Math.random() * w * 0.4,
      y: Math.random() * h,
      vx: fromRight ? (Math.random() * 2 + 1) : -(Math.random() * 2 + 1),
      vy: (Math.random() - 0.5) * 1.2,
      r: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      life: 1,
      decay: Math.random() * 0.008 + 0.004,
      color,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    }
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Initial particles
    particlesRef.current = Array.from({ length: 20 }, () => createParticle(w, h, direction));

    function animate() {
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;

      // Spawn more when hovered
      if (isHovered && particles.length < 60) {
        particles.push(createParticle(w, h, direction));
        particles.push(createParticle(w, h, direction));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0 || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          particles.splice(i, 1);
          if (particles.length < (isHovered ? 50 : 15)) {
            particles.push(createParticle(w, h, direction));
          }
          continue;
        }

        const [r, g, b] = p.color;
        const alpha = p.opacity * p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [direction, isHovered, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.particleCanvas}
    />
  );
}

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
          const isThisHovered = hoveredIndex === i;

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

                {/* Character Image with Particles */}
                <motion.div
                  variants={imageVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-15%' }}
                  className={`${styles.imageWrapper} ${styles.imageWrapper3d}`}
                >
                  <ParticleField
                    direction={isLeft ? 'left' : 'right'}
                    isHovered={isThisHovered}
                  />
                  <div className={styles.image3dContainer}>
                    <Image
                      src={characterImages[i] || characterImages[0]}
                      alt={`Character ${i + 1}`}
                      width={200}
                      height={300}
                      className={styles.characterImage}
                      unoptimized
                    />
                  </div>
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
