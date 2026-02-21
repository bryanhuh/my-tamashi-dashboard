'use client';

import { useEffect, useRef } from 'react';
import styles from './ASCIIGlobe.module.css';

// ASCII chars ordered light → dark for shading
const SHADE = ' .·:;+=xX$&#@';

// Globe wireframe density — how many degrees between lat/lon lines
const LAT_STEP = 30;
const LON_STEP = 30;
const LINE_THRESHOLD = 0.08; // how close to a grid line counts as "on" it

export default function ASCIIGlobe() {
  const preRef = useRef(null);

  useEffect(() => {
    const COLS = 72;
    const ROWS = 36;
    const R    = 14;     // sphere radius in "units"
    const K2   = 120;    // camera z-distance
    const K1   = (COLS * K2 * 3) / (8 * (R + R)); // projection scale

    // Light direction (upper-right-front), normalised
    const LX = 0.5, LY = 0.7, LZ = 0.5;
    const Llen = Math.hypot(LX, LY, LZ);
    const lx = LX / Llen, ly = LY / Llen, lz = LZ / Llen;

    let A = 0; // Y-axis rotation
    let raf;

    function render() {
      const output = new Array(COLS * ROWS).fill(' ');
      const zbuf   = new Array(COLS * ROWS).fill(-Infinity);

      const cosA = Math.cos(A), sinA = Math.sin(A);
      // Slight fixed tilt so we can see both hemispheres
      const cosB = Math.cos(0.5), sinB = Math.sin(0.5);

      // Dense sampling of sphere surface via (phi, theta) parametric
      for (let phi = 0; phi < Math.PI * 2; phi += 0.025) {
        for (let theta = 0; theta < Math.PI; theta += 0.025) {
          const sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);
          const sinTh  = Math.sin(theta), cosTh = Math.cos(theta);

          // Surface point in sphere space
          const sx = R * sinTh * cosPhi;
          const sy = R * sinTh * sinPhi;
          const sz = R * cosTh;

          // Surface normal (same as unit position on sphere)
          const nx = sinTh * cosPhi;
          const ny = sinTh * sinPhi;
          const nz = cosTh;

          // Rotate around Y by A
          const x1 = sx * cosA + sz * sinA;
          const z1 = -sx * sinA + sz * cosA;
          const nx1 = nx * cosA + nz * sinA;
          const nz1 = -nx * sinA + nz * cosA;

          // Rotate around X by B (tilt)
          const y2  = sy  * cosB - z1  * sinB;
          const z2  = sy  * sinB + z1  * cosB;
          const ny2 = ny  * cosB - nz1 * sinB;

          // Projection
          const oneOverZ = 1 / (z2 + K2);
          const px = Math.round(COLS / 2 + K1 * x1 * oneOverZ);
          const py = Math.round(ROWS / 2 - K1 * y2 * oneOverZ * 0.48);

          if (px < 0 || px >= COLS || py < 0 || py >= ROWS) continue;
          const idx = py * COLS + px;
          if (oneOverZ <= zbuf[idx]) continue;
          zbuf[idx] = oneOverZ;

          // Lighting — dot product with light dir (using rotated normal)
          const diffuse = Math.max(0, nx1 * lx + ny2 * ly + nz1 * lz);

          // Is this point near a lat/lon grid line?
          const latDeg = (theta / Math.PI) * 180;           // 0–180
          const lonDeg = ((phi   / (Math.PI * 2)) * 360);   // 0–360

          const nearLat = (latDeg % LAT_STEP) < LINE_THRESHOLD * 180 ||
                          (LAT_STEP - (latDeg % LAT_STEP)) < LINE_THRESHOLD * 180;
          const nearLon = (lonDeg % LON_STEP) < LINE_THRESHOLD * 360 ||
                          (LON_STEP - (lonDeg % LON_STEP)) < LINE_THRESHOLD * 360;

          let ch;
          if (nearLat || nearLon) {
            // Grid line: brighter chars
            const bright = 0.5 + diffuse * 0.5;
            const ci = Math.min(SHADE.length - 1, Math.floor(bright * (SHADE.length - 1)));
            ch = SHADE[Math.max(ci, 4)]; // never below '=' so grid pops
          } else {
            // Surface fill: subtler chars
            const ci = Math.floor(diffuse * diffuse * 6);
            ch = SHADE[Math.max(0, Math.min(ci, 5))];
          }
          output[idx] = ch;
        }
      }

      if (preRef.current) {
        let rows = '';
        for (let r = 0; r < ROWS; r++) {
          rows += output.slice(r * COLS, (r + 1) * COLS).join('') + '\n';
        }
        preRef.current.textContent = rows;
      }

      A += 0.012;
      raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <pre ref={preRef} className={styles.globe} aria-hidden="true" />
  );
}
