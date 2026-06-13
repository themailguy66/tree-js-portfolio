import { create } from 'zustand';

/** Every focusable screen in the workstation */
export type ScreenId = 'home' | 'about' | 'skills' | 'projects' | 'cv' | 'contact';

/** Camera / navigation state: the full desk, or a focused screen */
export type ViewId = 'overview' | ScreenId;

interface SignalState {
  /** Current camera focus */
  view: ViewId;
  /** Boot sequence finished */
  booted: boolean;
  /** `unlock` easter egg has been triggered */
  unlocked: boolean;
  /** Timestamp (ms) of the last light-flicker trigger, 0 = never */
  flickerAt: number;
  /** Recruiter Quick Access modal open */
  quickAccessOpen: boolean;
  /** Full-screen SIGNAL//ARCADE (Pac-Man) overlay open */
  arcadeOpen: boolean;
  /** Viewport point the arcade was launched from (the tablet), for the
   *  zoom-out/zoom-in overlay transition. Null until first opened. */
  arcadeOrigin: { x: number; y: number } | null;

  setView: (view: ViewId) => void;
  setBooted: (booted: boolean) => void;
  triggerUnlock: () => void;
  setQuickAccessOpen: (open: boolean) => void;
  setArcadeOpen: (open: boolean, origin?: { x: number; y: number }) => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  view: 'overview',
  booted: false,
  unlocked: false,
  flickerAt: 0,
  quickAccessOpen: false,
  arcadeOpen: false,
  arcadeOrigin: null,

  setView: (view) => set({ view }),
  setBooted: (booted) => set({ booted }),
  triggerUnlock: () => set({ unlocked: true, flickerAt: performance.now() }),
  setQuickAccessOpen: (quickAccessOpen) => set({ quickAccessOpen }),
  // Keep the last origin when closing so the overlay collapses back into the tablet
  setArcadeOpen: (arcadeOpen, origin) =>
    set(origin ? { arcadeOpen, arcadeOrigin: origin } : { arcadeOpen }),
}));

// Expose the store for debugging in dev builds only
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__SIG_STORE__ = useSignalStore;
}

export const SCREEN_LABELS: Record<ScreenId, string> = {
  home: 'MAIN TERMINAL',
  about: 'OPERATOR PROFILE',
  skills: 'SKILL MATRIX',
  projects: 'PROJECT ARCHIVE',
  cv: 'CV DOSSIER',
  contact: 'CONTACT UPLINK',
};
