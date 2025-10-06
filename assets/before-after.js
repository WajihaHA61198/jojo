document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.ba-slider');
  if (!slider) return;

  const before = slider.children[0];
  const after = slider.children[1];

  const handle = document.createElement('div');
  handle.className = 'ba-handle';
  slider.appendChild(handle);
  handle.innerHTML = `<span class="ba-arrows"><span>←</span> <span>→</span></span>`;

  after.style.clipPath = 'inset(0 0 0 50%)';
  handle.style.left = '50%';

  let isDragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));

    after.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    handle.style.left = `${position}%`;
  }

  // Mouse events
  handle.addEventListener('mousedown', () => {
    isDragging = true;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      setPosition(e.clientX);
    }
  });

  // Touch events
  handle.addEventListener('touchstart', () => {
    isDragging = true;
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      setPosition(e.touches[0].clientX);
    }
  });
});
