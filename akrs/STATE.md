# STATE
Updated: 2026-07-01T00:30Z by claude-code (Leader / Opus 4.8)

## Active
- Mode: 3 (Planning) — PLAN-01 Tasks + Roads generated; ready to execute
- Plan / Phase / Task: PLAN-01 (Math Core) / M1 / vectors-ray
- Road: `roads/PLAN-01-M1-vectors-ray.md` (Status: ACTIVE)  ← current
  - Queued (ACTIVE, dependency-ordered): `PLAN-01-M2-matrix4` (needs M1) → `PLAN-01-M3-quaternion` (needs M2); `PLAN-01-M4-bounds` (needs M1)

## Done
- Phase A skeleton generated for Mirror Forge (AKRS Full):
  - Router — `akrs/ROUTER.md`
  - 10 Plans with phases — `akrs/plans/PLAN-01 … PLAN-10`
  - Memory index — `akrs/memory/` (architecture, conventions, + one contract per domain)
  - Kernel — `akrs/KERNEL.md`
  - Platform adapters — `AGENTS.md` (canonical) + `CLAUDE.md`, `GEMINI.md`, `.cursor/rules`, `.github/copilot-instructions.md`
  - This `STATE.md` (initial save-point)
- Source of Truth confirmed: `docs/data.md` (requirements) + `docs/akrs/framework/` (framework, build-time only).
- Phase B: generated PLAN-01 Tasks + Roads (M1–M4) in `akrs/tasks/` + `akrs/roads/`; recorded Matrix4 storage + quaternion-consistency decisions in `memory/math.md`.

## Next
- Execute Road `roads/PLAN-01-M1-vectors-ray.md` — implement `src/math/Vector2.js`,
  `Vector3.js`, `Ray.js`, `index.js`. Then close out (update STATE, retire/refresh the Road) and
  advance to M2 (matrix4).

## Open questions
- **Coordinate convention** — assume right-handed, +Y up, camera looks −Z? (owner: `memory/conventions.md`; assumption, confirm)
- **World units** — assume meters? (assumption, confirm)
- **Unit-test framework** — `data.md` requires unit tests but names none. Options: zero-dep in-browser harness / Vitest (dev-only dep). Decide before PLAN-10.
- **Build tooling** — assume none (serve ES modules directly via a static dev server, no bundler)? (assumption, confirm)
- **Save storage** — assume browser `localStorage` with a versioned JSON schema? (owner: `memory/gameplay.md`; assumption, confirm)
- **Framework removal** — `02-Generation §7` says strip `docs/akrs/framework/` from a shipped project. Kept here intentionally (it is this repo's versioned source and your confirmed Source of Truth). Confirm keep vs. move-before-ship.
