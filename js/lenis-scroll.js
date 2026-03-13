/* ============================================================
   LENIS-SCROLL.JS — Buttery Smooth Scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Init Lenis
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1.0,
    smoothTouch: false,
  });

  // Connect to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Expose globally
  window.lenis = lenis;
});