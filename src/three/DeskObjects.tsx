import { useLayoutEffect, useMemo, useRef } from 'react';
import { CatmullRomCurve3, Matrix4, Vector3, type InstancedMesh } from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';

/** The desk itself + keyboard, mouse, mug, cables, sticky note, LED strip */
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

/** Procedural keyboard: base slab + instanced keycaps */
function Keyboard() {
  const keysRef = useRef<InstancedMesh>(null);
  const layout = useMemo(() => {
    const mats: Matrix4[] = [];
    const m = new Matrix4();
    // 4 rows x 14 keys + space row
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 14; col++) {
        m.makeTranslation(-0.227 + col * 0.035, 0.012, -0.052 + row * 0.035);
        mats.push(m.clone());
      }
    }
    m.makeScale(5, 1, 1);
    m.setPosition(0, 0.012, 0.088);
    mats.push(m.clone()); // spacebar
    return mats;
  }, []);

  useLayoutEffect(() => {
    const mesh = keysRef.current;
    if (!mesh) return;
    layout.forEach((mat, i) => mesh.setMatrixAt(i, mat));
    mesh.instanceMatrix.needsUpdate = true;
  }, [layout]);

  return (
    <group position={[0, 0.755, 0.18]} rotation={[0, 0.02, 0]}>
      <mesh>
        <boxGeometry args={[0.54, 0.022, 0.21]} />
        <meshStandardMaterial color="#0d1016" roughness={0.6} metalness={0.4} />
      </mesh>
      <instancedMesh ref={keysRef} args={[undefined, undefined, layout.length]}>
        <boxGeometry args={[0.028, 0.01, 0.028]} />
        <meshStandardMaterial
          color="#161b24"
          roughness={0.5}
          emissive="#1de9b6"
          emissiveIntensity={0.12}
        />
      </instancedMesh>
    </group>
  );
}

function Mouse() {
  return (
    <group position={[0.42, 0.762, 0.22]}>
      <mesh scale={[0.035, 0.018, 0.055]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color="#10141b" roughness={0.45} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.012, -0.02]}>
        <boxGeometry args={[0.005, 0.004, 0.02]} />
        <meshBasicMaterial color="#ff3df5" />
      </mesh>
    </group>
  );
}

function Mug() {
  return (
    <group position={[-0.55, 0.795, 0.28]}>
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
    <mesh position={[-0.32, 0.752, 0.3]} rotation={[-Math.PI / 2, 0, 0.35]}>
      <planeGeometry args={[0.07, 0.07]} />
      <meshStandardMaterial color="#8a7a2c" roughness={0.9} />
    </mesh>
  );
}
