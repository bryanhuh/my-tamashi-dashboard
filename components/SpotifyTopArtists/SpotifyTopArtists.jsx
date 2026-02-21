'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Disc3 } from 'lucide-react';
import styles from './SpotifyTopArtists.module.css';
import ArtistDrawer from '../ArtistDrawer/ArtistDrawer';
import ArtistEffect from './ArtistEffect';

const TIME_RANGES = [
  { value: 'short_term',  label: '4 Weeks'  },
  { value: 'medium_term', label: '6 Months' },
  { value: 'long_term',   label: 'All Time' },
];

const RANGE_LABELS = {
  short_term:  'the last 4 weeks',
  medium_term: 'the last 6 months',
  long_term:   'all time',
};

// Star size decreasing by rank
function starSize(index) {
  if (index === 0) return 72;
  if (index === 1) return 64;
  if (index  < 4) return 56;
  if (index  < 7) return 48;
  return 42;
}

// Place artists on concentric rings around (cx, cy)
function radialLayout(artists, cx, cy, radius) {
  if (!artists.length) return [];

  // Split into rings based on count
  let rings;
  const n = artists.length;
  if      (n <= 3)  rings = [artists];
  else if (n <= 6)  rings = [artists.slice(0, 2), artists.slice(2)];
  else if (n <= 10) rings = [artists.slice(0, 2), artists.slice(2, 5), artists.slice(5)];
  else if (n <= 15) rings = [artists.slice(0, 2), artists.slice(2, 6), artists.slice(6, 11), artists.slice(11)];
  else              rings = [artists.slice(0, 3), artists.slice(3, 8), artists.slice(8, 14), artists.slice(14)];

  const ringRadii = [0.22, 0.42, 0.65, 0.85, 1.0].slice(0, rings.length).map(r => r * radius);

  const positions = [];
  let globalIdx = 0;

  rings.forEach((ring, ri) => {
    const r       = ringRadii[ri];
    const phase   = ri % 2 === 0 ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / ring.length;
    ring.forEach((artist, j) => {
      const angle = phase + (2 * Math.PI * j) / ring.length;
      positions.push({
        artist,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        index: globalIdx++,
        floatDelay: (globalIdx * 0.37) % 2.5,
        floatDur:   3.2 + (globalIdx % 5) * 0.4,
      });
    });
  });

  return positions;
}

// ── ASCII Globe & Puzzle lines hook ──────────────────────────────────────────
function useAsciiCanvas(canvasRef, preRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const pre = preRef.current;
    if (!canvas || !pre) return;
    const ctx = canvas.getContext('2d');

    // Globe Constants
    const SHADE = ' .·:;+=xX$&#@';
    const LAT_STEP = 30;
    const LON_STEP = 30;
    const LINE_THRESHOLD = 0.08;

    // Particles (for ambient floating dots)
    const particles = Array.from({ length: 60 }, () => ({
      x:  Math.random(),
      y:  Math.random(),
      r:  Math.random() * 1.5 + 0.5,
      op: Math.random() * 0.4 + 0.1,
      tw: Math.random() * 0.02 + 0.005,
      to: Math.random() * Math.PI * 2,
      dx: (Math.random() - 0.5) * 0.0001,
      dy: (Math.random() - 0.5) * 0.0001,
    }));

    let t = 0;
    let A = 0; // Globe rotation
    let raf;

    function resize() {
      canvas.width  = canvas.offsetWidth  || 800;
      canvas.height = canvas.offsetHeight || 560; // Increased height
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Spotify ASCII Logo
    const spotifyLogo = [
      "      .---.      ",
      "    /       \\    ",
      "   |   -.-   |   ",
      "   |   ---   |   ",
      "    \\       /    ",
      "      `---'      "
    ];

    function draw() {
      const w = canvas.width;
      const h = canvas.height;

      // 1) Canvas Background (White + Blue Puzzle Lines)
      ctx.clearRect(0, 0, w, h);

      // White radial gradient bg
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.85);
      bg.addColorStop(0,   '#ffffff');
      bg.addColorStop(0.5, '#f5f5fa');
      bg.addColorStop(1,   '#ebebf5');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Puzzle background lines (subtle blue grid)
      ctx.beginPath();
      const gridSize = 45;
      for (let x = (t * 5) % gridSize; x <= w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = (t * 5) % gridSize; y <= h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.strokeStyle = `rgba(43, 0, 255, 0.06)`; // Suble blue
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ambient dots (accent blue)
      particles.forEach(p => {
        p.x = (p.x + p.dx + 1) % 1;
        p.y = (p.y + p.dy + 1) % 1;
        const op = p.op * (0.6 + 0.4 * Math.sin(t * p.tw + p.to));
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(43, 0, 255, ${op * 0.4})`;
        ctx.fill();
      });

      // 2) ASCII Globe overlay (rendered to <pre>)
      const outputCols = Math.floor(w / 8); 
      const outputRows = Math.floor(h / 14);
      const COLS = outputCols > 120 ? 120 : outputCols;
      const ROWS = outputRows > 50 ? 50 : outputRows;

      const output = new Array(COLS * ROWS).fill(' ');
      const zbuf   = new Array(COLS * ROWS).fill(-Infinity);

      const R    = 14;     
      const K2   = 120;    
      const K1   = (COLS * K2 * 3) / (8 * (R + R)); 
      
      const LX = 0.5, LY = 0.7, LZ = 0.5;
      const Llen = Math.hypot(LX, LY, LZ);
      const lx = LX / Llen, ly = LY / Llen, lz = LZ / Llen;

      const cosA = Math.cos(A), sinA = Math.sin(A);
      const cosB = Math.cos(0.5), sinB = Math.sin(0.5);

      if (COLS > 20 && ROWS > 20) {
        for (let phi = 0; phi < Math.PI * 2; phi += 0.04) {
          for (let theta = 0; theta < Math.PI; theta += 0.04) {
            const sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);
            const sinTh  = Math.sin(theta), cosTh = Math.cos(theta);

            const sx = R * sinTh * cosPhi, sy = R * sinTh * sinPhi, sz = R * cosTh;
            const nx = sinTh * cosPhi, ny = sinTh * sinPhi, nz = cosTh;

            const x1 = sx * cosA + sz * sinA, z1 = -sx * sinA + sz * cosA;
            const nx1 = nx * cosA + nz * sinA, nz1 = -nx * sinA + nz * cosA;
            const y2  = sy  * cosB - z1  * sinB, z2  = sy  * sinB + z1  * cosB;
            const ny2 = ny  * cosB - nz1 * sinB;

            const oneOverZ = 1 / (z2 + K2);
            // Center the globe in the background
            const px = Math.round(COLS / 2 + K1 * x1 * oneOverZ);
            const py = Math.round(ROWS / 2 - K1 * y2 * oneOverZ * 0.48);

            if (px < 0 || px >= COLS || py < 0 || py >= ROWS) continue;
            const idx = py * COLS + px;
            if (oneOverZ <= zbuf[idx]) continue;
            zbuf[idx] = oneOverZ;

            const diffuse = Math.max(0, nx1 * lx + ny2 * ly + nz1 * lz);
            const latDeg = (theta / Math.PI) * 180;
            const lonDeg = ((phi   / (Math.PI * 2)) * 360);

            const nearLat = (latDeg % LAT_STEP) < LINE_THRESHOLD * 180 ||
                            (LAT_STEP - (latDeg % LAT_STEP)) < LINE_THRESHOLD * 180;
            const nearLon = (lonDeg % LON_STEP) < LINE_THRESHOLD * 360 ||
                            (LON_STEP - (lonDeg % LON_STEP)) < LINE_THRESHOLD * 360;

            let ch;
            if (nearLat || nearLon) {
              const bright = 0.5 + diffuse * 0.5;
              const ci = Math.min(SHADE.length - 1, Math.floor(bright * (SHADE.length - 1)));
              ch = SHADE[Math.max(ci, 4)]; 
            } else {
              const ci = Math.floor(diffuse * diffuse * 6);
              ch = SHADE[Math.max(0, Math.min(ci, 5))];
            }
            output[idx] = ch;
          }
        }
      }

      // Draw Spotify Logo Bottom Left
      if (ROWS > 8 && COLS > 20) {
        const logoStartY = ROWS - spotifyLogo.length - 2;
        const logoStartX = 4;
        for (let i = 0; i < spotifyLogo.length; i++) {
          for (let j = 0; j < spotifyLogo[i].length; j++) {
            const idx = (logoStartY + i) * COLS + (logoStartX + j);
            if (idx >= 0 && idx < output.length && spotifyLogo[i][j] !== ' ') {
              output[idx] = spotifyLogo[i][j];
            }
          }
        }
      }

      let rowsStr = '';
      for (let r = 0; r < ROWS; r++) {
        rowsStr += output.slice(r * COLS, (r + 1) * COLS).join('') + '\n';
      }
      pre.textContent = rowsStr;

      t += 0.04;
      A += 0.012;
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SpotifyTopArtists() {
  const [artists,    setArtists]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [range,      setRange]      = useState('short_term');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [positions,  setPositions]  = useState([]);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  const canvasRef    = useRef(null);
  const preRef       = useRef(null);
  const fieldRef     = useRef(null);

  useAsciiCanvas(canvasRef, preRef);

  // Fetch artists
  useEffect(() => {
    async function fetch_() {
      setLoading(true);
      try {
        const res  = await fetch(`/api/spotify/top-artists?range=${range}`);
        const json = await res.json();
        if (json.needsSetup) setNeedsSetup(true);
        else setArtists(json.artists || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [range]);

  // Compute radial positions
  const computeLayout = useCallback(() => {
    if (!fieldRef.current || !artists.length) return;
    const { width, height } = fieldRef.current.getBoundingClientRect();
    if (!width) return;
    const cx = width / 2;
    const cy = height / 2;
    const r  = Math.min(width, height) / 2 - 16;
    setPositions(radialLayout(artists, cx, cy, r));
  }, [artists]);

  useEffect(() => {
    const t = setTimeout(computeLayout, 30);
    window.addEventListener('resize', computeLayout);
    return () => { clearTimeout(t); window.removeEventListener('resize', computeLayout); };
  }, [computeLayout]);

  // Genre connection lines
  const hoveredEntry   = hoveredIdx !== null ? positions[hoveredIdx] : null;
  const hoveredGenres  = hoveredEntry?.artist?.genres ?? [];
  const connectedIdxs  = hoveredEntry
    ? positions
        .map((p, i) => ({ p, i }))
        .filter(({ p, i }) =>
          i !== hoveredIdx &&
          (p.artist.genres ?? []).some(g => hoveredGenres.includes(g))
        )
        .map(({ i }) => i)
    : [];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.introContainer}>
          <p className={styles.intro}>
            Bryan,{' '}
            {loading
              ? 'mapping your constellation…'
              : <>here are your top artists for <span className={styles.introHighlight}>{RANGE_LABELS[range]}</span>.</>
            }
          </p>
        </div>
      </div>

      {needsSetup ? (
        <div className={styles.setup}>
          <Disc3 size={24} className={styles.setupIcon} />
          <p>Connect Spotify to see your constellation</p>
        </div>
      ) : (
        <div className={styles.field} ref={fieldRef}>
          {/* Staggered block filter card */}
          <div className={styles.filterCard}>
            {TIME_RANGES.map((r, i) => {
              const indent = i === 1 ? '16px' : '0px';
              return (
                <button
                  key={r.value}
                  className={`${styles.filterItem} ${range === r.value ? styles.filterActive : ''}`}
                  style={{ '--indent': indent }}
                  onClick={() => setRange(r.value)}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Animated background canvas */}
          <canvas ref={canvasRef} className={styles.canvas} />
          <pre ref={preRef} className={styles.asciiOverlay} aria-hidden="true" />

          {/* Artist corner 3D shader overlay */}
          <ArtistEffect />

          {/* Genre connection lines (SVG layer) */}
          <svg className={styles.linesSvg} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {hoveredEntry && connectedIdxs.map(ci => (
              <line
                key={ci}
                x1={hoveredEntry.x} y1={hoveredEntry.y}
                x2={positions[ci].x}  y2={positions[ci].y}
                stroke="rgba(43, 0, 255, 0.45)"
                strokeWidth="1"
                strokeDasharray="5 4"
                filter="url(#lineGlow)"
                className={styles.connectionLine}
              />
            ))}
          </svg>

          {/* Central identity glow */}
          <div className={styles.central}>
            <div className={styles.centralRing1} />
            <div className={styles.centralRing2} />
            <div className={styles.centralCore}>♪</div>
          </div>

          {/* Loading */}
          {loading && (
            <div className={styles.loadingOverlay}>
              <Disc3 size={20} className={styles.loadingIcon} />
              <span>Mapping your constellation…</span>
            </div>
          )}

          {/* Artist stars */}
          {!loading && positions.map((pos, i) => {
            const sz          = starSize(i);
            const isHovered   = hoveredIdx === i;
            const isConnected = connectedIdxs.includes(i);

            return (
              <button
                key={pos.artist.id || i}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedArtistId(pos.artist.id);
                }}
                className={`
                  ${styles.star}
                  ${isHovered   ? styles.starHovered   : ''}
                  ${isConnected ? styles.starConnected : ''}
                `}
                style={{
                  left:   pos.x,
                  top:    pos.y,
                  width:  sz,
                  height: sz,
                  '--float-dur':   `${pos.floatDur}s`,
                  '--float-delay': `${pos.floatDelay}s`,
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Photo */}
                {pos.artist.image
                  ? <img src={pos.artist.image} alt={pos.artist.name} className={styles.starImg} draggable={false} />
                  : <div className={styles.starPlaceholder}><Disc3 size={sz * 0.35} /></div>
                }

                {/* Glow ring (always visible) */}
                <div className={styles.starRing} />

                {/* Hover info label */}
                <div className={styles.starLabel}>
                  <span className={styles.starName}>{pos.artist.name}</span>
                  {pos.artist.genres?.[0] && (
                    <span className={styles.starGenre}>{pos.artist.genres[0]}</span>
                  )}
                </div>

                {/* Rank badge */}
                <div className={styles.starRank}>{String(i + 1).padStart(2, '0')}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Artist Details Drawer */}
      {selectedArtistId && (
        <ArtistDrawer 
          artistId={selectedArtistId} 
          onClose={() => setSelectedArtistId(null)} 
        />
      )}
    </div>
  );
}
