# SIGNAL//DESK — Interactive Developer Workstation

A cinematic, first-person developer portfolio. The recruiter sits at a dark
sci-fi workstation: six glowing screens, neon rain outside the window, server
racks blinking in the corner — and your portfolio is the operating system
running on the monitors.

Built with **React + TypeScript + Vite + Three.js (@react-three/fiber, drei) +
Framer Motion + Zustand**. 100% procedural — no external 3D assets or textures.

---

## Quick start

```bash
npm install     # install dependencies
npm run dev     # development server (http://localhost:5173)
npm run build   # type-check + production build → dist/
npm run preview # preview the production build
```

## How to use the site

| Action | How |
|---|---|
| Focus a monitor | Click it (or use the HUD menu, or type a terminal command) |
| Return to the desk | `Esc`, the **Back** button, or click empty space |
| Terminal commands | `help`, `about`, `skills`, `projects`, `cv`, `contact`, `clear`, `unlock` |
| Skip the cinematic | **Recruiter Quick Access** button (bottom-right) |

`unlock` triggers a small easter egg. Try it.

---

## Where to edit YOUR content

All personal content lives in `src/data/` — components never hardcode it.

| What | File |
|---|---|
| Name, role, tagline, summary, email, GitHub, LinkedIn | `src/data/profile.ts` |
| Skill categories + per-skill detail text | `src/data/skills.ts` |
| Project case files + featured projects | `src/data/projects.ts` |
| Experience timeline + technical strengths | `src/data/experience.ts` |
| Terminal commands / help text / easter egg | `src/data/commands.ts` |

**Your CV PDF:** lives at **`public/cv.pdf`** (already in place). If the file
is ever missing, the Download CV buttons show a clear error instead of opening
a broken tab. (To use a different path/name, change `cvPath` in `src/data/profile.ts`.)

**LinkedIn:** the `linkedin` field in `profile.ts` is currently empty, which
hides the LinkedIn links everywhere. Paste your profile URL there to show them.

Search the codebase for `TODO:` to find the remaining optional placeholders
(project repo links, LinkedIn).

## Architecture

```
src/
├── data/            ← ALL editable content (profile, skills, projects, …)
├── store.ts         ← zustand store: view, boot, unlock, modal state
├── three/           ← the 3D world
│   ├── WorkstationScene.tsx   Canvas + monitor layout
│   ├── CameraController.tsx   state interpolation + head-sway parallax
│   ├── cameraStates.ts        predefined camera positions per screen
│   ├── Monitor.tsx            procedural monitor + HTML screen surface
│   ├── DeskObjects.tsx        desk, keyboard, mouse, mug, cables
│   └── RoomEnvironment.tsx    walls, neon window, rain, racks, dust, lights
├── screens/         ← the six screen UIs (shared by 3D + mobile)
├── components/      ← boot sequence, HUD, quick access, terminal input…
├── hooks/           ← reduced-motion + mobile detection
└── styles/          ← global / screens / hud / mobile CSS
```

Screen content is rendered with drei `<Html transform>` glued onto the 3D
monitor glass — crisp, selectable, fully interactive HTML. When a monitor is
not focused its HTML layer is click-through, so clicking the glass focuses
the camera; once focused, the buttons/links/terminal become interactive.

If screen content ever looks uniformly too large/small after a drei upgrade,
tune the single `PX_PER_UNIT` constant in `src/three/Monitor.tsx`.

## Accessibility & fallbacks

- **`prefers-reduced-motion`** — near-instant camera cuts, no parallax, no
  glitch/scanline sweeps, no rain/dust particles, instant boot.
- **Mobile (≤ 880px)** — the 3D desk is replaced by a cinematic stacked-card
  layout with identical content; navigation scrolls instead of moving a camera.
- **WebGL failure** — an error boundary falls back to the same card layout.
- Keyboard: full tab navigation, `Esc` to exit a screen, accessible terminal.

## Performance notes

- Three.js scene is lazy-loaded; the boot sequence covers the load.
- All geometry is procedural primitives; keycaps are instanced; particles are
  capped (~260 rain, ~130 dust); `dpr` clamped to 1.5.
- The only "expensive" effect is the desk's `MeshReflectorMaterial`
  (512px reflection pass) — remove `<DeskTop />`'s reflector in
  `src/three/DeskObjects.tsx` and use a plain dark material if you need more headroom.

## Assumptions made

- Profile, experience and project data were filled from the CV PDF; tweak any
  wording in `src/data/`.
- Project GitHub repo links are hidden until set in `src/data/projects.ts`.
- No router: this is a single cinematic page, navigation is state-based.
- No analytics, no external fonts, no CDN assets — everything ships in the bundle.
