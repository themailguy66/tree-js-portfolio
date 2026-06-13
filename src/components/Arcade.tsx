import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Pacman } from '../arcade/Pacman';

/**
 * Full-screen SIGNAL//ARCADE overlay — the Pac-Man cabinet the desk tablet
 * opens. Rendered above the whole interface so the game gets the entire
 * viewport. The game (and its global key listener + tick loop) only exists
 * while the overlay is mounted, so it never steals keys from the desk.
 */
export function Arcade() {
  const open = useSignalStore((s) => s.arcadeOpen);
  const origin = useSignalStore((s) => s.arcadeOrigin);
  const setOpen = useSignalStore((s) => s.setArcadeOpen);
  const reducedMotion = usePrefersReducedMotion();

  // Zoom the whole overlay out of the point the tablet was clicked (and back
  // into it on close). Reduced-motion users get a plain cross-fade instead.
  const originStyle =
    typeof window !== 'undefined'
      ? `${origin?.x ?? window.innerWidth / 2}px ${origin?.y ?? window.innerHeight / 2}px`
      : '50% 50%';
  const collapsed = reducedMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.04, filter: 'blur(6px)' };
  const expanded = reducedMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, filter: 'blur(0px)' };

  // Close on Escape — capture so it fires before the global "return to desk"
  // handler, and so Pac-Man's own keydown listener never sees it.
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="arcade-overlay"
          style={{ transformOrigin: originStyle }}
          initial={collapsed}
          animate={expanded}
          exit={collapsed}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="SIGNAL//ARCADE — Pac-Man"
        >
          <div className="arcade-scanlines" aria-hidden="true" />

          {/* Power-on flash sweeping the panel as it expands */}
          {!reducedMotion && (
            <motion.div
              className="arcade-poweron"
              aria-hidden="true"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}

          <motion.div
            className="arcade-cabinet"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.12 }}
          >
            <header className="arcade-header">
              <div>
                <h1 className="glitch arcade-title" data-text="PAC//MAN">
                  PAC<span>//</span>MAN
                </h1>
                <div className="arcade-sub">SIGNAL//ARCADE · CABINET 01</div>
              </div>
              <button className="arcade-btn" onClick={() => setOpen(false)}>
                ⌁ RETURN TO DESK
              </button>
            </header>

            <main className="arcade-panel">
              <span className="arcade-corner arcade-corner-tl" />
              <span className="arcade-corner arcade-corner-tr" />
              <span className="arcade-corner arcade-corner-bl" />
              <span className="arcade-corner arcade-corner-br" />
              <div className="arcade-panel-title">GRID CHASE PROTOCOL // v1.0</div>
              <Pacman />
            </main>

            <footer className="arcade-footer">
              core adapted from{' '}
              <a href="https://github.com/palowski/react-pacman" target="_blank" rel="noreferrer">
                palowski/react-pacman
              </a>{' '}
              (MIT) · reskinned for SIGNAL//DESK
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
