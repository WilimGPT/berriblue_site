document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".work-slideshow").forEach(slideshow => {
    const track = slideshow.querySelector(".work-slideshow__track");
    const originalItems = Array.from(slideshow.querySelectorAll(".work-slideshow__item"));
    const prevBtn = slideshow.querySelector(".work-slideshow__arrow--left");
    const nextBtn = slideshow.querySelector(".work-slideshow__arrow--right");

    const autoplayDelay = parseInt(slideshow.dataset.autoplay || 3500, 10);
    const animDuration = parseInt(slideshow.dataset.speed || 500, 10);
    let autoplayInterval;

    // Append clones of all items so the track is 2x wide
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    function getGap() {
      return parseFloat(getComputedStyle(track).gap) || 0;
    }

    function originalWidth() {
      const gap = getGap();
      return originalItems.reduce((sum, item) => sum + item.offsetWidth + gap, 0);
    }

    function offsetOf(index) {
      const gap = getGap();
      let left = 0;
      for (let i = 0; i < index; i++) left += originalItems[i].offsetWidth + gap;
      return left;
    }

    function currentIndex() {
      const ow = originalWidth() || 1;
      const scroll = track.scrollLeft % ow;
      const gap = getGap();
      let accumulated = 0;
      for (let i = 0; i < originalItems.length - 1; i++) {
        if (scroll <= accumulated + originalItems[i].offsetWidth / 2) return i;
        accumulated += originalItems[i].offsetWidth + gap;
      }
      return originalItems.length - 1;
    }

    // Suppress the scroll-reset listener while a smooth scroll is in flight,
    // then reset scrollLeft after the animation lands in the clone section.
    let isSmoothScrolling = false;
    let smoothScrollTimeout;

    function smoothScrollTo(left) {
      isSmoothScrolling = true;
      clearTimeout(smoothScrollTimeout);
      track.scrollTo({ left, behavior: "smooth" });
      smoothScrollTimeout = setTimeout(() => {
        isSmoothScrolling = false;
        const ow = originalWidth();
        if (ow > 0 && track.scrollLeft >= ow) {
          track.scrollLeft -= ow;
        }
      }, animDuration + 100);
    }

    // When the user native-scrolls into the clone section, silently wrap back
    track.addEventListener("scroll", () => {
      if (isSmoothScrolling) return;
      const ow = originalWidth();
      if (ow > 0 && track.scrollLeft >= ow) {
        track.scrollLeft -= ow;
      }
    }, { passive: true });

    function next() {
      const i = currentIndex();
      const ow = originalWidth();
      if (i >= originalItems.length - 1) {
        // Scroll into clone section (clone of item 0 starts at ow)
        smoothScrollTo(ow);
      } else {
        smoothScrollTo(offsetOf(i + 1));
      }
    }

    function prev() {
      smoothScrollTo(offsetOf(Math.max(0, currentIndex() - 1)));
    }

    function startAutoplay() {
      autoplayInterval = setInterval(next, autoplayDelay);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    nextBtn.addEventListener("click", () => { next(); resetAutoplay(); });
    prevBtn.addEventListener("click", () => { prev(); resetAutoplay(); });

    /* mouse drag — scrollLeft follows cursor directly */
    let isDragging = false;
    let dragStartX = 0;
    let scrollAtDragStart = 0;

    track.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      scrollAtDragStart = track.scrollLeft;
      clearTimeout(smoothScrollTimeout);
      isSmoothScrolling = false;
      clearInterval(autoplayInterval);
      slideshow.classList.add("is-dragging");
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      track.scrollLeft = scrollAtDragStart - (e.clientX - dragStartX);
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      slideshow.classList.remove("is-dragging");
      startAutoplay();
    });

    startAutoplay();
  });
});
