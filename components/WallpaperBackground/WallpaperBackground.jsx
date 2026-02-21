'use client';

// WallpaperBackground is temporarily disabled in favour of the light #E5E5E5 theme.
// To re-enable: uncomment everything below and remove the empty export.

/*
import { useState, useEffect } from 'react';
import styles from './WallpaperBackground.module.css';

const wallpapers = [
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80',
  'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?w=1920&q=80',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
  'https://images.unsplash.com/photo-1504192010706-dd7f569ee2be?w=1920&q=80',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
  'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
  'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=1920&q=80',
];

export default function WallpaperBackground() {
  const [wallpaper, setWallpaper] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const index = Math.floor(Math.random() * wallpapers.length);
    const img = new Image();
    img.onload = () => {
      setWallpaper(wallpapers[index]);
      setLoaded(true);
    };
    img.src = wallpapers[index];
  }, []);

  return (
    <div className={styles.background}>
      {wallpaper && (
        <div
          className={`${styles.image} ${loaded ? styles.loaded : ''}`}
          style={{ backgroundImage: `url(${wallpaper})` }}
        />
      )}
      <div className={styles.overlay} />
      <div className={styles.noise} />
      <div className={styles.vignette} />
    </div>
  );
}
*/

export default function WallpaperBackground() {
  return null;
}
