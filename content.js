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

function matchesShortcut(e, shortcut) {
  return e.ctrlKey === shortcut.ctrl &&
    e.shiftKey === shortcut.shift &&
    e.altKey === shortcut.alt &&
    e.key === shortcut.key;
}

document.addEventListener('keydown', (e) => {
  if (matchesShortcut(e, config.toggleKey)) {
    e.preventDefault();
    if (state.active) {
      stopScroll();
    } else {
      startScroll();
    }
    return;
  }

  if (state.active && matchesShortcut(e, config.reverseKey)) {
    e.preventDefault();
    state.direction = state.direction === 'down' ? 'up' : 'down';
    updateHud();
    return;
  }

  if (state.active) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      adjustSpeed(SPEED_STEP);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      adjustSpeed(-SPEED_STEP);
    }
  }
});

document.addEventListener('mousedown', (e) => {
  if (e.button === 1) {
    state.middleButtonDown = true;
  }
});

document.addEventListener('mouseup', (e) => {
  if (e.button === 1) {
    state.middleButtonDown = false;
  }
});

document.addEventListener('wheel', (e) => {
  if (state.active && state.middleButtonDown) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -SPEED_STEP : SPEED_STEP;
    adjustSpeed(delta);
  }
}, { passive: false });
