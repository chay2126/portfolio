/* ============================================================
   GSAP-ANIMATIONS.JS — Hero + Horizontal Story Scroll
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ─── HERO ENTRANCE (after loader exits) ─────────────────── */
document.addEventListener('loaderDone', () => {
  // Photo zoom

  // Label
  const label = document.querySelector('.hero-label');
  if (label) label.classList.add('in');

  // Name words
  document.querySelectorAll('.hero-name-line .word').forEach(w => w.classList.add('in'));

  // Tagline + typewriter
  setTimeout(() => {
    const tag = document.querySelector('.hero-tagline');
    if (tag) tag.classList.add('in');
    typewriter('typewriter', 'I build systems that think.', 55);
  }, 750);

  // Buttons
  setTimeout(() => {
    const ctas = document.querySelector('.hero-ctas');
    if (ctas) ctas.classList.add('in');
  }, 1100);
});

/* ─── TYPEWRITER ─────────────────────────────────────────── */
function typewriter(id, text, speed) {
  const el = document.getElementById(id);
  if (!el) return;
  let i = 0;
  el.textContent = '';
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed + Math.random() * 25);
    }
  };
  tick();
}

/* ─── INIT ON DOM READY ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Hero content fade on scroll ── */
  gsap.to('.hero-content', {
    yPercent: -12,
    opacity: 0.2,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: '50% top',
      end: 'bottom top',
      scrub: true,
    }
  });

  /* ── Horizontal Story Scroll ── */
  const track = document.querySelector('.story-track');

  if (track) {
    const panels    = gsap.utils.toArray('.story-panel');
    const numPanels = panels.length;

    // Pin the entire story section and move the track horizontally
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: '#story',
        pin: '.story-track-wrap',
        scrub: 1.2,
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth),
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (numPanels - 1));
          document.querySelectorAll('.story-progress-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
          });
        },
        onEnter: () => document.querySelector('.story-progress')?.classList.add('visible'),
        onLeave: () => document.querySelector('.story-progress')?.classList.remove('visible'),
        onEnterBack: () => document.querySelector('.story-progress')?.classList.add('visible'),
        onLeaveBack: () => document.querySelector('.story-progress')?.classList.remove('visible'),
      }
    });
  }

  /* ── Add progress dots dynamically ── */
  const panels = document.querySelectorAll('.story-panel');
  if (panels.length > 0) {
    const prog = document.createElement('div');
    prog.className = 'story-progress';
    panels.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'story-progress-dot' + (i === 0 ? ' active' : '');
      prog.appendChild(dot);
    });
    document.body.appendChild(prog);
  }

});