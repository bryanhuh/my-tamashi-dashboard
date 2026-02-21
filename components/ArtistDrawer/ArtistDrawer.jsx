import { useState, useEffect } from 'react';
import { X, Play, Users, Disc3 } from 'lucide-react';
import styles from './ArtistDrawer.module.css';

export default function ArtistDrawer({ artistId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!artistId) return;
    
    setLoading(true);
    setError(false);
    
    fetch(`/api/spotify/artist-details?id=${artistId}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [artistId]);

  // Handle slide out animation before unmounting
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 400); // Matches CSS transition duration
  };

  // Close when pressing Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!artistId) return null;

  function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  function formatTime(ms) {
    const mins = Math.floor(ms / 60000);
    const secs = ((ms % 60000) / 1000).toFixed(0);
    return `${mins}:${(secs < 10 ? "0" : "")}${secs}`;
  }

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isClosing ? styles.fadeOut : ''}`} 
        onClick={handleClose} 
      />
      <div className={`${styles.drawer} ${isClosing ? styles.slideOut : styles.slideIn}`}>
        
        <button onClick={handleClose} className={styles.closeBtn} aria-label="Close">
          <X size={20} />
        </button>

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.skeletonHero} />
            <div className={styles.skeletonContent} />
          </div>
        ) : error || !data || !data.artist ? (
          <div className={styles.errorState}>
            <p>Failed to load artist details.</p>
            <button onClick={handleClose} className="pill">Close</button>
          </div>
        ) : (
          <div className={styles.content}>
            
            {/* Hero Section */}
            <div className={styles.hero}>
              <div 
                className={styles.heroBg} 
                style={{ backgroundImage: `url(${data.artist.image})` }} 
              />
              <div className={styles.heroOverlay} />
              
              <img 
                src={data.artist.image} 
                alt={data.artist.name} 
                className={styles.artistPhoto} 
              />
              
              <div className={styles.heroInfo}>
                <h2 className={styles.artistName}>{data.artist.name}</h2>
                <div className={styles.statsRow}>
                  <div className={styles.statPill} title="Followers">
                    <Users size={12} />
                    {formatNumber(data.artist.followers)}
                  </div>
                  <div className={styles.statPill} title="Spotify Popularity">
                    Pop. {data.artist.popularity}/100
                  </div>
                </div>
                
                {data.artist.genres && data.artist.genres.length > 0 && (
                  <div className={styles.genres}>
                    {data.artist.genres.map(g => (
                      <span key={g} className={styles.genreTag}>{g}</span>
                    ))}
                  </div>
                )}
                
                <a 
                  href={data.artist.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.playBtn}
                >
                  <Play size={14} fill="currentColor" /> Play on Spotify
                </a>
              </div>
            </div>

            {/* Scrollable Details */}
            <div className={styles.detailsScroll}>
              
              {/* Top Tracks */}
              {data.topTracks && data.topTracks.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Top Tracks</h3>
                  <div className={styles.tracksList}>
                    {data.topTracks.map((track, i) => (
                      <a 
                        key={track.id} 
                        href={track.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.trackRow}
                      >
                        <span className={styles.trackNum}>{i + 1}</span>
                        <img src={track.image} alt={track.album} className={styles.trackImg} />
                        <div className={styles.trackInfo}>
                          <span className={styles.trackName}>{track.name}</span>
                          <span className={styles.trackAlbum}>{track.album}</span>
                        </div>
                        <span className={styles.trackTime}>{formatTime(track.duration_ms)}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Latest Releases */}
              {data.latestReleases && data.latestReleases.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Latest Releases</h3>
                  <div className={styles.releaseGrid}>
                    {data.latestReleases.map(release => (
                      <a 
                        key={release.id} 
                        href={release.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.releaseCard}
                      >
                        <img src={release.image} alt={release.name} className={styles.releaseImg} />
                        <span className={styles.releaseName}>{release.name}</span>
                        <span className={styles.releaseType}>
                          {release.release_date.substring(0, 4)} • <span style={{ textTransform: 'capitalize' }}>{release.type}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Fans Also Like */}
              {data.relatedArtists && data.relatedArtists.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Fans Also Like</h3>
                  <div className={styles.relatedScroll}>
                    {data.relatedArtists.map(related => (
                      <a 
                        key={related.id} 
                        href={related.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.relatedCard}
                      >
                        {related.image ? (
                          <img src={related.image} alt={related.name} className={styles.relatedImg} />
                        ) : (
                          <div className={styles.relatedPlaceholder}><Disc3 size={24} /></div>
                        )}
                        <span className={styles.relatedName}>{related.name}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        )}
      </div>
    </>
  );
}
