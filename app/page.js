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
import HeroParticles from '@/components/HeroParticles/HeroParticles';
import Hero3DElement from '@/components/Hero3DElement/Hero3DElement';

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <WallpaperBackground />

      {/* ── Hero: Clock + Quote ── */}
      <section className={styles.hero}>
        <HeroParticles />
        <ASCIIGlobe />
        <Hero3DElement />

        <DigitalClock />
        <QuoteOfTheDay />
        <div className={styles.spotifyWidget}>
          <SpotifyNowPlaying />
        </div>
      </section>

      {/* ── Music Full Screen ── */}
      <section className={styles.musicFull}>
        <SpotifyTopArtists />
      </section>

      {/* ── Gaming Section (PSN + AniList) ── */}
      <section className={styles.gamingSection}>
        <div className={styles.gamingHeader}>
          <p className={styles.gamingIntro}>
            Mapping out your recent <span className={styles.gamingIntroHighlight}>anime and gaming activity.</span>.
          </p>
        </div>
        <div className={`${styles.section} ${styles.psn}`}>
          <PSNProfile />
        </div>
        <div className={`${styles.section} ${styles.anilist}`}>
          <AniListStats />
        </div>
      </section>

      <section className={styles.roadmapFull}>
        <LifeRoadmap />
      </section>

      {/* ── Grind Section (CurrentlyGrinding + RunningGymTracker) ── */}
      <section className={styles.grindSection}>
        <div className={styles.grindHeader}>
          <p className={styles.grindIntro}>
            Here's what you're <span className={styles.grindIntroHighlight}>grinding and training</span> right now.
          </p>
        </div>
        <div className={`${styles.section} ${styles.grinding}`}>
          <CurrentlyGrinding />
        </div>
        <div className={`${styles.section} ${styles.fitness}`}>
          <RunningGymTracker />
        </div>
        <div className={styles.peekPanel}>
          <BuyMeACoffee />
        </div>
      </section>

      {/* ── Blog Coming Soon ── */}
      <section className={styles.blogFull}>
        <BlogPosts />
      </section>

      {/* ── Stagger Grid ── */}
      <div className={styles.mainGrid}>
        {/* <div className={`${styles.section} ${styles.streak}`}>
          <TaskStreak />
        </div> */}
        {/* <div className={`${styles.section} ${styles.logs}`}>
          <AgentLogs />
        </div> */}
      </div>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span className={styles.footerLeft}>
          <span className={styles.footerAccent}>Tamashi</span>.exe
        </span>
        <span className={styles.footerRight}>
          {/* Built with 魂 */}
          魂
        </span>
      </footer>
    </div>
  );
}
