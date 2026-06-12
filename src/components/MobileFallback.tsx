import { useEffect } from 'react';
import { useSignalStore, SCREEN_LABELS, type ScreenId } from '../store';
import { profile } from '../data/profile';
import { GlitchText } from './GlitchText';
import { RecruiterQuickAccess } from './RecruiterQuickAccess';
import { MainTerminalScreen } from '../screens/MainTerminalScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { SkillsScreen } from '../screens/SkillsScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { CVScreen } from '../screens/CVScreen';
import { ContactScreen } from '../screens/ContactScreen';

const SECTIONS: { id: ScreenId; component: React.ComponentType }[] = [
  { id: 'home', component: MainTerminalScreen },
  { id: 'about', component: AboutScreen },
  { id: 'skills', component: SkillsScreen },
  { id: 'projects', component: ProjectsScreen },
  { id: 'cv', component: CVScreen },
  { id: 'contact', component: ContactScreen },
];

/**
 * Mobile / no-WebGL fallback: same content as the 3D desk, presented as
 * stacked monitor-style cards. Navigation actions (HUD buttons, terminal
 * commands) scroll to the matching section instead of moving a camera.
 */
export function MobileFallback() {
  const view = useSignalStore((s) => s.view);
  const setBooted = useSignalStore((s) => s.setBooted);

  // The 3D scene never mounts here, so mark the experience as "booted"
  useEffect(() => setBooted(true), [setBooted]);

  // Camera navigation → smooth scroll
  useEffect(() => {
    if (view === 'overview') return;
    document.getElementById(`section-${view}`)?.scrollIntoView({ behavior: 'smooth' });
  }, [view]);

  return (
    <div className="mobile-root">
      <header className="mobile-hero">
        <h1 className="mobile-title">
          <GlitchText text="SIGNAL//DESK" />
        </h1>
        <p className="mobile-sub">BACKEND · FULL-STACK · DEVOPS PORTFOLIO · {profile.alias}</p>
        <p className="mobile-note">
          ▸ FULL 3D WORKSTATION AVAILABLE ON DESKTOP — SHOWING FAST MOBILE VERSION
        </p>
        <nav className="mobile-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#section-${s.id}`}>{SCREEN_LABELS[s.id]}</a>
          ))}
        </nav>
      </header>

      <main>
        {SECTIONS.map(({ id, component: Section }) => (
          <section className="mobile-card" id={`section-${id}`} key={id}>
            <div className="mobile-card-bar">
              <span className="mobile-card-dot" /> {SCREEN_LABELS[id]}
            </div>
            <div className="screen-root mobile-screen">
              <Section />
              <div className="screen-scanlines" aria-hidden="true" />
            </div>
          </section>
        ))}
      </main>

      <RecruiterQuickAccess />

      <footer className="mobile-footer">
        SIGNAL//DESK · {new Date().getFullYear()} · {profile.location}
      </footer>
    </div>
  );
}
