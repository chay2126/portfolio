/* ============================================================
   GSAP-ANIMATIONS.JS — Hero + Story + Scroll Reveals + Polish
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ─── HERO ENTRANCE ──────────────────────────────────────── */
document.addEventListener('loaderDone', () => {
  const label = document.querySelector('.hero-label');
  if (label) label.classList.add('in');
  document.querySelectorAll('.hero-name-line .word').forEach(w => w.classList.add('in'));
  setTimeout(() => {
    document.querySelector('.hero-tagline')?.classList.add('in');
    typewriter('typewriter', 'I build systems that think.', 52);
  }, 750);
  setTimeout(() => {
    document.querySelector('.hero-ctas')?.classList.add('in');
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
      setTimeout(tick, speed + Math.random() * 20);
    }
  };
  tick();
}

/* ─── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════
     HERO — fade out on scroll
  ════════════════════════════════════════ */
  gsap.to('.hero-content', {
    yPercent: -15,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: '40% top',
      end: 'bottom top',
      scrub: true,
    }
  });

  /* ════════════════════════════════════════
     STORY — Horizontal Pinned Scroll (desktop only)
  ════════════════════════════════════════ */
  const track = document.querySelector('.story-track');
  if (track && window.innerWidth > 768) {
    const panels = gsap.utils.toArray('.story-panel');
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
          const idx = Math.round(self.progress * (panels.length - 1));
          document.querySelectorAll('.story-progress-dot').forEach((d, i) => {
            d.classList.toggle('active', i === idx);
          });
        },
        onEnter:     () => document.querySelector('.story-progress')?.classList.add('visible'),
        onLeave:     () => document.querySelector('.story-progress')?.classList.remove('visible'),
        onEnterBack: () => document.querySelector('.story-progress')?.classList.add('visible'),
        onLeaveBack: () => document.querySelector('.story-progress')?.classList.remove('visible'),
      }
    });
    // Progress dots
    const prog = document.createElement('div');
    prog.className = 'story-progress';
    panels.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'story-progress-dot' + (i === 0 ? ' active' : '');
      prog.appendChild(dot);
    });
    document.body.appendChild(prog);
  }

  /* ════════════════════════════════════════
     SECTION LABELS — slide in from left
  ════════════════════════════════════════ */
  gsap.utils.toArray('.s-label').forEach(el => {
    gsap.from(el, {
      opacity: 0, x: -24, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 98%', toggleActions: 'play none none none' }
    });
  });

  /* ════════════════════════════════════════
     SECTION TITLES — cinematic slide up
  ════════════════════════════════════════ */
  gsap.utils.toArray('.s-title').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 70, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' }
    });
  });

  /* ════════════════════════════════════════
     SKILLS — grid cells stagger in
  ════════════════════════════════════════ */
  document.querySelectorAll('.skill-group').forEach(el => {
    el.classList.remove('reveal');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  /* ════════════════════════════════════════
     PROJECTS — rows fly in from left
  ════════════════════════════════════════ */
  document.querySelectorAll('.project-row').forEach(el => el.classList.remove('reveal'));

  gsap.utils.toArray('.project-row').forEach((row, i) => {
    gsap.from(row, {
      opacity: 0, x: -60, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: row, start: 'top 98%', toggleActions: 'play none none none' }
    });
  });

  /* ════════════════════════════════════════
     EXPERIENCE — timeline reveal
  ════════════════════════════════════════ */
  gsap.from('.exp-timeline-line', {
    scaleY: 0, transformOrigin: 'top', duration: 1.5, ease: 'power2.inOut',
    scrollTrigger: { trigger: '.exp-timeline', start: 'top 95%', toggleActions: 'play none none none' }
  });

  gsap.from('.exp-dot', {
    scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(3)',
    scrollTrigger: { trigger: '.exp-dot', start: 'top 95%', toggleActions: 'play none none none' }
  });

  gsap.from('.exp-card', {
    opacity: 0, x: -40, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.exp-card', start: 'top 95%', toggleActions: 'play none none none' }
  });

  gsap.utils.toArray('.edu-item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, x: 30, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: item, start: 'top 98%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('.cert-item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, y: 15, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: item, start: 'top 98%', toggleActions: 'play none none none' }
    });
  });

  /* ════════════════════════════════════════
     CONTACT — dramatic entrance
  ════════════════════════════════════════ */
  gsap.from('.contact-title', {
    opacity: 0, y: 90, duration: 1.2, ease: 'power4.out',
    scrollTrigger: { trigger: '#contact', start: 'top 90%', toggleActions: 'play none none none' }
  });

  gsap.from('.contact-email', {
    opacity: 0, y: 30, duration: 0.8, delay: 0.25, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-email', start: 'top 98%', toggleActions: 'play none none none' }
  });

  gsap.from('.contact-btns .btn', {
    opacity: 0, y: 20, duration: 0.5, stagger: 0.1, delay: 0.35, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-btns', start: 'top 98%', toggleActions: 'play none none none' }
  });

  /* ════════════════════════════════════════
     FEEDBACK — slide up
  ════════════════════════════════════════ */
  gsap.from('.feedback-inner', {
    opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#feedback', start: 'top 95%', toggleActions: 'play none none none' }
  });

  /* ════════════════════════════════════════
     SECTION COLOR TRANSITIONS
  ════════════════════════════════════════ */
  const colorMap = {
    '#hero':       '#0066FF',
    '#story':      '#00F5FF',
    '#skills':     '#39FF14',
    '#projects':   '#FF9500',
    '#experience': '#A855F7',
    '#contact':    '#FF2D55',
    '#feedback':   '#FF2D55',
  };
  Object.entries(colorMap).forEach(([id, color]) => {
    const el = document.querySelector(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter:     () => document.documentElement.style.setProperty('--accent', color),
      onEnterBack: () => document.documentElement.style.setProperty('--accent', color),
    });
  });

  /* ════════════════════════════════════════
     HORIZONTAL RULE LINES — width expand
  ════════════════════════════════════════ */
  gsap.utils.toArray('.s-label::before').forEach(el => {
    if (!el) return;
    gsap.from(el, { scaleX: 0, transformOrigin: 'left', duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 98%', toggleActions: 'play none none none' }
    });
  });

});