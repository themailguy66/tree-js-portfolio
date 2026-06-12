import { useState, type ReactNode } from 'react';
import { Html } from '@react-three/drei';
import { useSignalStore, type ScreenId } from '../store';
import type { Vec3 } from './cameraStates';

const PX_PER_UNIT = 1000;
const DISTANCE_FACTOR = 400 / PX_PER_UNIT;

export interface MonitorProps {
  id: ScreenId;
  position: Vec3;
  rotation?: Vec3;
  width: number;
  height: number;
  label: string;
  accent?: string;
  /** 'stand' = desk monitor on neck+base, 'arm' = wall/VESA arm, 'tilt' = angled secondary screen */
  mount?: 'stand' | 'arm' | 'tilt';
  children: ReactNode;
}

export function Monitor({
  id,
  position,
  rotation = [0, 0, 0],
  width,
  height,
  label,
  accent = '#36f9d8',
  mount = 'stand',
  children,
}: MonitorProps) {
  const view = useSignalStore((s) => s.view);
  const setView = useSignalStore((s) => s.setView);
  const [hovered, setHovered] = useState(false);

  const focused = view === id;
  const dimmed = view !== 'overview' && !focused;
  const screenState = focused ? 'focused' : hovered ? 'hovered' : dimmed ? 'dimmed' : '';

  // Asymmetric bezel: thicker bottom (where the stand/info strip lives)
  const bevelSide = 0.028;
  const bevelTop  = 0.024;
  const bevelBot  = 0.06;  // thick bottom bezel
  const frameW    = width  + bevelSide * 2;
  const frameH    = height + bevelTop + bevelBot;
  // Screen sits offset upward inside the frame so the bottom bezel is thicker
  const screenOffsetY = (bevelBot - bevelTop) / 2;
  const depth = mount === 'tilt' ? 0.022 : 0.048;

  const emissiveBase   = focused ? 0.18 : hovered ? 0.32 : 0.08;

  return (
    <group position={position} rotation={rotation}>

      {/* ── Main bezel body ──────────────────────────────────── */}
      <mesh position={[0, 0, -depth / 2]}>
        <boxGeometry args={[frameW, frameH, depth]} />
        <meshStandardMaterial
          color="#13171f"
          roughness={0.5}
          metalness={0.65}
          emissive={accent}
          emissiveIntensity={emissiveBase}
        />
      </mesh>

      {/* Inner lip — slight recess around the screen panel */}
      <mesh position={[0, screenOffsetY, -0.002]}>
        <boxGeometry args={[width + 0.006, height + 0.006, 0.008]} />
        <meshStandardMaterial color="#07090e" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Power LED — bottom right of bezel */}
      <mesh position={[frameW / 2 - 0.022, -frameH / 2 + 0.018, 0.001]}>
        <circleGeometry args={[0.005, 8]} />
        <meshBasicMaterial color={focused ? '#4ac94a' : accent} />
      </mesh>

      {/* ── Stand / mounting ─────────────────────────────────── */}
      {mount === 'stand' && <StandGeometry frameW={frameW} frameH={frameH} />}
      {mount === 'arm'   && <ArmGeometry depth={depth} />}
      {mount === 'tilt'  && <TiltFootGeometry frameW={frameW} frameH={frameH} />}

      {/* ── Glass interaction plane ──────────────────────────── */}
      <mesh
        position={[0, screenOffsetY, 0.001]}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!focused) { setHovered(true); document.body.style.cursor = 'pointer'; }
        }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => {
          e.stopPropagation();
          if (!focused) { setHovered(false); document.body.style.cursor = 'auto'; setView(id); }
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#030609"
          roughness={0.25}
          metalness={0.15}
          emissive={accent}
          emissiveIntensity={hovered && !focused ? 0.11 : 0.04}
        />
      </mesh>

      {/* ── HTML screen content ──────────────────────────────── */}
      <Html
        transform
        distanceFactor={DISTANCE_FACTOR}
        position={[0, screenOffsetY, 0.005]}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: focused ? 'auto' : 'none' }}
      >
        <div
          className={`screen-root ${screenState}`}
          style={{
            width:  width  * PX_PER_UNIT,
            height: height * PX_PER_UNIT,
            ['--accent' as string]: accent,
          }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
        >
          {children}
          {hovered && !focused && (
            <div className="screen-hover-label"><span>▸ {label}</span></div>
          )}
          <div className="screen-scanlines" aria-hidden="true" />
        </div>
      </Html>
    </group>
  );
}

/** Slim neck + wide base for desk monitors */
function StandGeometry({ frameW, frameH }: { frameW: number; frameH: number }) {
  return (
    <group position={[0, -frameH / 2 - 0.01, -0.02]}>
      {/* Neck */}
      <mesh position={[0, -0.09, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.04]} />
        <meshStandardMaterial color="#0d1117" roughness={0.45} metalness={0.75} />
      </mesh>
      {/* Base — trapezoidal feel via a wide flat slab */}
      <mesh position={[0, -0.19, 0.05]}>
        <boxGeometry args={[Math.min(frameW * 0.65, 0.42), 0.016, 0.22]} />
        <meshStandardMaterial color="#0c1016" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Base anti-slip strip */}
      <mesh position={[0, -0.2, 0.05]}>
        <boxGeometry args={[Math.min(frameW * 0.6, 0.38), 0.004, 0.18]} />
        <meshStandardMaterial color="#090c12" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
}

/** Wall/VESA arm bracket for the upper ultrawide */
function ArmGeometry({ depth }: { depth: number }) {
  return (
    <group position={[0, 0, -(depth / 2 + 0.08)]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 8]} />
        <meshStandardMaterial color="#0d1117" roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  );
}

/** Thin wedge foot for angled secondary screens */
function TiltFootGeometry({ frameW, frameH }: { frameW: number; frameH: number }) {
  return (
    <group position={[0, -frameH / 2 - 0.005, -0.015]}>
      <mesh position={[0, -0.01, 0.02]}>
        <boxGeometry args={[frameW * 0.55, 0.012, 0.08]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  );
}
