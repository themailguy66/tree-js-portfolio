import { useLayoutEffect, useMemo, useRef } from 'react';
import { CatmullRomCurve3, Matrix4, Vector3, type InstancedMesh } from 'three';
import { ContactShadows, Html, MeshReflectorMaterial } from '@react-three/drei';

/** The desk itself + keyboard, mouse, mug, cables, sticky note, LED strip, nameplate */
export function DeskObjects() {
  return (
    <group>
      <DeskTop />
      <DeskLegs />
      <Keyboard />
      <Mouse />
      <Mug />
      <Cables />
      <StickyNote />
      <DeskNameplate />
      {/* Soft contact shadows grounding everything on the desk surface
          (keyboard, mouse, mug, nameplate, monitor stands). Static scene
          contents — render once. */}
      <ContactShadows
        position={[0, 0.7405, -0.15]}
        scale={[3.8, 1.5]}
        far={0.5}
        blur={2.2}
        opacity={0.6}
        resolution={512}
        frames={1}
      />
      {/* Under-desk LED strip */}
      <mesh position={[0, 0.69, 0.5]}>
        <boxGeometry args={[3.2, 0.012, 0.012]} />
        <meshBasicMaterial color="#1de9b6" />
      </mesh>
    </group>
  );
}

function DeskTop() {
  return (
    <mesh position={[0, 0.74, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.8, 1.5]} />
      {/* Subtle real reflections of monitors / neon on the desk surface */}
      <MeshReflectorMaterial
        resolution={512}
        mirror={0.45}
        blur={[300, 80]}
        mixBlur={0.9}
        mixStrength={1.6}
        roughness={0.8}
        depthScale={0.3}
        minDepthThreshold={0.6}
        color="#0a0d12"
        metalness={0.4}
      />
    </mesh>
  );
}

function DeskLegs() {
  return (
    <>
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} position={[x, 0.37, -0.15]}>
          <boxGeometry args={[0.06, 0.74, 1.3]} />
          <meshStandardMaterial color="#0b0e13" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}
      {/* Desk front edge trim */}
      <mesh position={[0, 0.725, 0.6]}>
        <boxGeometry args={[3.8, 0.035, 0.02]} />
        <meshStandardMaterial color="#0b0e13" roughness={0.6} metalness={0.5} />
      </mesh>
    </>
  );
}

/**
 * Procedural keyboard: dark chassis with recessed instanced keycaps.
 * Realistic row layout (1u alphas, wide tab/caps/shift/enter, 6.25u spacebar)
 * with visible gaps between caps. The glow comes from a dim under-key plate
 * peeking through the gaps — the caps themselves are unlit dark plastic.
 */
function Keyboard() {
  const keysRef = useRef<InstancedMesh>(null);
  const layout = useMemo(() => {
    // Row layouts in key-units, back row (function row) → front row (space row)
    const rows: number[][] = [
      Array(14).fill(1),                                  // Esc + function row
      [...Array(13).fill(1), 2],                          // number row + backspace
      [1.5, ...Array(12).fill(1), 1.5],                   // tab row
      [1.75, ...Array(11).fill(1), 2.25],                 // home row + enter
      [2.25, ...Array(10).fill(1), 2.75],                 // shift row
      [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],   // mods + spacebar
    ];
    const U = 0.034;   // 1u key pitch
    const GAP = 0.005; // visible gap between caps
    const mats: Matrix4[] = [];
    const m = new Matrix4();
    rows.forEach((row, r) => {
      const rowUnits = row.reduce((a, b) => a + b, 0);
      let cursor = (-rowUnits * U) / 2;
      const z = (-(rows.length - 1) * U) / 2 + r * U;
      row.forEach((w) => {
        m.makeScale(w * U - GAP, 0.012, U - GAP);
        m.setPosition(cursor + (w * U) / 2, 0.016, z);
        mats.push(m.clone());
        cursor += w * U;
      });
    });
    return mats;
  }, []);

  useLayoutEffect(() => {
    const mesh = keysRef.current;
    if (!mesh) return;
    layout.forEach((mat, i) => mesh.setMatrixAt(i, mat));
    mesh.instanceMatrix.needsUpdate = true;
  }, [layout]);

  return (
    <group position={[0, 0.752, 0.18]} rotation={[0, 0.02, 0]}>
      {/* Chassis — plastic shell the keys sit recessed inside */}
      <mesh>
        <boxGeometry args={[0.56, 0.024, 0.25]} />
        <meshStandardMaterial color="#0a0d12" roughness={0.6} metalness={0.35} />
      </mesh>
      {/* Dim under-key glow plate — visible only through the cap gaps */}
      <mesh position={[0, 0.0125, 0]}>
        <boxGeometry args={[0.52, 0.0015, 0.212]} />
        <meshBasicMaterial color="#0b4f43" />
      </mesh>
      {/* Keycaps — unit cube scaled per-instance to each key's size */}
      <instancedMesh ref={keysRef} args={[undefined, undefined, layout.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#151a22" roughness={0.55} metalness={0.2} />
      </instancedMesh>
    </group>
  );
}

/**
 * Mouse: elongated low ellipsoid sunk slightly below the desk plane so the
 * underside reads flat, with scroll wheel, click seam and a cable arcing
 * toward the back of the desk. Group origin sits on the desk surface.
 */
function Mouse() {
  const cable = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(0, 0.01, -0.045),
        new Vector3(0.08, 0.006, -0.25),
        new Vector3(0.06, 0.006, -0.55),
        new Vector3(-0.12, 0.012, -0.78),
      ]),
    [],
  );

  return (
    <group position={[0.42, 0.74, 0.22]} rotation={[0, -0.15, 0]}>
      {/* Body — wider/taller toward the palm (+Z), tapering to the front */}
      <mesh position={[0, 0.011, 0]} scale={[0.027, 0.016, 0.05]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#10141b" roughness={0.45} metalness={0.3} />
      </mesh>
      {/* Scroll wheel — axis along X, poking out of the top front */}
      <mesh position={[0, 0.023, -0.018]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.007, 0.007, 0.005, 12]} />
        <meshStandardMaterial color="#06080c" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Left/right click seam — tilted to follow the shell curving down
          toward the nose */}
      <mesh position={[0, 0.0225, -0.032]} rotation={[-0.28, 0, 0]}>
        <boxGeometry args={[0.0012, 0.003, 0.024]} />
        <meshStandardMaterial color="#05070a" roughness={0.9} />
      </mesh>
      {/* Cable — exits the front, arcs toward the back of the desk */}
      <mesh>
        <tubeGeometry args={[cable, 24, 0.004, 6, false]} />
        <meshStandardMaterial color="#0c0f14" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Mug() {
  // Body height 0.1, centred — Y=0.79 puts the bottom flush on the desk (0.74)
  return (
    <group position={[-0.55, 0.79, 0.28]}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.036, 0.1, 14]} />
        <meshStandardMaterial color="#1a212d" roughness={0.4} />
      </mesh>
      <mesh position={[0.05, 0.005, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.026, 0.007, 6, 12]} />
        <meshStandardMaterial color="#1a212d" roughness={0.4} />
      </mesh>
      {/* Cold coffee */}
      <mesh position={[0, 0.044, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.034, 14]} />
        <meshStandardMaterial color="#1f1208" roughness={0.2} />
      </mesh>
    </group>
  );
}

/** Loose cables snaking across the back of the desk */
function Cables() {
  const curves = useMemo(
    () => [
      new CatmullRomCurve3([
        new Vector3(-0.05, 0.76, -0.55),
        new Vector3(-0.3, 0.755, -0.7),
        new Vector3(-0.8, 0.75, -0.72),
        new Vector3(-1.16, 0.78, -0.6),
      ]),
      new CatmullRomCurve3([
        new Vector3(0.05, 0.76, -0.58),
        new Vector3(0.5, 0.752, -0.74),
        new Vector3(1.05, 0.75, -0.66),
        new Vector3(1.2, 0.8, -0.55),
      ]),
      new CatmullRomCurve3([
        new Vector3(0.2, 0.76, 0.12),
        new Vector3(0.35, 0.752, -0.1),
        new Vector3(0.3, 0.75, -0.45),
        new Vector3(0.05, 0.76, -0.6),
      ]),
    ],
    [],
  );

  return (
    <>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 24, 0.008, 6, false]} />
          <meshStandardMaterial color={i === 1 ? '#131820' : '#0c0f14'} roughness={0.7} />
        </mesh>
      ))}
    </>
  );
}

function StickyNote() {
  return (
    <mesh position={[-0.32, 0.7415, 0.3]} rotation={[-Math.PI / 2, 0, 0.35]}>
      <planeGeometry args={[0.07, 0.07]} />
      <meshStandardMaterial color="#8a7a2c" roughness={0.9} />
    </mesh>
  );
}

/**
 * SIGNAL//DESK branded nameplate — a metal placard lying flat on the desk
 * surface, spun diagonally toward the desk vanishing point.
 * Euler order XYZ applies Z first (spin in the plate's own plane), then
 * X=-90° lays it flat — so it shares the desk plane's exact perspective.
 */
function DeskNameplate() {
  return (
    <group
      position={[-0.88, 0.746, 0.38]}
      rotation={[-Math.PI / 2, 0, 0.52]}
    >
      {/* Metal backing plate */}
      <mesh position={[0, 0, -0.002]}>
        <boxGeometry args={[0.26, 0.088, 0.004]} />
        <meshStandardMaterial
          color="#131a24"
          roughness={0.28}
          metalness={0.88}
          emissive="#36f9d8"
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Accent stripe — left edge */}
      <mesh position={[-0.118, 0, 0.001]}>
        <boxGeometry args={[0.006, 0.072, 0.002]} />
        <meshBasicMaterial color="#36f9d8" />
      </mesh>

      {/* HTML label — world-transform so it lies flat with the plaque */}
      <Html
        transform
        distanceFactor={0.22}
        position={[0, 0, 0.004]}
        style={{ pointerEvents: 'none' }}
      >
        <div className="desk-nameplate">
          <div className="desk-nameplate-title">SIGNAL<span>//</span>DESK</div>
          <div className="desk-nameplate-sub">OPERATOR//07 · UPLINK STABLE</div>
        </div>
      </Html>
    </group>
  );
}
