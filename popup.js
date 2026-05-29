const DEFAULT_CONFIG = {
  toggleKey: { ctrl: true, shift: false, alt: false, key: ' ' },
  speedUpKey: { ctrl: false, shift: false, alt: false, key: 'ArrowUp' },
  speedDownKey: { ctrl: false, shift: false, alt: false, key: 'ArrowDown' },
  defaultSpeed: 2,
  defaultDirection: 'down',
  showHud: true,
  lang: ''
};

const I18N = {
  zh: {
    toggleKey: '启动 / 停止',
    speedUpKey: '加速',
    speedDownKey: '减速',
    speed: '速度',
    direction: '方向',
    dirDown: '↓ 向下',
    dirUp: '↑ 向上',
    hud: 'HUD 浮层',
    help: '快捷键启停 · 快捷键或按住中键滚轮调速'
  },
  en: {
    toggleKey: 'Start / Stop',
    speedUpKey: 'Speed Up',
    speedDownKey: 'Speed Down',
    speed: 'Speed',
    direction: 'Direction',
    dirDown: '↓ Down',
    dirUp: '↑ Up',
    hud: 'HUD Overlay',
    help: 'Start with shortcut · Speed keys or hold middle + wheel to adjust'
  }
};

const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
let currentLang = 'en';

function detectLang() {
  const navLang = navigator.language.toLowerCase();
  return navLang.startsWith('zh') ? 'zh' : 'en';
}

function setLang(lang) {
  currentLang = lang;
  const t = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t[el.dataset.i18n] || el.textContent;
  });
  document.querySelectorAll('.lang-option').forEach((el) => {
    el.classList.toggle('active', el.dataset.lang === lang);
  });
  // Update direction select options
  const dirSelect = document.getElementById('defaultDirection');
  dirSelect.options[0].textContent = t.dirDown;
  dirSelect.options[1].textContent = t.dirUp;
  storage.sync.set({ lang });
}

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
    document.getElementById('speedUpKey').value = formatShortcut(config.speedUpKey);
    document.getElementById('speedDownKey').value = formatShortcut(config.speedDownKey);

    const speedInput = document.getElementById('defaultSpeed');
    speedInput.value = config.defaultSpeed;
    document.getElementById('speedValue').textContent = config.defaultSpeed;

    document.getElementById('defaultDirection').value = config.defaultDirection;
    document.getElementById('showHud').checked = config.showHud;

    const lang = config.lang || detectLang();
    setLang(lang);
  });

  document.querySelectorAll('.lang-option').forEach((el) => {
    el.addEventListener('click', () => setLang(el.dataset.lang));
  });

  setupShortcutInput('toggleKey', 'toggleKey');
  setupShortcutInput('speedUpKey', 'speedUpKey');
  setupShortcutInput('speedDownKey', 'speedDownKey');

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
