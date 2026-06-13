import { Canvas } from '@react-three/fiber';
import { useSignalStore } from '../store';
import { CameraController } from './CameraController';
import { RoomEnvironment } from './RoomEnvironment';
import { DeskObjects } from './DeskObjects';
import { Monitor } from './Monitor';
import { Tablet } from './Tablet';
import { MainTerminalScreen } from '../screens/MainTerminalScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { SkillsScreen } from '../screens/SkillsScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { CVScreen } from '../screens/CVScreen';
import { ContactScreen } from '../screens/ContactScreen';
import { ArcadeScreen } from '../screens/ArcadeScreen';

/**
 * Clean 3×2 monitor grid — all six screens identical dimensions (0.82 × 0.52).
 *
 *   TOP ROW    About  │  Home  │  Skills     Y=1.81  Z=−0.64 (VESA arms)
 *   BOT ROW  Projects │Contact │    CV       Y=1.15  Z=−0.72 (desk stands)
 *
 * Outer columns have mild inward rotateY (±0.28 rad ≈ ±16°) so they feel
 * physically placed.  The bottom row sits on neck+base stands whose feet
 * rest flush on the desk surface (desk top Y=0.74; frame half-height 0.302
 * + stand drop 0.108 ⇒ monitor centre Y=1.15).  Top row clears the bottom
 * row's top edge (1.452) by ~0.06.
 */
export default function WorkstationScene({ reducedMotion }: { reducedMotion: boolean }) {
  const setView = useSignalStore((s) => s.setView);

  const W = 0.82;
  const H = 0.52;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 55, near: 0.05, far: 30, position: [0, 1.48, 2.2] }}
      onPointerMissed={() => setView('overview')}
    >
      <color attach="background" args={['#05070b']} />
      <fog attach="fog" args={['#05070b', 4.5, 13]} />

      <CameraController reducedMotion={reducedMotion} />
      <RoomEnvironment reducedMotion={reducedMotion} />
      <DeskObjects />

      {/* ── TOP ROW ──────────────────────────────────────────── */}

      <Monitor id="about"
        position={[-0.96, 1.81, -0.64]} rotation={[0, 0.28, 0]}
        width={W} height={H}
        label="OPEN OPERATOR PROFILE" accent="#ffb347" mount="arm"
      ><AboutScreen /></Monitor>

      <Monitor id="home"
        position={[0, 1.81, -0.64]}
        width={W} height={H}
        label="OPEN MAIN TERMINAL" accent="#36f9d8" mount="arm"
      ><MainTerminalScreen /></Monitor>

      <Monitor id="skills"
        position={[0.96, 1.81, -0.64]} rotation={[0, -0.28, 0]}
        width={W} height={H}
        label="OPEN SKILL MATRIX" accent="#4ac94a" mount="arm"
      ><SkillsScreen /></Monitor>

      {/* ── BOTTOM ROW ───────────────────────────────────────── */}
      {/* Desk-stand mounted: neck + base rest flush on the desk surface,
          with visible desk between the bases and the keyboard area.    */}

      <Monitor id="projects"
        position={[-0.96, 1.15, -0.72]} rotation={[0, 0.28, 0]}
        width={W} height={H}
        label="OPEN PROJECT ARCHIVE" accent="#ff3df5" mount="stand"
      ><ProjectsScreen /></Monitor>

      <Monitor id="contact"
        position={[0, 1.15, -0.72]}
        width={W} height={H}
        label="OPEN CONTACT UPLINK" accent="#ffb347" mount="stand"
      ><ContactScreen /></Monitor>

      <Monitor id="cv"
        position={[0.96, 1.15, -0.72]} rotation={[0, -0.28, 0]}
        width={W} height={H}
        label="VIEW CV DOSSIER" accent="#36f9d8" mount="stand"
      ><CVScreen /></Monitor>

      {/* ── Arcade tablet ────────────────────────────────────────
          A tablet lying flat on the desk, front-right beside the mouse,
          screen facing up. Opens SIGNAL//ARCADE (Pac-Man) when clicked.
          rotation X=−90° lays it flat; Y≈desk top + half its thickness. */}
      <Tablet
        position={[0.78, 0.748, 0.30]} rotation={[-Math.PI / 2, 0, 0]}
        width={0.40} height={0.30}
        label="OPEN SIGNAL//ARCADE" accent="#ffb347"
      ><ArcadeScreen /></Tablet>
    </Canvas>
  );
}
