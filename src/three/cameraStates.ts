import type { ViewId } from '../store';

export type Vec3 = [number, number, number];

export interface CameraState {
  position: Vec3;
  target: Vec3;
}

/**
 * Predefined first-person camera states for the 3×2 monitor grid.
 * All positions keep the camera on the operator-side of the desk (Z > 0).
 * The aspect-ratio pull-back in CameraController handles narrower viewports.
 */
export const CAMERA_STATES: Record<ViewId, CameraState> = {
  // Full desk — seated view showing all six monitors
  overview: { position: [0, 1.52, 2.15],  target: [0, 1.40, -0.68] },

  // ── Top row ──
  about:    { position: [-0.72, 1.81, 0.06], target: [-0.96, 1.81, -0.64] },
  home:     { position: [0,     1.81, 0.06], target: [0,     1.81, -0.64] },
  skills:   { position: [0.72,  1.81, 0.06], target: [0.96,  1.81, -0.64] },

  // ── Bottom row ── (screen centre sits at Y≈1.17 inside the frame)
  projects: { position: [-0.72, 1.20, 0.08], target: [-0.96, 1.17, -0.72] },
  contact:  { position: [0,     1.20, 0.08], target: [0,     1.17, -0.72] },
  cv:       { position: [0.72,  1.20, 0.08], target: [0.96,  1.17, -0.72] },
};
