import styles from './page.module.css';

import WallpaperBackground from '@/components/WallpaperBackground/WallpaperBackground';
import DigitalClock from '@/components/DigitalClock/DigitalClock';
import QuoteOfTheDay from '@/components/QuoteOfTheDay/QuoteOfTheDay';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying/SpotifyNowPlaying';
import SpotifyTopArtists from '@/components/SpotifyTopArtists/SpotifyTopArtists';
import PSNProfile from '@/components/PSNProfile/PSNProfile';
import AniListStats from '@/components/AniListStats/AniListStats';
import LifeRoadmap from '@/components/LifeRoadmap/LifeRoadmap';
import TaskStreak from '@/components/TaskStreak/TaskStreak';
import CurrentlyGrinding from '@/components/CurrentlyGrinding/CurrentlyGrinding';
import BlogPosts from '@/components/BlogPosts/BlogPosts';
import AgentLogs from '@/components/AgentLogs/AgentLogs';
import RunningGymTracker from '@/components/RunningGymTracker/RunningGymTracker';
import BuyMeACoffee from '@/components/BuyMeACoffee/BuyMeACoffee';

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <WallpaperBackground />

      {/* ── Hero: Clock + Quote ── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <DigitalClock />
        <QuoteOfTheDay />
      </section>

      {/* ── Main Grid ── */}
      <div className={styles.mainGrid}>
        {/* Row 1: Spotify */}
        <div className={styles.section}>
          <SpotifyNowPlaying />
        </div>
        <div className={styles.section}>
          <SpotifyTopArtists />
        </div>

        {/* Row 2: Gaming + Anime */}
        <div className={styles.section}>
          <PSNProfile />
        </div>
        <div className={styles.section}>
          <AniListStats />
        </div>

        {/* Row 3: Goals + Streak */}
        <div className={styles.section}>
          <LifeRoadmap />
        </div>
        <div className={styles.section}>
          <TaskStreak />
        </div>

        {/* Row 4: Grinding + Fitness */}
        <div className={styles.section}>
          <CurrentlyGrinding />
        </div>
        <div className={styles.section}>
          <RunningGymTracker />
        </div>

        {/* Row 5: Blog (full width) */}
        <div className={`${styles.section} ${styles.fullWidth}`}>
          <BlogPosts />
        </div>

        {/* Row 6: Agent Logs (full width) */}
        <div className={`${styles.section} ${styles.fullWidth}`}>
          <AgentLogs />
        </div>

        {/* Row 7: BuyMeACoffee (full width) */}
        <div className={`${styles.section} ${styles.fullWidth}`}>
          <BuyMeACoffee />
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span className={styles.footerLeft}>
          <span className={styles.footerAccent}>Tamashi</span> — Digital HQ
        </span>
        <span className={styles.footerRight}>
          Built with 魂
        </span>
      </footer>
    </div>
  );
}
