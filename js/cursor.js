/* ============================================================
   CURSOR.JS — Custom Magnetic Cursor
   ============================================================ */

class Cursor {
  constructor() {
    this.dot    = document.getElementById('cursor-dot');
    this.ring   = document.getElementById('cursor-ring');
    this.mx = 0; this.my = 0;
    this.rx = 0; this.ry = 0;
    this.raf = null;
  }

  init() {
    if (!this.dot || !this.ring) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    document.addEventListener('mousemove', (e) => {
      this.mx = e.clientX;
      this.my = e.clientY;
    });

    document.addEventListener('mousedown', () => {
      this.ring.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      this.ring.classList.remove('clicking');
    });

    // Hover detection
    const hoverEls = document.querySelectorAll('a, button, .project-card, .skill-tag, .cert-item');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => this.ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => this.ring.classList.remove('hovering'));
    });

    this._animate();
  }

  _animate() {
    // Dot follows cursor instantly
    this.dot.style.left = this.mx + 'px';
    this.dot.style.top  = this.my + 'px';

    // Ring follows with lag (lerp)
    this.rx += (this.mx - this.rx) * 0.1;
    this.ry += (this.my - this.ry) * 0.1;
    this.ring.style.left = this.rx + 'px';
    this.ring.style.top  = this.ry + 'px';

    this.raf = requestAnimationFrame(() => this._animate());
  }

  updateColor(color) {
    if (this.dot)  this.dot.style.background  = color;
    if (this.ring) this.ring.style.borderColor = color;
  }
}

window.cursor = new Cursor();
document.addEventListener('DOMContentLoaded', () => window.cursor.init());