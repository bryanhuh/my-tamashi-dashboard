'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Disc3 } from 'lucide-react';
import styles from './SpotifyTopArtists.module.css';
import ArtistDrawer from '../ArtistDrawer/ArtistDrawer';
import WorldMap from './WorldMap';

const TIME_RANGES = [
  { value: 'short_term', label: '4 Weeks' },
  { value: 'medium_term', label: '6 Months' },
  { value: 'long_term', label: 'All Time' },
];

const RANGE_LABELS = {
  short_term: 'the last 4 weeks',
  medium_term: 'the last 6 months',
  long_term: 'all time',
};

// Global landmass zones (normalized percentages roughly corresponding to SVG paths 0-1)
// Used to scatter international artists over continents safely without oceans.
const MAP_ZONES = [
  { region: 'North America', xArr: [0.15, 0.25], yArr: [0.35, 0.45] },
  { region: 'South America', xArr: [0.25, 0.35], yArr: [0.65, 0.8] },
  { region: 'Europe', xArr: [0.45, 0.55], yArr: [0.25, 0.35] },
  { region: 'Africa', xArr: [0.45, 0.55], yArr: [0.45, 0.6] },
  { region: 'Asia', xArr: [0.65, 0.8], yArr: [0.25, 0.45] },
  { region: 'Oceania', xArr: [0.75, 0.85], yArr: [0.7, 0.85] },
];

// Seeded random generator for stable map layout across renders
function seededRandom(seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Compute scaled layouts across landmass zones
function mapLayout(artists, width, height) {
  if (!artists.length) return [];

  const positions = [];
  const paddingX = 40; // padding inside container
  const paddingY = 40;

  artists.forEach((artist, i) => {
    // Generate stable random based on artist ID
    const random = seededRandom(artist.id || String(i));

    // Pick a zone
    const zoneIndex = Math.floor(random() * MAP_ZONES.length);
    const zone = MAP_ZONES[zoneIndex];

    const nx = zone.xArr[0] + random() * (zone.xArr[1] - zone.xArr[0]);
    const ny = zone.yArr[0] + random() * (zone.yArr[1] - zone.yArr[0]);

    let px = paddingX + nx * (width - paddingX * 2);
    let py = paddingY + ny * (height - paddingY * 2);

    // Collision deflection to prevent extreme overlaps
    for (let j = 0; j < positions.length; j++) {
      const p2 = positions[j];
      const dx = px - p2.x;
      const dy = py - p2.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 45) { // min distance
        px += (dx || 1) * 0.5;
        py += (dy || 1) * 0.5;
      }
    }

    positions.push({
      artist,
      x: px,
      y: py,
      index: i,
    });
  });

  return positions;
}

export default function SpotifyTopArtists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('short_term');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [positions, setPositions] = useState([]);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  const fieldRef = useRef(null);

  useEffect(() => {
    async function fetch_() {
      setLoading(true);
      try {
        const res = await fetch(`/api/spotify/top-artists?range=${range}`);
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

  const computeLayout = useCallback(() => {
    if (!fieldRef.current || !artists.length) return;
    const { width, height } = fieldRef.current.getBoundingClientRect();
    if (!width) return;
    setPositions(mapLayout(artists, width, height));
  }, [artists]);

  useEffect(() => {
    const t = setTimeout(computeLayout, 30);
    window.addEventListener('resize', computeLayout);
    return () => { clearTimeout(t); window.removeEventListener('resize', computeLayout); };
  }, [computeLayout]);

  return (
    <div className={styles.container}>
      {/* Static black-bordered grid background */}
      <div className={styles.gridBg}>
        {Array.from({ length: 90 }).map((_, i) => (
          <div key={i} className={styles.gridCell} />
        ))}
      </div>

      {/* Header */}
      <div className={styles.header}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={styles.introContainer}
        >
          <p className={styles.intro}>
            {loading
              ? 'Mapping your constellation…'
              : <>Here's your top artists for <span>{RANGE_LABELS[range]}</span>.</>
            }
          </p>
        </motion.div>
      </div>

      {needsSetup ? (
        <div className={styles.setup}>
          <Disc3 size={24} className={styles.setupIcon} />
          <p>Connect Spotify to see your constellation</p>
        </div>
      ) : (
        <div className={styles.field} ref={fieldRef}>
          {/* Flat World Map SVG Background */}
          <WorldMap />

          {/* Staggered block filter card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className={styles.filterCard}
          >
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
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className={styles.loadingOverlay}>
              <Disc3 size={20} className={styles.loadingIcon} />
              <span>Mapping your artists…</span>
            </div>
          )}

          {/* Artist Map Pins */}
          {!loading && positions.map((pos, i) => {
            const isHovered = hoveredIdx === i;
            // Map pin size
            const sz = 60;

            return (
              <motion.div
                key={pos.artist.id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.03 + 0.1,
                  type: 'spring',
                  stiffness: 150,
                  damping: 15
                }}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  zIndex: isHovered ? 20 : 4,
                  transform: 'translate(-50%, -100%)', // Align pin point to coordinate
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedArtistId(pos.artist.id);
                  }}
                  className={`${styles.star} ${isHovered ? styles.starHovered : ''}`}
                  style={{ width: sz, height: sz }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {pos.artist.image
                    ? <img src={pos.artist.image} alt={pos.artist.name} className={styles.starImg} draggable={false} />
                    : <div className={styles.starPlaceholder}><Disc3 size={sz * 0.4} /></div>
                  }

                  {/* Clean white map ring pointer */}
                  <div className={styles.starRing} />

                  <div className={styles.starLabel}>
                    <span className={styles.starName}>{pos.artist.name}</span>
                    {pos.artist.genres?.[0] && (
                      <span className={styles.starGenre}>{pos.artist.genres[0]}</span>
                    )}
                  </div>

                  <div className={styles.starRank}>{String(i + 1).padStart(2, '0')}</div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedArtistId && (
        <ArtistDrawer
          artistId={selectedArtistId}
          onClose={() => setSelectedArtistId(null)}
        />
      )}
    </div>
  );
}
