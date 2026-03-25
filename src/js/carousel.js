document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach(carousel => {
    let index = 0;
    let interval;
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));

    const dotsContainer = carousel.querySelector(".carousel-dots");
    const dots = [];

    // Append a clone of the first slide so forward looping is seamless
    const firstClone = slides[0].cloneNode(true);
    track.appendChild(firstClone);

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.addEventListener("click", () => {
        clearInterval(interval);
        goTo(i);
        autoplay();
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });

    const prev = carousel.querySelector(".carousel-arrow--left");
    const next = carousel.querySelector(".carousel-arrow--right");
    const autoplayDelay = parseInt(carousel.dataset.autoplay || 6000, 10);
    const transitionSpeed = parseInt(carousel.dataset.speed || 600, 10);

    track.style.transition = `transform ${transitionSpeed}ms ease`;

    function goTo(i) {
      index = Math.max(0, i);
      track.style.transform = `translateX(-${index * 100}%)`;
      const dotIndex = index % slides.length;
      dots.forEach((d, n) => d.classList.toggle("active", n === dotIndex));
    }

    // When the transition to the clone (index === slides.length) ends,
    // silently snap back to the real first slide
    track.addEventListener("transitionend", () => {
      if (index >= slides.length) {
        track.style.transition = "none";
        index = 0;
        track.style.transform = "translateX(0)";
        // Re-enable transition after the browser has painted the reset
        requestAnimationFrame(() => requestAnimationFrame(() => {
          track.style.transition = `transform ${transitionSpeed}ms ease`;
        }));
      }
    });

    function autoplay() {
      interval = setInterval(() => goTo(index + 1), autoplayDelay);
    }

    prev.addEventListener("click", () => {
      clearInterval(interval);
      goTo(Math.max(0, index - 1));
      autoplay();
    });

    next.addEventListener("click", () => {
      clearInterval(interval);
      goTo(index + 1);
      autoplay();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        clearInterval(interval);
        goTo(i);
        autoplay();
      });
    });

    /* mobile swipe */
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const swipeThreshold = 50;

    carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(interval);
    }, { passive: true });

    carousel.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener("touchend", () => {
      if (!isDragging) return;
      const diff = startX - currentX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) goTo(index + 1);
        else goTo(Math.max(0, index - 1));
      }
      isDragging = false;
      autoplay();
    });

    /* mouse drag */
    let mouseStartX = 0;
    let mouseCurrentX = 0;
    let isMouseDragging = false;

    carousel.addEventListener("mousedown", (e) => {
      mouseStartX = e.clientX;
      mouseCurrentX = e.clientX;
      isMouseDragging = true;
      clearInterval(interval);
      carousel.classList.add("is-dragging");
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isMouseDragging) return;
      mouseCurrentX = e.clientX;
    });

    function finishMouseDrag() {
      if (!isMouseDragging) return;
      const diff = mouseStartX - mouseCurrentX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) goTo(index + 1);
        else goTo(Math.max(0, index - 1));
      }
      isMouseDragging = false;
      carousel.classList.remove("is-dragging");
      autoplay();
    }

    carousel.addEventListener("mouseup", finishMouseDrag);
    carousel.addEventListener("mouseleave", finishMouseDrag);

    goTo(0);
    autoplay();
  });
});
