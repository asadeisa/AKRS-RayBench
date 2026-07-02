# Mirror Forge — an AKRS workflow test

Mirror Forge is a browser-based first-person puzzle game with a hand-written CPU ray tracer,
built entirely in vanilla JavaScript. But the game is not really the point of this repository.

**This repo exists to answer one question: how far can [AKRS](https://github.com/asadeisa/akrs)
be trusted as an autonomous development workflow?**

## What this repo actually is

This project was built to stress-test AKRS, not to hand-craft a game. The rule for this run was
strict, on purpose:

- The code was **not** written by hand and was **not** designed outside of AKRS. Every line came
  out of the workflow: an **Opus, extra-high thinking** model acting as Leader (planning, Roads,
  Memory), and a **Sonnet-5, medium-thinking** model acting as Worker (execution).
- I, the developer, **did not read the generated code and did not edit it**. My only action was
  clicking "run" / approving the next step. If the workflow was going to fail, it needed to fail
  on its own — I wasn't there to catch it.
- The entire point of the exercise is to see how far a documentation-driven, multi-agent workflow
  can carry a real project **without a human in the loop reviewing output**.

If you're evaluating AKRS for your own use, this repo — plus the two critique reports below — is
the evidence, not the pitch.

## The verdict, honestly

AKRS **works** as a way to route a small amount of the right knowledge to a cheap model so it can
execute correctly without scanning the repo. Over two days, one Leader pass plus a mid-tier Worker
shipped a working math library, geometry kernel, material system, recursive ray tracer, camera,
engine runtime, gameplay layer, UI, and performance pass — 10 plans, all closed out, with recorded
weekly model usage under ~20% in the pro plan subscription .

It also has real, named weaknesses. The workflow currently defines "done" by paperwork agreement
(Road ↔ Memory ↔ STATE), not by whether the feature is observable in the running product. That gap
let dead code, an invisible win condition, and a 0.4 FPS "playable" game ship while every artifact
in the workflow reported 100% complete. That is the core finding of this test, and it's the reason
a new version of AKRS is already being planned instead of just patched around.

## Read the critique (نقد) before you adopt this workflow

Two independent evaluation passes were run against this repo by a separate model acting purely as
an auditor (not as Leader or Worker), specifically to find what AKRS gets wrong, not just what it
gets right. Both are kept **locally in this repo** (not pushed to git — see below) so anyone
cloning this project can read the full, unfiltered critique:

- **`WORKFLOW-EVALUATION.md`** — a full audit of the workflow artifacts themselves: the Kernel,
  Router, Memory, Roads, Plans, and STATE. Scores what's strong (epistemic labeling in Memory,
  Road-as-execution-contract, the scope-exception protocol) against what's broken (STATE.md bloat,
  Task/Road duplication, no persistent verification, doctrine ignored under batching pressure).
- **`WORKFLOW-EVALUATION-2-LIVE.md`** — what happened when the *finished* game was actually run in
  a browser. All 72 tests green, all plans DONE, and the game still ran at ~0.4 FPS with an
  invisible win state. This report names the single root cause behind every live defect: nothing
  in AKRS is ever required to look at the running product instead of the paperwork.

**Why they aren't in git:** these are honest, sometimes harsh, internal critique documents written
for the purpose of fixing the workflow — not marketing collateral for a game repo. They stay on
disk locally for anyone working on the next AKRS version, but they aren't pushed to the public
history. If you want the full findings, ask for them directly or check the
[AKRS repo](https://github.com/asadeisa/akrs) for the version that incorporates the fixes.

## Where this goes next

The weaknesses above are already scoped into a growth plan for the next AKRS version (see the
[AKRS repo](https://github.com/asadeisa/akrs)):

1. **Trust but verify** — a "Mirror Check" at close-out that confirms each shipped feature is
   reachable at runtime, not just exported; a mechanical lint instead of an honor system.
2. **Team-ready** — STATE/LOG split so state stops growing unbounded, seam ownership so
   deferred work can't quietly become invisible work, an expiry rule so open questions can't ship
   silently as "non-blocking" forever.
3. **Org-ready** — measurable acceptance lines in the source of truth, CI-published verification,
   and a real cost/ROI number instead of usage figures buried in commit messages.

The plan is to keep everything AKRS already gets right (single-owner knowledge, Kernel-as-compiled
doctrine, Road-scoped execution, the close-out discipline) and stop relying on prompt discipline
alone for the parts that determine whether the product actually works.

## Tech stack (the game itself)

- Vanilla JavaScript (ES modules), Canvas 2D — no rendering libraries, no game engine, no physics
  library, no bundler.
- Custom CPU ray tracer: recursive reflections, hard shadows, gamma-correct shading, jittered
  anti-aliasing.
- Full 3D math suite (Vector2/3, Matrix4, Quaternion, bounding volumes), scene graph, materials
  system (diffuse/mirror/metallic/emissive), first-person camera and controls, entity/engine
  runtime, reflective-beam puzzles, save/load, UI, and a performance pass (progressive
  rendering, adaptive resolution, spatial acceleration).

## Running it

1. Clone the repository.
2. Open `index.html` in a modern browser (or serve it via any static HTTP server).
3. **WASD** to move, **mouse** to look, solve the reflective puzzles to win.

## Project structure

```
mirror-test/
├── index.html              # Game entry point
├── src/                    # Generated source code, organized by subsystem
├── tests/                  # Persisted verification tests
├── docs/
│   ├── data.md              # Source of truth for requirements
│   └── akrs/                # AKRS framework docs (build-time only, never loaded at runtime)
└── akrs/                    # AKRS runtime artifacts for this run
    ├── KERNEL.md             # Compiled per-project operating rules
    ├── ROUTER.md              # Domain → Plan/Memory routing
    ├── STATE.md               # Session state / save point
    ├── memory/                # Design decisions and architectural contracts
    ├── plans/                 # Implementation phases
    ├── roads/                 # Execution contracts (scope, acceptance, close-out)
    └── tasks/                 # Task specifications paired with Roads
```

## How AKRS drove this build

- **Router** (`akrs/ROUTER.md`) maps a domain to the Plan and Memory that own it.
- **Memory** (`akrs/memory/`) is the single-owner source of architectural decisions, each one
  labeled Decided / Assumption (High/Med/Low) / Unknown.
- **Roads** (`akrs/roads/`) are scoped execution contracts: exact files, boundaries, acceptance
  criteria, close-out. The Worker never reads outside the assigned Road.
- **STATE.md** is the save point read at the start of every session.

None of this was reviewed by hand during the build — see "What this repo actually is" above.

## License

Proprietary. All rights reserved.
