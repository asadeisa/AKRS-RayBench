# KERNEL — Mirror Forge
> Read this fully, then obey. Do not scan the repo. Do not read framework doctrine — it lives in `docs/akrs/framework/` and is build-time only, never loaded at runtime.

Project: a browser-based first-person puzzle game rendered entirely by a hand-written CPU ray tracer.
Stack: HTML5 + CSS + vanilla JS (ES modules) + Canvas 2D. No rendering, game-engine, or physics libraries.

## Roles
- Leader: plans, owns architecture, generates Roads, owns close-out.
- Worker: executes ONLY the active Road. Never redesigns. Never leaves scope.

## Runtime priority
Road → Memory → Router → Repository   (touch the repo only if the active Road says so)

## Modes (pick from the prompt)
| Mode | When (prompt hint) | Path |
|------|--------------------|------|
| 0 | dev names the file/area ("edit Vector3", "in raytracer.js") | Memory + named files only |
| 1 | small isolated change / bugfix | single Road or file; skip full chain |
| 2 | "continue / finish <existing task>" | full route, no new planning |
| 3 | new work: "add / build / implement / plan X" | generate 1 Task + 1 Road on demand |
| 4 | cross-cutting / structural (axes, pipeline, perf rework) | Leader only |
Fast path = 0/1: skip Router→Memory→Road for trivial work.

## The one route
Prompt → Mode → Router → Memory → Road → Execute

## Before executing (once)
"Can I finish with ONLY the active Road?"  YES → execute.
NO → Router → required Memory → back to Road → continue. Never guess. Never fabricate a
convention; if a contract is Unknown, ask (see `STATE.md` → Open questions).

## File shapes (must / never)
- Router: routes + refs / no explanations.
- Memory: index + refs + ownership + decisions / no implementation, no tutorials.
- Road: read-order + expected-files + change-scope + Status / no docs.
- Task: objective + constraints + refs + expected-output / no duplicated knowledge.

## Validation
One owner per concept · every Task has one Road · Memory = index · Router = routes ·
every Road has a Status (`ACTIVE` | `DONE + superseded by <memory>`).

## Interaction
Offer 2–4 options, recommended first. One decision per turn. Confirm Source of Truth first.
End every turn with a guided next step.

## Close-out (when work lands)
Update `STATE.md` → then retire the Road (`DONE + superseded by <memory>`) OR refresh its
Expected files to match reality. Keep Road and Memory in agreement.

## Applicability
This project = **AKRS Full** (multi-capability, high blast radius): Router + Memory + Plans +
Phases + Roads on demand. Do not strip structure; do not pre-generate Tasks/Roads.

## Pointers
- Router:          `akrs/ROUTER.md`
- Plans:           `akrs/plans/`   (PLAN-01 … PLAN-10; phases live inside each plan)
- Memory:          `akrs/memory/`
- STATE:           `akrs/STATE.md`
- Roads:           `akrs/roads/`   (generated on demand, Mode 3)
- Source of Truth: `docs/data.md`  (confirmed requirements). Framework `docs/akrs/framework/` is build-time only — never loaded at runtime.
