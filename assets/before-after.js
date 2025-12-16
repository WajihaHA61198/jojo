function initBeforeAfterSliders(scope = document) {
  const sliders = scope.querySelectorAll('.ba-slider');
  if (!sliders.length) return;

  sliders.forEach(slider => {
    // prevent re-initialization
    if (slider.classList.contains('ba-initialized')) return;
    slider.classList.add('ba-initialized');

    const before = slider.querySelector('.ba-before');
    const after = slider.querySelector('.ba-after');
    if (!before || !after) return;

    // create handle
    const handle = document.createElement('div');
    handle.className = 'ba-handle';
    handle.innerHTML = `<span class="ba-arrows"><span>←</span><span>→</span></span>`;
    slider.appendChild(handle);

    // default positions
    after.style.clipPath = 'inset(0 0 0 50%)';
    handle.style.left = '50%';

    let isDragging = false;

    const setPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      after.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
      handle.style.left = `${pos}%`;
    };

    // mouse events
    handle.addEventListener('mousedown', () => (isDragging = true));
    document.addEventListener('mouseup', () => (isDragging = false));
    document.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });

    // touch events
    handle.addEventListener('touchstart', () => (isDragging = true));
    document.addEventListener('touchend', () => (isDragging = false));
    document.addEventListener('touchmove', (e) => {
      if (isDragging) setPosition(e.touches[0].clientX);
    });
  });
}

// initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSliders();
});

// initialize inside Shopify Theme Editor (when section is added or reloaded)
document.addEventListener('shopify:section:load', (event) => {
  initBeforeAfterSliders(event.target);
});

