const DEFAULT_CONFIG = {
  toggleKey: { ctrl: true, shift: false, alt: false, key: ' ' },
  reverseKey: { ctrl: true, shift: true, alt: false, key: ' ' },
  defaultSpeed: 2,
  defaultDirection: 'down',
  showHud: true
};

const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;

function formatShortcut(shortcut) {
  const parts = [];
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  const keyName = shortcut.key === ' ' ? 'Space' : shortcut.key;
  parts.push(keyName);
  return parts.join(' + ');
}

function setupShortcutInput(inputId, configKey) {
  const input = document.getElementById(inputId);
  input.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

    const shortcut = {
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      key: e.key
    };
    input.value = formatShortcut(shortcut);
    storage.sync.set({ [configKey]: shortcut });
  });
}

function init() {
  storage.sync.get(DEFAULT_CONFIG, (config) => {
    document.getElementById('toggleKey').value = formatShortcut(config.toggleKey);
    document.getElementById('reverseKey').value = formatShortcut(config.reverseKey);

    const speedInput = document.getElementById('defaultSpeed');
    speedInput.value = config.defaultSpeed;
    document.getElementById('speedValue').textContent = config.defaultSpeed;

    document.getElementById('defaultDirection').value = config.defaultDirection;
    document.getElementById('showHud').checked = config.showHud;
  });

  setupShortcutInput('toggleKey', 'toggleKey');
  setupShortcutInput('reverseKey', 'reverseKey');

  document.getElementById('defaultSpeed').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('speedValue').textContent = val;
    storage.sync.set({ defaultSpeed: val });
  });

  document.getElementById('defaultDirection').addEventListener('change', (e) => {
    storage.sync.set({ defaultDirection: e.target.value });
  });

  document.getElementById('showHud').addEventListener('change', (e) => {
    storage.sync.set({ showHud: e.target.checked });
  });
}

document.addEventListener('DOMContentLoaded', init);
