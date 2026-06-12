import { useEffect, useRef, useState } from 'react';
import { useSignalStore } from '../store';
import { profile } from '../data/profile';
import { runCommand } from '../data/commands';
import { TerminalInput } from '../components/TerminalInput';
import { GlitchText } from '../components/GlitchText';

const INITIAL_LINES = [
  '> PROFILE READY: Lucas Boglione — backend/full-stack developer',
  "> type 'help' or use Recruiter Quick Access",
];

/** Centre monitor — hero / identity / terminal */
export function MainTerminalScreen() {
  const setView = useSignalStore((s) => s.setView);
  const setQuickAccessOpen = useSignalStore((s) => s.setQuickAccessOpen);
  const triggerUnlock = useSignalStore((s) => s.triggerUnlock);
  const unlocked = useSignalStore((s) => s.unlocked);
  const view = useSignalStore((s) => s.view);
  const [lines, setLines] = useState<string[]>(INITIAL_LINES);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const handleCommand = (input: string) => {
    const result = runCommand(input, { unlocked });
    setLines((prev) => {
      const next = result.clear ? [] : [...prev, `$ ${input}`, ...result.output];
      return next.slice(-60); // cap scrollback
    });
    if (result.unlock) triggerUnlock();
    if (result.nav) {
      // Small delay so the user sees the routing line before the camera moves
      setTimeout(() => setView(result.nav!), 450);
    }
  };

  return (
    <div className="screen-body home-screen">
      <header className="home-hero">
        <h1 className="home-title">
          <GlitchText text="SIGNAL//DESK" />
        </h1>
        <p className="home-subtitle">BACKEND · FULL-STACK · DEVOPS PORTFOLIO</p>
        <p className="home-name">{profile.name}</p>
        <p className="home-role">{profile.role}</p>
        <p className="home-tagline">“{profile.tagline}”</p>
      </header>

      <div className="home-buttons">
        <button className="screen-btn" onClick={() => setView('projects')}>VIEW PROJECTS</button>
        <button className="screen-btn" onClick={() => setView('skills')}>VIEW SKILLS</button>
        <button className="screen-btn" onClick={() => setView('cv')}>DOWNLOAD CV</button>
        <button className="screen-btn" onClick={() => setView('contact')}>CONTACT</button>
        <button className="screen-btn screen-btn-accent" onClick={() => setQuickAccessOpen(true)}>
          RECRUITER QUICK ACCESS
        </button>
      </div>

      <div className="home-terminal">
        <div className="home-terminal-output" ref={scrollRef} aria-live="polite">
          {lines.map((line, i) => (
            <div className="terminal-line" key={i}>{line}</div>
          ))}
        </div>
        <TerminalInput onCommand={handleCommand} autoFocus={view === 'home'} />
      </div>
    </div>
  );
}
