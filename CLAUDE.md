# CLAUDE.md — guidance for AI agents in this repo

Read `README.md` for the product and `ansible/README.md` for full deploy
details. This file captures the **non-obvious things that have tripped agents
up** — read it before touching content, CI, or deploys.

## Stack & layout

- React + TypeScript + Vite + Three.js (`@react-three/fiber`, `drei`) + Framer
  Motion + Zustand. 100% procedural 3D — no external assets/textures.
- `src/data/` — all personal content (components never hardcode it).
  **`src/data/profile.ts` `email` is the single source for the contact
  address** — change it there; every mailto/copy reads from it.
- `src/three/` — 3D scene; `src/screens/` — the monitor screen UIs;
  `src/components/` — HUD/overlays; `src/arcade/` — the vendored Pac-Man
  easter-egg game opened by the desk tablet (`src/three/Tablet.tsx` →
  `src/components/Arcade.tsx`).
- Build/verify with `npm run build` (`tsc -b` + vite). There are **no unit
  tests**. For visual checks, `npm run dev` then drive the dev-only store:
  `window.__SIG_STORE__.getState().setBooted(true)`, `.setView('projects')`,
  `.setArcadeOpen(true)`, etc.

## Git / PR conventions

- **Commit messages must never mention Claude / Anthropic / Co-Authored-By**
  (owner's standing rule).
- Branch off `main` and open PRs **against `main`**. Do not stack a PR on
  another feature branch unless explicitly asked: a PR merged into a feature
  branch does **not** reach `main` (this is exactly how the arcade work first
  failed to ship).

## Deployment — read before touching CI

Authoritative details: `ansible/README.md`. The traps:

- **The site rides on TheMailHero's infra.** It's a Docker container with **no
  published ports**. The `email-tester-saas` repo ("TheMailHero", at
  `~/git/email-tester-saas`) frontend nginx owns host 80/443 on the shared VM
  (`168.138.13.45`) and reverse-proxies **by container name**:
  `lucasboglione.com` → container `tree-js-portfolio`;
  `staging.lucasboglione.com` → `tree-js-portfolio-staging`. Routing is by
  name, not image tag — so "is nginx pointing at the right container?" is the
  wrong question; check which **image** the named container is running.
- **Push to `main` ⇒ STAGING only.** Production deploys **only** on a `v*` git
  tag or a manual *Run workflow* (`workflow_dispatch`). A tag deploys the
  commit it points at — so merge to `main` first, then tag a `main` commit.
- **Use valid semver — no leading zeros.** `v1.0.3` ✓, `v1.0.03` ✗. A direct
  `git push` of a tag tags the image via `docker/metadata-action`
  `type=semver`, which **silently skips invalid-semver tags**, so the
  production deploy then can't pull the image. *Run workflow* tags via
  `type=raw` and tolerates odd versions (that's how the existing invalid tags
  `v1.0.01` / `v1.0.02` got deployed) — but always use real semver.
- **Recommended release:** merge to `main` → Actions → *Build and Push
  Container* → *Run workflow* → version `1.0.x` (proper semver). It builds from
  `main`, deploys production, and pushes the tag.
