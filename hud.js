let hudElement = null;
let hudFadeTimer = null;

function createHud() {
  hudElement = document.createElement('div');
  hudElement.id = 'autoscroll-hud';
  hudElement.innerHTML = `
    <div class="status"><span class="direction">↓</span> <span class="state">Stopped</span></div>
    <div class="speed-bar"><div class="speed-bar-fill"></div></div>
  `;
  document.body.appendChild(hudElement);
}

function updateHud() {
  if (!hudElement || !config.showHud) return;

  const dirArrow = state.direction === 'down' ? '↓' : '↑';
  const stateText = state.active ? `${state.speed.toFixed(1)} px/f` : 'Stopped';

  hudElement.querySelector('.direction').textContent = dirArrow;
  hudElement.querySelector('.state').textContent = stateText;

  const fill = ((state.speed - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100;
  hudElement.querySelector('.speed-bar-fill').style.width = `${fill}%`;

  if (state.active) {
    hudElement.classList.add('visible');
    hudElement.classList.remove('faded');
    clearTimeout(hudFadeTimer);
    hudFadeTimer = setTimeout(() => {
      hudElement.classList.add('faded');
    }, 3000);
  } else {
    hudElement.classList.remove('visible', 'faded');
  }
}

function updateHudVisibility(show) {
  if (!hudElement) return;
  if (!show) {
    hudElement.classList.remove('visible', 'faded');
  } else if (state.active) {
    updateHud();
  }
}

if (document.body) {
  createHud();
} else {
  document.addEventListener('DOMContentLoaded', createHud);
}
