/* ============================================================
   GSAP-ANIMATIONS.JS — Hero Animations + ScrollTrigger
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ─── HERO ENTRANCE (fires after loader) ─────────────────── */
document.addEventListener('loaderDone', () => {
  // Image zoom in
  const heroImg = document.querySelector('.hero-bg-img');
  if (heroImg) {
    heroImg.classList.add('loaded');
  }

  // Label
  const label = document.querySelector('.hero-label');
  if (label) label.classList.add('in');

  // Name lines
  document.querySelectorAll('.hero-name-line .word').forEach(w => {
    w.classList.add('in');
  });

  // Tagline typewriter
  setTimeout(() => {
    const tagline = document.querySelector('.hero-tagline');
    if (tagline) tagline.classList.add('in');
    _typewriter('typewriter', 'I build systems that think.', 55);
  }, 750);

  // Buttons
  setTimeout(() => {
    const ctas = document.querySelector('.hero-ctas');
    if (ctas) ctas.classList.add('in');
  }, 1100);
});

/* ─── TYPEWRITER ─────────────────────────────────────────── */
function _typewriter(elId, text, speed) {
  const el = document.getElementById(elId);
  if (!el) return;
  let i = 0;
  el.textContent = '';
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed + Math.random() * 30);
    }
  };
  tick();
}

/* ─── HERO PARALLAX ON SCROLL ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Hero bg parallax
  gsap.to('.hero-bg-img', {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // Hero content slides up on scroll
  gsap.to('.hero-content', {
    yPercent: -15,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'center top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // 3D canvas fades out
  gsap.to('#three-canvas', {
    opacity: 0,
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: '60% top',
      end: 'bottom top',
      scrub: true,
    }
  });
});