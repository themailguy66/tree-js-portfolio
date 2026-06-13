import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSignalStore } from './store';
import { useIsMobile } from './hooks/useIsMobile';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { BootSequence } from './components/BootSequence';
import { NavigationHUD } from './components/NavigationHUD';
import { RecruiterQuickAccess } from './components/RecruiterQuickAccess';
import { Arcade } from './components/Arcade';
import { MobileFallback } from './components/MobileFallback';

// Lazy-load the heavy Three.js scene so the boot sequence appears instantly
const WorkstationScene = lazy(() => import('./three/WorkstationScene'));

/** Probe WebGL support upfront so unsupported browsers get the card layout */
function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
const HAS_WEBGL = typeof window !== 'undefined' && webglAvailable();

/** If WebGL fails for any reason, fall back to the readable card layout */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <MobileFallback /> : this.props.children;
  }
}

export default function App() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const booted = useSignalStore((s) => s.booted);
  const setView = useSignalStore((s) => s.setView);

  // Escape always returns to the full desk view
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('overview');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setView]);

  // Mobile / small screens / no WebGL: skip the 3D desk entirely
  if (isMobile || !HAS_WEBGL) return <MobileFallback />;

  return (
    <SceneErrorBoundary>
      {/* z-index: 0 creates a stacking context so drei <Html> layers stay under the HUD */}
      <div className="canvas-root" aria-hidden={!booted}>
        <Suspense fallback={null}>
          <WorkstationScene reducedMotion={reducedMotion} />
        </Suspense>
      </div>

      <AnimatePresence>{!booted && <BootSequence key="boot" />}</AnimatePresence>

      {booted && <NavigationHUD />}
      {booted && <RecruiterQuickAccess />}
      {booted && <Arcade />}
    </SceneErrorBoundary>
  );
}
