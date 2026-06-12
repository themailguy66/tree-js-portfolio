import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { easing } from 'maath';
import { useSignalStore } from '../store';
import { CAMERA_STATES } from './cameraStates';

/**
 * Smoothly interpolates the camera between predefined states and adds
 * subtle first-person head movement driven by the mouse.
 * Reduced-motion mode: near-instant transitions, no parallax.
 */
export function CameraController({ reducedMotion }: { reducedMotion: boolean }) {
  const view = useSignalStore((s) => s.view);
  const booted = useSignalStore((s) => s.booted);

  // Persistent scratch vectors — no per-frame allocation
  const desiredPos = useRef(new Vector3());
  const desiredLook = useRef(new Vector3());
  const currentLook = useRef(new Vector3(...CAMERA_STATES.overview.target));
  // Reusable scratch for aspect pull-back calculation
  const targetScratch = useRef(new Vector3());

  useFrame((state, delta) => {
    const cfg = CAMERA_STATES[view];
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Subtle head sway — stronger at the desk, gentle when reading a screen
    const sway = reducedMotion ? 0 : view === 'overview' ? 0.11 : 0.025;
    const lookSway = reducedMotion ? 0 : view === 'overview' ? 0.22 : 0.05;

    desiredPos.current.set(
      cfg.position[0] + px * sway,
      cfg.position[1] + py * sway * 0.55,
      cfg.position[2],
    );
    desiredLook.current.set(
      cfg.target[0] + px * lookSway,
      cfg.target[1] + py * lookSway * 0.5,
      cfg.target[2],
    );

    // Camera positions are tuned for ~16:9. For narrower viewports back the
    // camera away from the screen target so the panel doesn't get cropped.
    const aspect = state.size.width / state.size.height;
    if (view !== 'overview' && aspect < 1.65) {
      const pullBack = Math.min(1.65 / Math.max(aspect, 0.55), 2.0);
      targetScratch.current.set(...cfg.target);
      desiredPos.current
        .sub(targetScratch.current)
        .multiplyScalar(pullBack)
        .add(targetScratch.current);
    }

    // Pre-boot: hold slightly further back for the fade-in reveal
    if (!booted) desiredPos.current.z += 0.55;

    const smooth = reducedMotion ? 0.04 : 0.55;
    easing.damp3(state.camera.position, desiredPos.current, smooth, delta);
    easing.damp3(currentLook.current, desiredLook.current, smooth, delta);
    state.camera.lookAt(currentLook.current);
  });

  return null;
}
