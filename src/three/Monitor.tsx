import { useState, type ReactNode } from 'react';
import { CanvasTexture } from 'three';
import { Html } from '@react-three/drei';
import { useSignalStore, type ScreenId } from '../store';
import type { Vec3 } from './cameraStates';

const PX_PER_UNIT = 1000;
const DISTANCE_FACTOR = 400 / PX_PER_UNIT;

/**
 * Extra clickable margin (world units) around each monitor frame.
 * Horizontal gap between adjacent frames is ~0.084 and the vertical row gap
 * is ~0.056, so 0.04 per side closes nearly all dead space between monitors
 * without meaningfully overlapping neighbours.
 */
const HIT_PAD = 0.04;

/**
 * Shared bezel gradient — slightly lighter at the top (catching room light)
 * fading to darker at the bottom, so the plastic doesn't read as a flat fill.
 * One texture instance reused by all six monitors.
 */
let bezelGradient: CanvasTexture | null = null;
function getBezelGradient() {
  if (!bezelGradient) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 64);
    grad.addColorStop(0, '#262630');
    grad.addColorStop(1, '#141418');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1, 64);
    bezelGradient = new CanvasTexture(canvas);
  }
  return bezelGradient;
}

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

  return (
    <group position={position} rotation={rotation}>

      {/* ── Main bezel body ──────────────────────────────────────
          Unified matte dark plastic across all six monitors — no accent
          tint on the frame itself. Colour variation comes from the screen
          content, its light bleed, and the room lighting. */}
      <mesh position={[0, 0, -depth / 2]}>
        <boxGeometry args={[frameW, frameH, depth]} />
        <meshStandardMaterial
          map={getBezelGradient()}
          color="#ffffff"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Top edge sliver — catches the ambient room light from above */}
      <mesh position={[0, frameH / 2 - 0.003, -depth / 2]}>
        <boxGeometry args={[frameW + 0.001, 0.006, depth + 0.001]} />
        <meshStandardMaterial color="#2e2e36" roughness={0.6} metalness={0.25} />
      </mesh>

      {/* Inner lip — screen light bleeding into the bezel recess.
          Faint accent emissive: the one place the screen colour touches
          the physical frame. */}
      <mesh position={[0, screenOffsetY, -0.002]}>
        <boxGeometry args={[width + 0.006, height + 0.006, 0.008]} />
        <meshStandardMaterial
          color="#07090e"
          roughness={0.7}
          metalness={0.3}
          emissive={accent}
          emissiveIntensity={hovered && !focused ? 0.22 : 0.09}
        />
      </mesh>

      {/* Power LED — neutral when idle, green when active */}
      <mesh position={[frameW / 2 - 0.022, -frameH / 2 + 0.018, 0.001]}>
        <circleGeometry args={[0.005, 8]} />
        <meshBasicMaterial color={focused ? '#4ac94a' : '#3c4452'} />
      </mesh>

      {/* ── Stand / mounting ─────────────────────────────────── */}
      {mount === 'stand' && <StandGeometry frameW={frameW} frameH={frameH} />}
      {mount === 'arm'   && <ArmGeometry depth={depth} />}
      {mount === 'tilt'  && <TiltFootGeometry frameW={frameW} frameH={frameH} />}

      {/* ── Glass panel (visual only — interaction lives on the hit
             plane below so the whole frame is clickable) ─────────── */}
      <mesh position={[0, screenOffsetY, 0.001]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#030609"
          roughness={0.25}
          metalness={0.15}
          emissive={accent}
          emissiveIntensity={hovered && !focused ? 0.11 : 0.04}
        />
      </mesh>

      {/* ── Invisible raycast hit plane ──────────────────────────
          Covers the full frame (screen + bezel) plus HIT_PAD of the
          inter-monitor gap on every side, so bezel clicks select the
          monitor instead of falling through to onPointerMissed and
          near-misses between monitors snap to the nearest one.
          Opacity-0 material still intersects the raycaster but draws
          nothing. */}
      <mesh
        position={[0, 0, 0.002]}
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
        <planeGeometry args={[frameW + HIT_PAD * 2, frameH + HIT_PAD * 2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ── HTML screen content ──────────────────────────────── */}
      <Html
        transform
        distanceFactor={DISTANCE_FACTOR}
        position={[0, screenOffsetY, 0.005]}
        zIndexRange={[10, 0]}
        /* pointerEvents prop controls drei's transform-wrapper div. It must
           be 'none': the wrapper otherwise swallows clicks meant for the
           canvas AND corrupts R3F's raycast coords (R3F reads offsetX/Y,
           which become wrapper-local instead of canvas-local). The content
           div below re-enables pointer events for itself when focused —
           an explicit pointer-events overrides a none parent. */
        pointerEvents="none"
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

/**
 * Slim neck + flat base for desk monitors.
 * Total drop below the frame bottom is 0.108 — with desk top at Y=0.74 and
 * frameH=0.604, a monitor centre of Y=1.15 puts the base flush on the desk.
 */
function StandGeometry({ frameW, frameH }: { frameW: number; frameH: number }) {
  return (
    <group position={[0, -frameH / 2, -0.02]}>
      {/* Neck — spans frame bottom (0.002 overlap) down to the base top */}
      <mesh position={[0, -0.048, 0]}>
        <boxGeometry args={[0.05, 0.1, 0.028]} />
        <meshStandardMaterial color="#0d1117" roughness={0.45} metalness={0.75} />
      </mesh>
      {/* Base — wider than the neck, foreshortened slab on the desk plane */}
      <mesh position={[0, -0.101, 0.05]}>
        <boxGeometry args={[Math.min(frameW * 0.55, 0.36), 0.014, 0.2]} />
        <meshStandardMaterial color="#0c1016" roughness={0.5} metalness={0.7} />
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
