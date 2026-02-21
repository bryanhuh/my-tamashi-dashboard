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
import ASCIIGlobe from '@/components/ASCIIGlobe/ASCIIGlobe';

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <WallpaperBackground />

      {/* ── Hero: Clock + Quote ── */}
      <section className={styles.hero}>
        <ASCIIGlobe />
        <DigitalClock />
        <QuoteOfTheDay />
        <div className={styles.spotifyWidget}>
          <SpotifyNowPlaying />
        </div>
      </section>

      {/* ── Stagger Grid ── */}
      <div className={styles.mainGrid}>

        <div className={`${styles.section} ${styles.spotifyArtists}`}>
          <SpotifyTopArtists />
        </div>
        <div className={`${styles.section} ${styles.psn}`}>
          <PSNProfile />
        </div>
        <div className={`${styles.section} ${styles.anilist}`}>
          <AniListStats />
        </div>
        <div className={`${styles.section} ${styles.roadmap}`}>
          <LifeRoadmap />
        </div>
        <div className={`${styles.section} ${styles.streak}`}>
          <TaskStreak />
        </div>
        <div className={`${styles.section} ${styles.grinding}`}>
          <CurrentlyGrinding />
        </div>
        <div className={`${styles.section} ${styles.fitness}`}>
          <RunningGymTracker />
        </div>
        <div className={`${styles.section} ${styles.blog}`}>
          <BlogPosts />
        </div>
        <div className={`${styles.section} ${styles.logs}`}>
          <AgentLogs />
        </div>
        <div className={`${styles.section} ${styles.coffee}`}>
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
