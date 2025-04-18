(() => {
    const windowHeight = window.innerHeight;
    const mobile = /Mobi/.test(navigator.userAgent);
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const windowHeightExtra =
      safari && !mobile
        ? window.outerHeight - window.innerHeight
        : mobile
        ? (window.screen.availHeight - window.innerHeight) / 2
        : 0;

    function positionParallax(rect, speed, elements, i) {
      const offset = rect.top / speed - windowHeightExtra;
      elements[i].style.top = offset + 'px';
    }

    function calculateHeight(elements, speed) {
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const rect = el.parentElement.parentElement.getBoundingClientRect();
        const offsetTop = el.parentElement.parentElement.offsetTop;
        const midOffset = (windowHeight - rect.height) / 2;
        const height =
          windowHeight > rect.height + offsetTop
            ? rect.height + offsetTop - offsetTop / speed
            : rect.height + 2 * (midOffset - midOffset / speed);

        el.style.height = height + 2 * windowHeightExtra + 'px';
        positionParallax(rect, speed, elements, i);
      }
    }

    function animateParallax(elements, speed) {
      for (let i = 0; i < elements.length; i++) {
        const rect = elements[i].parentElement.parentElement.getBoundingClientRect();
        if (rect.top + rect.height >= 0 && rect.top <= windowHeight) {
          positionParallax(rect, speed, elements, i);
        }
      }
    }

    document.addEventListener('DOMContentLoaded', function () {
      const speed = 4;
      const className = 'parallax';
      const elements = document.getElementsByClassName(className);

      for (let i = 0; i < elements.length; i++) {
        const wrapper = document.createElement('div');
        elements[i].parentNode.insertBefore(wrapper, elements[i]);
        wrapper.appendChild(elements[i]);
        wrapper.classList.add('parallax__container_para');
        wrapper.parentElement.style.position = 'relative';

        const image = elements[i].dataset.parallaxImage;
        if (image) {
          elements[i].style.backgroundImage = `url(${image})`;
        }
      }

      calculateHeight(elements, speed);

      if (!mobile) {
        window.addEventListener('resize', () => {
          calculateHeight(elements, speed);
        });
      }

      window.addEventListener('scroll', () => {
        animateParallax(elements, speed);
      });
    });
  })();