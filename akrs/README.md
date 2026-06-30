# akrs/ — Mirror Forge workflow (human orientation)
> This file is for humans. It is **not** part of the runtime route. Agents boot via
> `AGENTS.md → akrs/KERNEL.md` and navigate by `ROUTER.md`.

This folder is the **compiled AKRS workflow** for Mirror Forge, generated from the framework in
`docs/akrs/framework/` (the *source code*) applied to `docs/data.md` (the requirements / Source
of Truth). Tier: **AKRS Full**.

## Layout
| Path | Role |
|---|---|
| `KERNEL.md` | The one-page operating rules every session/tool boots into. |
| `STATE.md` | Portable save-point: where we left off, what's next, open questions. |
| `ROUTER.md` | Routes a prompt's domain → the right Plan + Memory. Routing only. |
| `plans/` | 10 Plans (capabilities), each with its Phases (milestones). |
| `memory/` | Reusable knowledge index: one owner per concept (contracts + decisions). |
| `roads/` | Execution contracts, **generated on demand** (Mode 3). Empty until work starts. |

## How to use it
1. Open a session in any supported tool — it reads `AGENTS.md` → `KERNEL.md` → `STATE.md`.
2. To start work, ask for it ("build PLAN-01 M1: Vector3 + Ray"). The Leader generates one Task
   + one Road, then a Worker executes only that Road.
3. When work lands, **close out**: update `STATE.md` and reconcile the Road (see `roads/README.md`).

## Generation notes (decisions made by the Leader)
- Source of Truth confirmed: `docs/data.md`. Framework `docs/akrs/framework/` is build-time only.
- `02-Generation §7` "remove framework source docs" was **intentionally skipped** — the framework
  is this repo's versioned source and your confirmed Source of Truth. See `STATE.md` → Open questions.
- Greenfield conventions (axes, units, save format, test harness, build tooling) are recorded as
  **Assumptions** in `memory/conventions.md` and surfaced in `STATE.md` for confirmation — none
  were silently invented as facts.
