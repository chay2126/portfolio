/* ============================================================
   MAIN.JS — Initialise All Modules
   ============================================================ */

// Section accent colors for cursor + nav sync
const SECTION_COLORS = {
  'section-hero':       '#0066FF',
  'section-story':      '#00F5FF',
  'section-skills':     '#39FF14',
  'section-projects':   '#FF9500',
  'section-experience': '#A855F7',
  'section-contact':    '#FF2D55',
  'section-feedback':   '#FF2D55',
};

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL EFFECT
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ── ACTIVE NAV LINK
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        // Update nav links
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });

        // Update accent color on root + cursor
        const cls = entry.target.classList;
        for (const [key, color] of Object.entries(SECTION_COLORS)) {
          if (cls.contains(key)) {
            document.documentElement.style.setProperty('--accent', color);
            if (window.cursor) window.cursor.updateColor(color);
            break;
          }
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── SCROLL REVEAL (for non-GSAP elements)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.style.transition =
            `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
             transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        }, 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach((el, i) => {
      el.dataset.delay = el.dataset.delay || (i % 5) * 80;
      revealObserver.observe(el);
    });

});