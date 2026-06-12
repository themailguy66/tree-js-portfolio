import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { profile } from '../data/profile';

const BOOT_LINES = [
  'SIGNAL INTERCEPTED',
  'WORKSTATION POWER RESTORED',
  'LOADING DEVELOPER DOSSIER',
  `OPERATOR: ${profile.alias}`,
  'AUTHENTICATING RECRUITER ACCESS',
  'ACCESS GRANTED',
];

const LINE_DELAY_MS = 620;

/** Full-screen terminal boot animation shown before the 3D desk reveals */
export function BootSequence() {
  const setBooted = useSignalStore((s) => s.setBooted);
  const reducedMotion = usePrefersReducedMotion();
  const [visibleLines, setVisibleLines] = useState(reducedMotion ? BOOT_LINES.length : 0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      const t = setTimeout(() => setBooted(true), 400);
      return () => clearTimeout(t);
    }
    const interval = setInterval(() => {
      setVisibleLines((n) => {
        if (n >= BOOT_LINES.length) {
          clearInterval(interval);
          if (!doneRef.current) {
            doneRef.current = true;
            setTimeout(() => setBooted(true), 700);
          }
          return n;
        }
        return n + 1;
      });
    }, LINE_DELAY_MS);
    return () => clearInterval(interval);
  }, [reducedMotion, setBooted]);

  return (
    <motion.div
      className="boot-overlay"
      role="status"
      aria-label="System booting"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reducedMotion ? 0.1 : 1.4, ease: 'easeInOut' } }}
    >
      <div className="boot-terminal">
        <div className="boot-header">
          <span className="boot-dot" /> SIGNAL//DESK :: BOOTLOADER v2.7
        </div>
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div className="boot-line" key={i}>
            <span className="boot-prompt">&gt;</span> {line}
            {line === 'ACCESS GRANTED' && <span className="boot-ok"> [OK]</span>}
          </div>
        ))}
        <div className="boot-cursor">█</div>
        <div className="boot-progress">
          <div
            className="boot-progress-fill"
            style={{ width: `${(visibleLines / BOOT_LINES.length) * 100}%` }}
          />
        </div>
      </div>

      <button className="boot-skip" onClick={() => setBooted(true)}>
        SKIP INTRO ▸
      </button>
    </motion.div>
  );
}
