const DEFAULT_CONFIG = {
  toggleKey: { ctrl: true, shift: false, alt: false, key: ' ' },
  reverseKey: { ctrl: true, shift: true, alt: false, key: ' ' },
  defaultSpeed: 2,
  defaultDirection: 'down',
  showHud: true
};

const SPEED_MIN = 0.5;
const SPEED_MAX = 20;
const SPEED_STEP = 0.5;

let config = { ...DEFAULT_CONFIG };
let state = {
  active: false,
  speed: config.defaultSpeed,
  direction: config.defaultDirection,
  rafId: null,
  middleButtonDown: false
};

function loadConfig() {
  const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
  storage.sync.get(DEFAULT_CONFIG, (result) => {
    config = result;
    state.speed = config.defaultSpeed;
    state.direction = config.defaultDirection;
  });
}

function onStorageChange(changes) {
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key in config) {
      config[key] = newValue;
    }
  }
  if (changes.showHud) {
    updateHudVisibility(config.showHud);
  }
}

const storageApi = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
storageApi.sync.onChanged.addListener(onStorageChange);
loadConfig();

function scrollLoop() {
  if (!state.active) return;
  const px = state.direction === 'down' ? state.speed : -state.speed;
  window.scrollBy(0, px);
  state.rafId = requestAnimationFrame(scrollLoop);
}

function startScroll() {
  state.active = true;
  state.rafId = requestAnimationFrame(scrollLoop);
  updateHud();
}

function stopScroll() {
  state.active = false;
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
  updateHud();
}

function adjustSpeed(delta) {
  state.speed = Math.min(SPEED_MAX, Math.max(SPEED_MIN, state.speed + delta));
  updateHud();
}
