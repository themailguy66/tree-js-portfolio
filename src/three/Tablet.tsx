import { useState, type ReactNode } from 'react';
import { Html } from '@react-three/drei';
import { useSignalStore } from '../store';
import type { Vec3 } from './cameraStates';

/* Mirror of Monitor's Html scaling so the tablet UI renders at the same DPI
   as the monitor screens. Kept in sync with Monitor.tsx. */
const PX_PER_UNIT = 1000;
const DISTANCE_FACTOR = 400 / PX_PER_UNIT;
const HIT_PAD = 0.04;

export interface TabletProps {
  position: Vec3;
  rotation?: Vec3;
  /** Glass (screen) dimensions in world units — the bezel is added around it */
  width: number;
  height: number;
  label: string;
  accent?: string;
  children: ReactNode;
}

/**
 * A slim tablet lying flat on the desk, screen facing up (the caller supplies
 * the −90° rotation). Unlike a Monitor it isn't a camera focus target —
 * clicking it launches the full-screen SIGNAL//ARCADE overlay. The glass just
 * shows an attract screen.
 */
export function Tablet({
  position,
  rotation = [0, 0, 0],
  width,
  height,
  label,
  accent = '#ffb347',
  children,
}: TabletProps) {
  const view = useSignalStore((s) => s.view);
  const setArcadeOpen = useSignalStore((s) => s.setArcadeOpen);
  const [hovered, setHovered] = useState(false);

  // Dim along with the monitors when the operator is focused on a screen
  const dimmed = view !== 'overview';
  const screenState = hovered ? 'hovered' : dimmed ? 'dimmed' : '';

  const bezel = 0.02; // uniform slim bezel all round
  const frameW = width + bezel * 2;
  const frameH = height + bezel * 2;
  const depth = 0.016; // thin slab

  return (
    <group position={position} rotation={rotation}>
      {/* Unibody slab — dark anodised aluminium */}
      <mesh position={[0, 0, -depth / 2]}>
        <boxGeometry args={[frameW, frameH, depth]} />
        <meshStandardMaterial color="#15171c" roughness={0.42} metalness={0.72} />
      </mesh>

      {/* Front-camera pinhole, top-centre */}
      <mesh position={[0, frameH / 2 - 0.009, 0.0015]}>
        <circleGeometry args={[0.0028, 12]} />
        <meshBasicMaterial color="#05070a" />
      </mesh>

      {/* Inner lip — screen light bleeding into the bezel recess */}
      <mesh position={[0, 0, -0.001]}>
        <boxGeometry args={[width + 0.005, height + 0.005, 0.006]} />
        <meshStandardMaterial
          color="#07090e"
          roughness={0.6}
          metalness={0.3}
          emissive={accent}
          emissiveIntensity={hovered ? 0.25 : 0.1}
        />
      </mesh>

      {/* Glass panel (visual only — interaction lives on the hit plane) */}
      <mesh position={[0, 0, 0.0015]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#030609"
          roughness={0.22}
          metalness={0.15}
          emissive={accent}
          emissiveIntensity={hovered ? 0.12 : 0.04}
        />
      </mesh>

      {/* Invisible raycast hit plane — full slab + padding, like the monitors */}
      <mesh
        position={[0, 0, 0.003]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
          // Launch the overlay from the click point so it zooms out of the tablet
          setArcadeOpen(true, { x: e.clientX, y: e.clientY });
        }}
      >
        <planeGeometry args={[frameW + HIT_PAD * 2, frameH + HIT_PAD * 2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* HTML attract screen — non-interactive; the hit plane handles clicks */}
      <Html
        transform
        distanceFactor={DISTANCE_FACTOR}
        position={[0, 0, 0.006]}
        zIndexRange={[10, 0]}
        pointerEvents="none"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`screen-root ${screenState}`}
          style={{
            width: width * PX_PER_UNIT,
            height: height * PX_PER_UNIT,
            ['--accent' as string]: accent,
          }}
        >
          {children}
          {hovered && (
            <div className="screen-hover-label"><span>▸ {label}</span></div>
          )}
          <div className="screen-scanlines" aria-hidden="true" />
        </div>
      </Html>
    </group>
  );
}
