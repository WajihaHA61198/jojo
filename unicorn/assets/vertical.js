document.addEventListener("DOMContentLoaded", function() {
  const wrapper = document.querySelector(".vs-wrapper");
  const slides = document.querySelectorAll(".vs-slide");
  const dots = document.querySelectorAll(".vs-dot");
  let currentIndex = 0;
  let isScrolling = false;
  let sliderLocked = true; // page scroll locked initially

  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentIndex = index;
    wrapper.style.transform = `translateY(-${index * 100}vh)`;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");

    // last slide → unlock page scroll
    if (currentIndex === slides.length - 1) {
      sliderLocked = false;
      document.body.style.overflow = "auto";
    } else {
      sliderLocked = true;
      document.body.style.overflow = "hidden";
    }
  }

  function handleScroll(e) {
    if (!sliderLocked) return; // allow normal page scroll if unlocked
    e.preventDefault();

    if (isScrolling) return;
    isScrolling = true;

    if (e.deltaY > 0) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(currentIndex - 1);
    }

    setTimeout(() => isScrolling = false, 800);
  }

  // lock scroll initially
  document.body.style.overflow = "hidden";

  // wheel
  window.addEventListener("wheel", handleScroll, { passive: false });

  // dots
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      goToSlide(parseInt(dot.dataset.index));
    });
  });

  // swipe (touch)
  let startY = 0;
  window.addEventListener("touchstart", e => startY = e.touches[0].clientY);
  window.addEventListener("touchend", e => {
    if (!sliderLocked) return;
    let endY = e.changedTouches[0].clientY;
    let diff = startY - endY;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentIndex + 1);
      else goToSlide(currentIndex - 1);
    }
  });
});
