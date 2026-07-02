import { Vector3, Ray } from './math/index.js';
import { Node, Scene, Box, Plane, Sphere } from './geometry/index.js';
import { Diffuse, Mirror, Emissive } from './materials/index.js';
import { Camera, Controls } from './camera/index.js';
import { Renderer } from './render/index.js';
import { Loop, SceneManager, InputManager, EventBus, resolve as resolveCollision } from './engine/index.js';
import { AdaptiveController, FrameBudget } from './perf/index.js';
import {
  Room, RoomManager, Switch, Puzzle, worldColliders,
  save, load, snapshot, restart, SWITCH_TOGGLED,
} from './game/index.js';
import { App, FpsCounter, DebugOverlay, Settings } from './ui/index.js';

const ROOM_KEY = 'atrium';
const PLAYER_RADIUS = 0.4; // assumption (memory/engine.md open question — sphere-vs-AABB proxy)
const SWITCH_ID = 'mirror-switch';

// Builds the one concrete level this boot runs (memory/gameplay.md: puzzle
// mechanic was fixed in PLAN-07/P3, the numeric layout was still Unknown).
// A single room: a switch flips a movable mirror between an orientation that
// misses it entirely (parallel to the beam, "off") and one that reflects the
// beam 90 degrees onto the receiver ("on").
function buildLevel(bus) {
  const root = new Node();

  const wallMaterial = new Diffuse(new Vector3(0.6, 0.6, 0.65));
  const floorMaterial = new Diffuse(new Vector3(0.35, 0.35, 0.4));

  const shell = [
    new Box(new Vector3(-0.5, -0.5, -0.5), new Vector3(10.5, 0, 10.5), floorMaterial), // floor
    new Box(new Vector3(-0.5, 3, -0.5), new Vector3(10.5, 3.5, 10.5), wallMaterial), // ceiling
    new Box(new Vector3(-0.5, -0.5, -0.5), new Vector3(0, 3.5, 10.5), wallMaterial), // -X wall
    new Box(new Vector3(10, -0.5, -0.5), new Vector3(10.5, 3.5, 10.5), wallMaterial), // +X wall
    new Box(new Vector3(-0.5, -0.5, -0.5), new Vector3(10.5, 3.5, 0), wallMaterial), // -Z wall
    new Box(new Vector3(-0.5, -0.5, 10), new Vector3(10.5, 3.5, 10.5), wallMaterial), // +Z wall
  ];
  for (const geometry of shell) root.add(new Node({ geometry }));

  root.add(new Node({
    position: new Vector3(5, 2.8, 5),
    light: { color: new Vector3(1, 1, 0.95), intensity: 18 },
  }));

  root.add(new Node({
    geometry: new Sphere(new Vector3(1, 1.5, 5), 0.2, new Emissive(new Vector3(1, 0.5, 0.2), 2)),
  }));

  // Mirror orientations: "off" is parallel to the emitter beam (never hit,
  // beam passes straight through to the far wall); "on" reflects the beam 90
  // degrees toward the receiver. Both share the same plane point.
  const mirrorPoint = new Vector3(5, 1.5, 5);
  const offNormal = new Vector3(0, 0, 1);
  const onNormal = new Vector3(-1, 0, 1).normalize();
  const mirrorGeometry = new Plane(mirrorPoint, offNormal, new Mirror(0.9));
  root.add(new Node({ geometry: mirrorGeometry }));

  const receiverGeometry = new Box(
    new Vector3(4.7, 1.2, 9.2),
    new Vector3(5.3, 1.8, 9.5),
    new Emissive(new Vector3(0.2, 1, 0.3), 2)
  );
  root.add(new Node({ geometry: receiverGeometry }));

  const switchGeometry = new Box(
    new Vector3(2.7, 0, 7.7),
    new Vector3(3.3, 0.6, 8.3),
    new Diffuse(new Vector3(0.9, 0.8, 0.1))
  );
  root.add(new Node({ geometry: switchGeometry }));

  const scene = new Scene(root).build();

  const toggleSwitch = new Switch({ id: SWITCH_ID, position: new Vector3(3, 0.3, 8), radius: 1.5, bus });

  const puzzle = new Puzzle({
    emitterRay: new Ray(new Vector3(1.3, 1.5, 5), new Vector3(1, 0, 0)),
    scene,
    receiver: receiverGeometry,
    mirror: mirrorGeometry,
    orientations: [offNormal, onNormal],
    linkedSwitch: SWITCH_ID,
    bus,
  });
  puzzle.retrace();

  return { scene, switches: [toggleSwitch], doors: [], collectibles: [], puzzle };
}

const bus = new EventBus();
const sceneManager = new SceneManager();
const roomManager = new RoomManager(sceneManager);

const level = buildLevel(bus);
const initialSpawn = { position: new Vector3(2, 1.5, 2), yaw: (5 * Math.PI) / 4 };
roomManager.register(new Room({ key: ROOM_KEY, scene: level.scene, spawn: initialSpawn, transitions: [] }));
roomManager.enter(ROOM_KEY);

const canvas = document.getElementById('view');
const ctx = canvas.getContext('2d');
const input = new InputManager(canvas);
const camera = new Camera({ position: initialSpawn.position, yaw: initialSpawn.yaw });
const controls = new Controls();
const renderer = new Renderer({ width: canvas.width, height: canvas.height });

// F3: measure render()-only ms (smoothed) and feed PLAN-09/F2's
// AdaptiveController. `adaptiveController.enabled` defaults false, so this
// wiring only computes a value — it never calls `renderer.setScale` or
// touches the blit, so it changes no pixels (memory/performance.md). U3
// owns actually turning adaptive on + the canvas upscale-on-blit.
const frameBudget = new FrameBudget();
const adaptiveController = new AdaptiveController({ targetMs: frameBudget.targetMs });
let settingsPanel = null; // assigned below, once `app` exists for its onClose hook

// U3: persist/apply the UI-owned settings blob through the save's opaque
// `settings` field (memory/ui.md, memory/gameplay.md). Defaults come from
// the live objects' own constructors (conventions/camera-input own them —
// UI only overrides at runtime).
function currentSettingsBlob() {
  return settingsPanel ? settingsPanel.getBlob() : {
    resolutionScale: 1,
    adaptive: adaptiveController.enabled,
    fov: camera.fov,
    samples: renderer.samples,
    maxDepth: renderer.maxDepth,
    mouseSensitivity: controls.mouseSensitivity,
    invertY: controls.invertY,
  };
}

function persistSettings(blob) {
  save(snapshot({
    roomManager,
    collectibles: level.collectibles,
    switches: level.switches,
    doors: level.doors,
    settings: blob ?? currentSettingsBlob(),
  }));
}

// Applies a persisted settings blob to every live target, then re-syncs the
// panel's inputs to match (the panel may not exist yet at first boot).
function applySettings(blob) {
  if (!blob) return;
  if (typeof blob.fov === 'number') camera.setFov(blob.fov);
  if (typeof blob.samples === 'number') renderer.samples = blob.samples;
  if (typeof blob.maxDepth === 'number') renderer.maxDepth = blob.maxDepth;
  if (typeof blob.mouseSensitivity === 'number') controls.mouseSensitivity = blob.mouseSensitivity;
  if (typeof blob.invertY === 'boolean') controls.invertY = blob.invertY;
  if (typeof blob.adaptive === 'boolean') adaptiveController.enabled = blob.adaptive;
  const resolutionScale = typeof blob.resolutionScale === 'number' ? blob.resolutionScale : 1;
  renderer.setScale(adaptiveController.enabled ? adaptiveController.currentScale : resolutionScale);
  settingsPanel?.refresh(resolutionScale);
}

function applySpawn(spawn) {
  camera.position = spawn.position;
  camera.yaw = spawn.yaw;
  camera.pitch = 0;
}

function applySavedState(state) {
  for (const sw of level.switches) {
    const on = !!state.switches?.[sw.id];
    if (sw.on !== on) {
      sw.on = on;
      bus.emit(SWITCH_TOGGLED, { id: sw.id, on });
    }
  }
  const targetRoom = state.currentRoom && roomManager.getRoom(state.currentRoom) ? state.currentRoom : ROOM_KEY;
  applySpawn(roomManager.enter(targetRoom));
}

function onNewGame() {
  applySpawn(restart({
    initialRoom: ROOM_KEY,
    roomManager,
    collectibles: level.collectibles,
    switches: level.switches,
    doors: level.doors,
  }));
}

function onContinue() {
  const state = load();
  if (state) {
    applySavedState(state);
    applySettings(state.settings);
  }
}

function onQuit() {
  persistSettings();
}

function update(dt) {
  const snapshot = input.poll();
  const oldPosition = camera.position;
  controls.update(camera, snapshot, dt);
  const desiredMove = camera.position.sub(oldPosition);
  const colliders = worldColliders(roomManager.activeRoom.scene, level.doors);
  camera.position = resolveCollision(oldPosition, desiredMove, PLAYER_RADIUS, colliders);

  roomManager.update(camera.position);
  for (const sw of level.switches) sw.update(camera.position, snapshot);

  app.onFrame(dt);
}

// U3: an offscreen canvas the internal (possibly sub-canvas-size) render
// buffer blits onto first, then `drawImage` upscales it to fill the visible
// canvas — needed once adaptive resolution can actually shrink the buffer
// (PLAN-09/F2's `renderer.setScale`). `imageSmoothingEnabled = false` keeps
// the same pixelated look as the CSS `image-rendering: pixelated` on #view
// when no scaling is needed.
const offscreen = document.createElement('canvas');
const offscreenCtx = offscreen.getContext('2d');

function blit(frame) {
  if (frame.width === canvas.width && frame.height === canvas.height) {
    ctx.putImageData(new ImageData(frame.data, frame.width, frame.height), 0, 0);
    return;
  }
  if (offscreen.width !== frame.width || offscreen.height !== frame.height) {
    offscreen.width = frame.width;
    offscreen.height = frame.height;
  }
  offscreenCtx.putImageData(new ImageData(frame.data, frame.width, frame.height), 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
}

function render() {
  const scene = roomManager.activeRoom.scene;
  const start = performance.now();
  const frame = renderer.render(camera, scene);
  const renderMs = performance.now() - start;
  const smoothedMs = frameBudget.sample(renderMs);
  adaptiveController.update(smoothedMs);
  if (adaptiveController.enabled) {
    renderer.setScale(adaptiveController.currentScale);
  }
  blit(frame);
}

const loop = new Loop({ update, render });

const fpsCounter = new FpsCounter({ loop });
const debugOverlay = new DebugOverlay({
  camera,
  getScene: () => roomManager.activeRoom?.scene ?? null,
  renderer,
  loop,
  frameBudget,
});

settingsPanel = new Settings({
  camera,
  renderer,
  controls,
  adaptiveController,
  fovMin: controls.fovMin,
  fovMax: controls.fovMax,
  onPersist: persistSettings,
  onClose: () => app.closeSettings(),
});

// Apply whatever settings were saved last session before the first frame
// renders (Road U3 — "load persisted settings on boot ... and apply them").
applySettings(load()?.settings);

const app = new App({
  root: document.getElementById('ui'),
  canvas,
  loop,
  input,
  hasSave: () => load() !== null,
  onNewGame,
  onContinue,
  onRestart: onNewGame,
  onQuit,
  hud: document.getElementById('hud'),
  fpsCounter,
  debugOverlay,
  settings: settingsPanel,
});
