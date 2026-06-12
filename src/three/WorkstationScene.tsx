import { Canvas } from '@react-three/fiber';
import { useSignalStore } from '../store';
import { CameraController } from './CameraController';
import { RoomEnvironment } from './RoomEnvironment';
import { DeskObjects } from './DeskObjects';
import { Monitor } from './Monitor';
import { MainTerminalScreen } from '../screens/MainTerminalScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { SkillsScreen } from '../screens/SkillsScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { CVScreen } from '../screens/CVScreen';
import { ContactScreen } from '../screens/ContactScreen';

/**
 * Monitor wall layout (all screens live on roughly the same Z plane, ~−0.5).
 * Nothing extends forward past Z ≈ −0.35 so the overview camera at Z=1.6
 * keeps everything comfortably in frame without viewport overflow.
 *
 *          [  PROJECTS  – upper wide  ]
 *  [ABOUT]  [  HOME – centre terminal ]  [SKILLS]
 *  [CONT.]  [                         ]  [ CV  ]
 */
export default function WorkstationScene({ reducedMotion }: { reducedMotion: boolean }) {
  const setView = useSignalStore((s) => s.setView);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 55, near: 0.05, far: 30, position: [0, 1.42, 2.2] }}
      onPointerMissed={() => setView('overview')}
    >
      <color attach="background" args={['#05070b']} />
      <fog attach="fog" args={['#05070b', 4.5, 13]} />

      <CameraController reducedMotion={reducedMotion} />
      <RoomEnvironment reducedMotion={reducedMotion} />
      <DeskObjects />

      {/* ── Upper wide — project archive ─────────────────────── */}
      <Monitor
        id="projects"
        position={[0, 2.0, -0.74]}
        rotation={[0.14, 0, 0]}
        width={1.15}
        height={0.40}
        label="OPEN PROJECT ARCHIVE"
        accent="#ff3df5"
        mount="arm"
      >
        <ProjectsScreen />
      </Monitor>

      {/* ── Centre — hero / terminal ─────────────────────────── */}
      <Monitor
        id="home"
        position={[0, 1.32, -0.62]}
        width={0.92}
        height={0.54}
        label="OPEN MAIN TERMINAL"
        accent="#36f9d8"
      >
        <MainTerminalScreen />
      </Monitor>

      {/* ── Left — operator profile ──────────────────────────── */}
      {/* Pulled in from −1.18 → −1.08 and the Y rotation reduced so
          the left edge doesn't clip on narrower viewports */}
      <Monitor
        id="about"
        position={[-1.08, 1.28, -0.52]}
        rotation={[0, 0.46, 0]}
        width={0.76}
        height={0.50}
        label="OPEN OPERATOR PROFILE"
        accent="#ffb347"
      >
        <AboutScreen />
      </Monitor>

      {/* ── Right — skill matrix ─────────────────────────────── */}
      <Monitor
        id="skills"
        position={[1.08, 1.28, -0.52]}
        rotation={[0, -0.46, 0]}
        width={0.76}
        height={0.50}
        label="OPEN SKILL MATRIX"
        accent="#4ac94a"
      >
        <SkillsScreen />
      </Monitor>

      {/* ── Lower-left — contact / final transmission ────────── */}
      {/* Moved from Z=0 (near camera, overflow) to Z=−0.44 (on the wall plane).
          Slight downward + inward tilt reads as a secondary desk-level screen. */}
      <Monitor
        id="contact"
        position={[-0.64, 0.96, -0.44]}
        rotation={[-0.18, 0.30, 0]}
        width={0.44}
        height={0.32}
        label="OPEN FINAL TRANSMISSION"
        accent="#ffb347"
        mount="tilt"
      >
        <ContactScreen />
      </Monitor>

      {/* ── Lower-right — CV dossier ─────────────────────────── */}
      <Monitor
        id="cv"
        position={[0.64, 0.96, -0.44]}
        rotation={[-0.18, -0.30, 0]}
        width={0.52}
        height={0.36}
        label="OPEN CV DOSSIER"
        accent="#36f9d8"
        mount="tilt"
      >
        <CVScreen />
      </Monitor>
    </Canvas>
  );
}
