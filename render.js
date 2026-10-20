// render.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

const FLY_SPEED = 8;
const MOVE_SPEED = 6;
const JUMP_SPEED = 8;
const GRAVITY = 25;

const main = () => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const container = canvas.parentElement;

  // ----- Scene / camera / renderer -----
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);

  const camera = new THREE.PerspectiveCamera(
    60, container.clientWidth / container.clientHeight, 0.1, 1000
  );
  camera.position.set(0, 1.5, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight, false);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(container.clientWidth, container.clientHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.left = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  container.appendChild(labelRenderer.domElement);

  // ----- Lights + grid -----
  scene.add(new THREE.AmbientLight(0x404060));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 5, 2);
  scene.add(dir);
  const fill = new THREE.PointLight(0x4466ff, 0.5);
  fill.position.set(-3, 1, 2);
  scene.add(fill);

  const grid = new THREE.GridHelper(10, 20, 0x888888, 0x444444);
  grid.material.transparent = true;
  grid.material.opacity = 0.3;
  grid.material.depthWrite = false;
  scene.add(grid);

  // ----- Model -----
  const loader = new GLTFLoader();
  loader.load(
    "assets/plush_cat_photoscan.glb",
    (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.scale.setScalar(5 / Math.max(size.x, size.y, size.z));

      const box2 = new THREE.Box3().setFromObject(model);
      const center = box2.getCenter(new THREE.Vector3());
      model.position.sub(center);
      scene.add(model);

      const div = document.createElement("div");
      div.className = "scene-label";
      div.textContent = "Plush Cat Scan";
      const label = new CSS2DObject(div);
      label.position.set(0, (box2.max.y - center.y) + 0.4, 0);
      model.add(label);
    },
    undefined,
    (err) => console.error("Model load failed:", err)
  );

  // ----- Controls -----
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.target.set(0, 0.5, 0);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.08;
  orbit.enablePan = false;
  orbit.enableZoom = false;
  orbit.update();

  const flyControls = new PointerLockControls(camera, canvas);
  const charControls = new PointerLockControls(camera, canvas);

  const flyMove = { forward:false, backward:false, left:false, right:false, up:false, down:false, sprint:false };
  const moveState = { forward:false, backward:false, left:false, right:false, jump:false, sprint:false };
  const player = {
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    onGround: true,
    height: 1.6,
  };

  // ----- UI -----
  const buttons = document.querySelectorAll("#hero-modes button");
  const hintEl = document.getElementById("hero-hint");
  const hints = {
    orbit: "Drag to rotate • click canvas after choosing Fly/Character",
    fly: "Click canvas to lock • WASD to move • Q/E up/down • Shift = sprint • Esc to release",
    character: "Click canvas to lock • WASD move • Shift run • Space jump • Esc to release",
  };

  let currentMode = "orbit";

  const clearKeys = () => {
    Object.keys(flyMove).forEach(k => flyMove[k] = false);
    Object.keys(moveState).forEach(k => moveState[k] = false);
  };

  const setMode = (mode, { requestLock = false } = {}) => {
    // Tear down current mode
    orbit.enabled = false;
    if (flyControls.isLocked) flyControls.unlock();
    if (charControls.isLocked) charControls.unlock();
    clearKeys();

    if (mode === "orbit") {
      orbit.enabled = true;
      orbit.update();
      camera.position.set(0, 1.5, 5);
      camera.lookAt(orbit.target);
    } else if (mode === "fly") {
      // Keep camera where it is; user flies from there
    } else if (mode === "character") {
      camera.position.set(0, player.height, 5);
      player.velocity.set(0, 0, 0);
    }

    currentMode = mode;
    buttons.forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
    hintEl.classList.remove("locked");
    hintEl.textContent = hints[mode];

    if (requestLock && mode !== "orbit") {
      (mode === "fly" ? flyControls : charControls).lock();
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();          // don't double-trigger canvas click
      setMode(btn.dataset.mode, { requestLock: true });
    });
  });

  // Click canvas to lock (only in fly/character)
  canvas.addEventListener("click", () => {
    if (currentMode === "fly" && !flyControls.isLocked) flyControls.lock();
    else if (currentMode === "character" && !charControls.isLocked) charControls.lock();
  });

  // Esc / external unlock → drop back to orbit so the cursor is never stuck
  const onUnlock = () => {
    if (currentMode === "fly" || currentMode === "character") {
      setMode("orbit");
    }
  };
  flyControls.addEventListener("unlock", onUnlock);
  charControls.addEventListener("unlock", onUnlock);

  const onLock = () => {
    hintEl.classList.add("locked");
    hintEl.textContent =
      currentMode === "fly"
        ? "LOCKED — WASD move, Q/E up/down, Shift sprint, Esc to exit"
        : "LOCKED — WASD move, Shift run, Space jump, Esc to exit";
  };
  flyControls.addEventListener("lock", onLock);
  charControls.addEventListener("lock", onLock);

  // Prevent scroll-wheel from zooming the page over the hero
  canvas.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });

  // ----- Keyboard -----
  const onKeyDown = (e) => {
    if (currentMode === "orbit") return;        // no key handling in orbit

    // Only handle movement when locked (except mode hotkeys)
    switch (e.code) {
      case "Digit1": setMode("orbit"); return;
      case "Digit2": setMode("fly", { requestLock: true }); return;
      case "Digit3": setMode("character", { requestLock: true }); return;
    }

    const locked = currentMode === "fly"
      ? flyControls.isLocked
      : charControls.isLocked;
    if (!locked) return;

    const target = currentMode === "fly" ? flyMove : moveState;
    switch (e.code) {
      case "KeyW": case "ArrowUp": target.forward = true; break;
      case "KeyS": case "ArrowDown": target.backward = true; break;
      case "KeyA": case "ArrowLeft": target.left = true; break;
      case "KeyD": case "ArrowRight": target.right = true; break;
      case "KeyE":
        if (currentMode === "fly") flyMove.up = true;
        break;
      case "KeyQ":
        if (currentMode === "fly") flyMove.down = true;
        break;
      case "Space":
        if (currentMode === "character") { moveState.jump = true; e.preventDefault(); }
        else if (currentMode === "fly") { flyMove.up = true; e.preventDefault(); }
        break;
      case "ShiftLeft":
        if (currentMode === "fly") flyMove.down = true;
        else moveState.sprint = true;
        break;
    }
  };

  const onKeyUp = (e) => {
    const target = currentMode === "fly" ? flyMove : moveState;
    switch (e.code) {
      case "KeyW": case "ArrowUp": target.forward = false; break;
      case "KeyS": case "ArrowDown": target.backward = false; break;
      case "KeyA": case "ArrowLeft": target.left = false; break;
      case "KeyD": case "ArrowRight": target.right = false; break;
      case "KeyE": if (currentMode === "fly") flyMove.up = false; break;
      case "KeyQ": if (currentMode === "fly") flyMove.down = false; break;
      case "Space":
        if (currentMode === "character") moveState.jump = false;
        else if (currentMode === "fly") flyMove.up = false;
        break;
      case "ShiftLeft":
        if (currentMode === "fly") flyMove.down = false;
        else moveState.sprint = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // ----- Update functions -----
  const updateFly = (delta) => {
    if (!flyControls.isLocked) return;
    const obj = flyControls.getObject();
    const speed = FLY_SPEED * (flyMove.sprint ? 2.5 : 1) * delta;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    if (flyMove.forward) obj.position.addScaledVector(forward, speed);
    if (flyMove.backward) obj.position.addScaledVector(forward, -speed);
    if (flyMove.right) obj.position.addScaledVector(right, speed);
    if (flyMove.left) obj.position.addScaledVector(right, -speed);
    if (flyMove.up) obj.position.y += speed;
    if (flyMove.down) obj.position.y -= speed;
  };

  const updateCharacter = (delta) => {
    if (!charControls.isLocked) return;
    const obj = charControls.getObject();
    const speed = MOVE_SPEED * (moveState.sprint ? 2 : 1);

    player.velocity.x -= player.velocity.x * 10 * delta;
    player.velocity.z -= player.velocity.z * 10 * delta;

    player.direction.z = Number(moveState.forward) - Number(moveState.backward);
    player.direction.x = Number(moveState.right) - Number(moveState.left);
    if (moveState.forward || moveState.backward) player.direction.normalize();
    if (moveState.left || moveState.right) player.direction.normalize();

    if (moveState.forward || moveState.backward)
      player.velocity.z -= player.direction.z * speed * delta * 10;
    if (moveState.left || moveState.right)
      player.velocity.x -= player.direction.x * speed * delta * 10;

    if (moveState.jump && player.onGround) {
      player.velocity.y = JUMP_SPEED * (moveState.sprint ? 1.3 : 1);
      player.onGround = false;
    }
    player.velocity.y -= GRAVITY * delta;

    charControls.moveRight(-player.velocity.x * delta);
    charControls.moveForward(-player.velocity.z * delta);
    obj.position.y += player.velocity.y * delta;

    if (obj.position.y < player.height) {
      obj.position.y = player.height;
      player.velocity.y = 0;
      player.onGround = true;
    }
  };

  // ----- Resize -----
  const resize = () => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    labelRenderer.setSize(w, h);
  };
  new ResizeObserver(resize).observe(container);
  resize();

  // ----- Loop -----
  const clock = new THREE.Clock();
  const tick = () => {
    requestAnimationFrame(tick);
    const delta = Math.min(clock.getDelta(), 0.1);

    if (currentMode === "orbit") orbit.update();
    else if (currentMode === "fly") updateFly(delta);
    else if (currentMode === "character") updateCharacter(delta);

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  };
  tick();

  // Default mode
  setMode("orbit");
};

main();
