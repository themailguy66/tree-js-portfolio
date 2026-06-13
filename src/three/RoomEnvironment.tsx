import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh, MeshBasicMaterial, Points, PointLight } from 'three';
import { useSignalStore } from '../store';

const FLICKER_DURATION_MS = 1400;

/**
 * The room: walls, rainy neon window, server racks, fog, dust, lighting.
 * All procedural — zero external assets.
 */
export function RoomEnvironment({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group>
      <Walls />
      <NeonWindow reducedMotion={reducedMotion} />
      <ServerRack position={[-2.45, 0, -2.3]} reducedMotion={reducedMotion} />
      <ServerRack position={[-2.45, 0, -1.1]} agent reducedMotion={reducedMotion} />
      {!reducedMotion && <Dust />}
      <Lights />
    </group>
  );
}

function Walls() {
  return (
    <>
      {/* Floor */}
      <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#07090d" roughness={0.9} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 2, -3.2]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#0a0d13" roughness={0.95} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-3, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#090c11" roughness={0.95} />
      </mesh>
      <mesh position={[3, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#090c11" roughness={0.95} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 4.2, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#06080c" roughness={1} />
      </mesh>
    </>
  );
}

/** Window on the back-right wall with neon city glow and falling rain */
function NeonWindow({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group position={[1.7, 2.1, -3.19]}>
      {/* Frame */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.7, 1.5, 0.05]} />
        <meshStandardMaterial color="#0b0e13" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* Glass cutout (slightly proud of the frame) */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.5, 1.3]} />
        <meshStandardMaterial color="#091421" roughness={0.1} metalness={0.2} transparent opacity={0.55} />
      </mesh>
      {/* City glow: blue backdrop + neon building strips "outside" */}
      <group position={[0, 0, -0.7]}>
        <mesh>
          <planeGeometry args={[3.2, 2.6]} />
          <meshBasicMaterial color="#0a1a2e" />
        </mesh>
        {/* Building silhouettes */}
        {[
          { x: -0.9, w: 0.5, h: 1.6, c: '#060c16' },
          { x: -0.2, w: 0.4, h: 2.0, c: '#070d18' },
          { x: 0.5, w: 0.55, h: 1.4, c: '#060c16' },
          { x: 1.1, w: 0.4, h: 1.8, c: '#070d18' },
        ].map((b, i) => (
          <mesh key={i} position={[b.x, b.h / 2 - 1.3, 0.05]}>
            <planeGeometry args={[b.w, b.h]} />
            <meshBasicMaterial color={b.c} />
          </mesh>
        ))}
        {/* Neon strips */}
        {[
          { x: -0.9, y: 0.1, w: 0.42, h: 0.03, c: '#36f9d8' },
          { x: -0.2, y: 0.5, w: 0.03, h: 0.9, c: '#ff3df5' },
          { x: 0.5, y: -0.2, w: 0.46, h: 0.025, c: '#ffb347' },
          { x: 1.1, y: 0.3, w: 0.03, h: 0.7, c: '#36f9d8' },
          { x: -0.55, y: -0.5, w: 0.025, h: 0.5, c: '#ff3df5' },
        ].map((s, i) => (
          <mesh key={i} position={[s.x, s.y, 0.07]}>
            <planeGeometry args={[s.w, s.h]} />
            <meshBasicMaterial color={s.c} />
          </mesh>
        ))}
      </group>
      {!reducedMotion && <Rain />}
    </group>
  );
}

/** Cheap rain: a small pool of falling points just outside the glass */
function Rain() {
  const COUNT = 260;
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 2.4;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
      arr[i * 3 + 2] = -0.1 - Math.random() * 0.5;
    }
    return arr;
  }, []);
  const speeds = useMemo(() => {
    const arr = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) arr[i] = 1.6 + Math.random() * 1.8;
    return arr;
  }, []);
  const ref = useRef<Points>(null);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points) return;
    const pos = points.geometry.attributes.position;
    for (let i = 0; i < COUNT; i++) {
      let y = pos.getY(i) - speeds[i] * delta;
      if (y < -1.2) y = 1.2;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#5fc8d8" size={0.014} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

/**
 * Server rack with blinking status LEDs.
 *
 * When `agent` is set, the rack reads as a running background "coding agent":
 * one teal LED breathes like a heartbeat (alive) and one red LED blinks
 * intermittently (task/alert). The rack's volume is implied only by faint
 * rim-light on its monitor-facing and top edges (see `AgentRackEdges`) — the
 * LEDs are the focal point, not any enclosure.
 */
function ServerRack({
  position,
  agent = false,
  reducedMotion = false,
}: {
  position: [number, number, number];
  agent?: boolean;
  reducedMotion?: boolean;
}) {
  const ledRefs = useRef<(Mesh | null)[]>([]);
  const heartbeatRef = useRef<Mesh>(null);
  const alertRef = useRef<Mesh>(null);
  const phases = useMemo(() => Array.from({ length: 12 }, () => Math.random() * 10), []);
  const speeds = useMemo(() => Array.from({ length: 12 }, () => 2 + Math.random() * 6), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Ambient rack-unit LEDs: pseudo-random flicker (held steady when reduced).
    ledRefs.current.forEach((led, i) => {
      if (led) led.visible = reducedMotion ? true : Math.sin(t * speeds[i] + phases[i]) > -0.2;
    });

    if (!agent) return;

    // Heartbeat: slow brightness + scale "breathing".
    const hb = heartbeatRef.current;
    if (hb) {
      const p = reducedMotion ? 1 : 0.5 + 0.5 * Math.sin(t * 1.6);
      (hb.material as MeshBasicMaterial).opacity = 0.45 + 0.55 * p;
      hb.scale.setScalar(0.85 + 0.3 * p);
    }

    // Alert: mostly dark, a brief double-blink roughly every 5.5s.
    const al = alertRef.current;
    if (al) {
      const cycle = t % 5.5;
      al.visible = reducedMotion ? false : cycle < 0.16 || (cycle > 0.3 && cycle < 0.46);
    }
  });

  const ledColors = ['#7df95c', '#36f9d8', '#ffb347', '#ff4444'];

  return (
    <group position={position}>
      {/* Cabinet */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.55, 2.1, 0.7]} />
        <meshStandardMaterial color="#0b0e14" roughness={0.55} metalness={0.6} />
      </mesh>
      {/* Unit faceplates + LEDs */}
      {Array.from({ length: 6 }).map((_, unit) => (
        <group key={unit} position={[0.279, 0.35 + unit * 0.3, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.62, 0.22]} />
            <meshStandardMaterial color="#10141c" roughness={0.5} metalness={0.5} />
          </mesh>
          {[0, 1].map((led) => {
            const idx = unit * 2 + led;
            return (
              <mesh
                key={led}
                ref={(el) => {
                  ledRefs.current[idx] = el;
                }}
                position={[0.002, 0.06, 0.22 - led * 0.06]}
                rotation={[0, Math.PI / 2, 0]}
              >
                <circleGeometry args={[0.012, 6]} />
                <meshBasicMaterial color={ledColors[idx % ledColors.length]} />
              </mesh>
            );
          })}
        </group>
      ))}

      {agent && (
        <>
          <AgentRackEdges />
          <AgentIndicators heartbeatRef={heartbeatRef} alertRef={alertRef} />
        </>
      )}
    </group>
  );
}

/**
 * Implies the rack's volume with rim-light only — no box, fill, or outline.
 * Matches the room's lighting logic (monitors to the right, soft ambient
 * overhead): the monitor-facing front-right vertical edge catches the most
 * light, the top-front edge a touch less, and the wall-side edge stays dark
 * so it dissolves into shadow. Thin `meshBasicMaterial` slivers at low opacity
 * read as caught light rather than drawn lines.
 */
function AgentRackEdges() {
  // Cabinet: [0.55, 2.1, 0.7] centred at y=1.05 → half-extents 0.275 / 1.05 / 0.35.
  return (
    <>
      {/* Right-facing vertical edge (front-right corner, nearest monitor light) */}
      <mesh position={[0.275, 1.05, 0.35]}>
        <boxGeometry args={[0.006, 2.1, 0.006]} />
        <meshBasicMaterial color="#c8bfa8" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      {/* Top-front edge (catches soft ambient ceiling light — a touch dimmer) */}
      <mesh position={[0, 2.1, 0.35]}>
        <boxGeometry args={[0.55, 0.006, 0.006]} />
        <meshBasicMaterial color="#d8d2c4" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </>
  );
}

/**
 * The agent's indicator LEDs — the focal point. A row on the rack face: the
 * teal heartbeat and red alert (both animated by the parent rack) flanking
 * three steady status dots. No enclosure.
 */
function AgentIndicators({
  heartbeatRef,
  alertRef,
}: {
  heartbeatRef: RefObject<Mesh | null>;
  alertRef: RefObject<Mesh | null>;
}) {
  // Three steady "always-on" indicator dots flanked by the heartbeat + alert.
  const indicators: { z: number; c: string }[] = [
    { z: -0.075, c: '#36f9d8' },
    { z: 0, c: '#ffb347' },
    { z: 0.075, c: '#36f9d8' },
  ];

  return (
    // Sitting just proud of the unit faceplate plane (x=0.279).
    <group position={[0.281, 1.5, 0]}>
      {/* Heartbeat LED (teal, breathing) */}
      <mesh ref={heartbeatRef} rotation={[0, Math.PI / 2, 0]} position={[0.003, 0.035, -0.15]}>
        <circleGeometry args={[0.015, 12]} />
        <meshBasicMaterial color="#7df95c" transparent />
      </mesh>

      {/* Steady indicator dots */}
      {indicators.map((d, i) => (
        <mesh key={i} rotation={[0, Math.PI / 2, 0]} position={[0.003, 0.035, d.z]}>
          <circleGeometry args={[0.011, 8]} />
          <meshBasicMaterial color={d.c} />
        </mesh>
      ))}

      {/* Alert LED (red, intermittent blink) */}
      <mesh ref={alertRef} rotation={[0, Math.PI / 2, 0]} position={[0.003, 0.035, 0.15]}>
        <circleGeometry args={[0.013, 10]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
    </group>
  );
}

/** Slow-drifting dust motes lit by the screens */
function Dust() {
  const COUNT = 130;
  const ref = useRef<Group>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 1] = 0.4 + Math.random() * 2.6;
      arr[i * 3 + 2] = -2.5 + Math.random() * 4;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.012;
    ref.current.position.y = Math.sin(t * 0.18) * 0.05;
  });

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8ab8c8" size={0.008} transparent opacity={0.35} sizeAttenuation />
      </points>
    </group>
  );
}

/** Cinematic lighting + the `unlock` flicker easter egg */
function Lights() {
  const flickerAt = useSignalStore((s) => s.flickerAt);
  const refs = useRef<(PointLight | null)[]>([]);
  // [color, position, baseIntensity, distance]
  const lights: [string, [number, number, number], number, number][] = useMemo(
    () => [
      ['#36b8f9', [1.7, 2.1, -2.6], 6, 7], // window / city glow
      ['#ff3df5', [-2.3, 1.6, -1.7], 3.5, 5], // magenta wash from the racks
      ['#ffb347', [0.8, 3.4, 1.2], 2.2, 6], // warm overhead spill
      ['#4dffd5', [0, 1.4, 0.1], 2.8, 3], // screen glow on the operator
    ],
    [],
  );

  useFrame(() => {
    const since = flickerAt ? performance.now() - flickerAt : Infinity;
    const flickering = since < FLICKER_DURATION_MS;
    refs.current.forEach((light, i) => {
      if (!light) return;
      const base = lights[i][2];
      light.intensity = flickering
        ? base * (Math.random() > 0.45 ? 1.6 : 0.08)
        : base;
    });
  });

  return (
    <>
      <ambientLight intensity={0.22} color="#28384a" />
      <hemisphereLight intensity={0.18} color="#1a3a4a" groundColor="#05070b" />
      {lights.map(([color, position, intensity, distance], i) => (
        <pointLight
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          color={color}
          position={position}
          intensity={intensity}
          distance={distance}
          decay={1.6}
        />
      ))}
    </>
  );
}
