import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store';
import { profile } from '../data/profile';
import { projects, featuredProjectIds } from '../data/projects';
import { experience } from '../data/experience';
import { openCV, copyEmail } from '../utils/cv';
import { HUDPanel } from './HUDPanel';

/**
 * Recruiter Quick Access — a clean, ordinary, readable modal for
 * recruiters who don't want to explore the cinematic interface.
 */
export function RecruiterQuickAccess() {
  const open = useSignalStore((s) => s.quickAccessOpen);
  const setOpen = useSignalStore((s) => s.setQuickAccessOpen);
  const [cvError, setCvError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Trap-ish behaviour: close on Escape (before the global handler resets the view)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [open, setOpen]);

  const featured = featuredProjectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <button className="rqa-trigger" onClick={() => setOpen(true)}>
        ⚡ RECRUITER QUICK ACCESS
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="rqa-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Recruiter quick access"
          >
            <motion.div
              className="rqa-modal-wrap"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              {/* Close button lives OUTSIDE the scrolling HUDPanel so it can't be clipped */}
              <button className="rqa-close" onClick={() => setOpen(false)} aria-label="Close modal">
                ✕
              </button>
              <HUDPanel className="rqa-modal" title="RECRUITER QUICK ACCESS — SUMMARY">

                <section className="rqa-section">
                  <h2>{profile.name}</h2>
                  <p className="rqa-role">{profile.role}</p>
                  <p>{profile.summary}</p>
                  <p className="rqa-meta">
                    {profile.location} · Open to: {profile.currentTarget}
                  </p>
                </section>

                <section className="rqa-section">
                  <h3>TOP SKILLS</h3>
                  <div className="rqa-chips">
                    {profile.topSkills.map((s) => (
                      <span className="rqa-chip" key={s}>{s}</span>
                    ))}
                  </div>
                </section>

                <section className="rqa-section">
                  <h3>FEATURED PROJECTS</h3>
                  {featured.map((p) => (
                    <div className="rqa-project" key={p.id}>
                      <strong>{p.name}</strong> <em>— {p.type}</em>
                      <p>{p.description}</p>
                    </div>
                  ))}
                </section>

                <section className="rqa-section">
                  <h3>EXPERIENCE</h3>
                  <ul className="rqa-exp">
                    {experience.map((e) => (
                      <li key={e.id}>
                        <strong>{e.title}</strong> <span>({e.period})</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rqa-section rqa-actions">
                  <button
                    className="rqa-btn"
                    onClick={async () => setCvError(await openCV())}
                  >
                    ⬇ DOWNLOAD CV
                  </button>
                  <button
                    className="rqa-btn"
                    onClick={async () => {
                      setCopied(await copyEmail());
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? '✓ COPIED' : '⧉ COPY EMAIL'}
                  </button>
                  <a className="rqa-btn" href={`mailto:${profile.email}`}>✉ EMAIL LUCAS</a>
                  <a className="rqa-btn" href={profile.github} target="_blank" rel="noreferrer">GITHUB</a>
                  {profile.linkedin && (
                    <a className="rqa-btn" href={profile.linkedin} target="_blank" rel="noreferrer">LINKEDIN</a>
                  )}
                </section>
                {cvError && <p className="rqa-error">{cvError}</p>}
              </HUDPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
