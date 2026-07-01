# Memory — Conventions
Owns: project-wide conventions every module must obey. Single source of truth for axes, units,
color, render budgets, and code style. If a Road needs a convention not listed here, it is
**Unknown** — ask, do not invent.

## Spatial
- Handedness: right-handed, **+X** right, **+Y** up, **−Z** forward (camera looks down −Z). — **Assumption (Med)**, confirm.
- World units: meters. — **Assumption (Low)**, confirm.
- Angles: radians internally; degrees only at UI/config edges.

## Color & image
- Internal lighting math in **linear** space; convert to display with gamma. — **Decided** (data.md: "gamma correction").
- Gamma exponent: 2.2. — **Assumption (High)**.
- Framebuffer: Canvas 2D `ImageData` (RGBA8, 0–255). — **Decided** (data.md: Canvas 2D, no libs).
- Color channels stored 0..1 float in the pipeline; clamp + gamma + ×255 only at write-out.

## Rendering budgets (defaults; tune in PLAN-09)
- Max ray/reflection depth: 4. — **Assumption (Med)** (data.md: "ray depth limit"). Wired as
  `Renderer`'s `maxDepth` param, PLAN-04/R3.
- Anti-aliasing: supersampling via jittered sub-pixel samples. — **Assumption (Med)** (data.md:
  "anti-aliasing"). Sample count default: 4 per pixel. — **Assumption (Med)**, no exact count in
  data.md; wired as `Renderer`'s `samples` param, PLAN-04/R4.
- Shadows: hard only (single shadow ray per light). — **Decided** (data.md: "hard shadows").
- Lights: point lights. — **Decided**. Plus a constant ambient term.
- Ambient coefficient: numeric default **Unknown** — `materials.shade()` reads `scene.ambient`,
  falling back to 0 (neutral, not invented) when unset. See `STATE.md` → Open questions.

## Code style
- Vanilla JS, **ES modules**, browser-native (no bundler assumed — confirm in STATE). — **Decided**/Assumption.
- No rendering, game-engine, or physics libraries at runtime. — **Decided** (data.md).
- Classes for types with identity (Vector3, Entity); pure functions for stateless math where natural.
- Naming: `PascalCase` types, `camelCase` members, `SCREAMING_SNAKE` consts.

## Persistence
- Save target: browser `localStorage`, versioned JSON. — **Assumption (Med)**, owned by [[gameplay]], confirm.

Related: [[architecture]] · [[math]] · [[rendering]] · [[gameplay]]
