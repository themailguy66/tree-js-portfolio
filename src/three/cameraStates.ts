import type { ViewId } from '../store';

export type Vec3 = [number, number, number];

export interface CameraState {
  position: Vec3;
  target: Vec3;
}

/**
 * Predefined first-person camera states.
 * All positions tuned so the selected monitor fills roughly 70–80% of the
 * viewport at 16:9 — the aspect-ratio pull-back in CameraController handles
 * narrower windows automatically.
 */
export const CAMERA_STATES: Record<ViewId, CameraState> = {
  // Full-desk seated view — everything visible, no overflow
  overview: { position: [0, 1.52, 1.65], target: [0, 1.22, -0.58] },

  // Centre terminal — look straight at it, pull back slightly
  home:     { position: [0, 1.32, 0.05],      target: [0, 1.32, -0.62] },

  // Side monitors — camera shifts to face the angled monitor
  about:    { position: [-0.78, 1.28, 0.06],  target: [-1.08, 1.28, -0.52] },
  skills:   { position: [0.78, 1.28, 0.06],   target: [1.08, 1.28, -0.52] },

  // Upper ultrawide
  projects: { position: [0, 1.90, 0.12],      target: [0, 2.0, -0.74] },

  // Lower secondary screens
  cv:       { position: [0.52, 1.10, 0.32],   target: [0.64, 0.96, -0.44] },
  contact:  { position: [-0.52, 1.10, 0.32],  target: [-0.64, 0.96, -0.44] },
};
