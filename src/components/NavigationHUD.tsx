import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore, SCREEN_LABELS, type ScreenId } from '../store';

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'cv', label: 'CV' },
  { id: 'contact', label: 'CONTACT' },
];

/** Fixed overlay navigation — always available, keyboard accessible */
export function NavigationHUD() {
  const view = useSignalStore((s) => s.view);
  const setView = useSignalStore((s) => s.setView);

  return (
    <>
      <motion.nav
        className="hud-nav"
        aria-label="Workstation navigation"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <ul className="hud-nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={`hud-nav-btn ${view === item.id ? 'active' : ''}`}
                onClick={() => setView(item.id)}
                aria-current={view === item.id ? 'true' : undefined}
              >
                <span className="hud-nav-marker">{view === item.id ? '▸' : '·'}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hud-hint">ESC — RETURN TO DESK</div>
      </motion.nav>

      {/* Back button, only while focused on a screen */}
      <AnimatePresence>
        {view !== 'overview' && (
          <motion.button
            key="back"
            className="hud-back-btn"
            onClick={() => setView('overview')}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
          >
            ◂ BACK TO WORKSTATION
            <span className="hud-back-sub">{SCREEN_LABELS[view]}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
