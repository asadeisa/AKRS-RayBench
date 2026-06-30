# Memory — UI Shell
Owns: the UI surfaces and how they bind to engine/game state. Truth lives in `src/ui/`. HTML/CSS
overlays on top of the canvas; consumes [[engine]] (state + events), [[gameplay]] (save),
[[camera-input]] (FOV/sensitivity settings).

## Surfaces (from data.md)
- **Main menu** — new game / continue (if save exists) / settings.
- **Pause menu** — resume / restart / settings / quit to menu; releases pointer lock.
- **FPS counter** — reads frame timing from the game loop ([[engine]]) / renderer ([[performance]]).
- **Debug overlay** — ray stats, camera pose, scene/object counts; toggled by a hotkey.
- **Settings** — resolution / adaptive-resolution toggle, FOV, AA & reflection-depth quality, mouse sensitivity. Writes through to [[conventions]] budgets at runtime + persists via [[gameplay]] save.

## Decisions
- UI is DOM/CSS overlay, not drawn into the ray-traced framebuffer (keeps the tracer pure). — **Assumption (High)**.
- Settings are the user-facing control surface for the render budgets owned by [[conventions]]; UI reads/writes them but does not own their defaults.

Related: [[engine]] · [[gameplay]] · [[performance]] · [[camera-input]]
