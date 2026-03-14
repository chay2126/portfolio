/* ============================================================
   FLOATING-ICONS.JS — Mouse-reactive drifting tech icons
   ============================================================ */

class FloatingIcons {
  constructor(canvasId) {
    this.canvas  = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx     = this.canvas.getContext('2d');
    this.icons   = [];
    this.mouse   = { x: -999, y: -999 };
    this.raf     = null;

    this.SYMBOLS = [
      '{ }', '</>', 'def', '#!/', 'AI',
      'import', 'API', 'SQL', '>>>',
      'py', 'git', '#ML', 'NLP', '∑',
      'λ', '01', 'http', 'JSON', 'class'
    ];

    this.COLORS = [
      'rgba(0,102,255,',
      'rgba(0,245,255,',
      'rgba(57,255,20,',
      'rgba(255,149,0,',
      'rgba(168,85,247,',
    ];
  }

  init() {
    this._resize();
    this._spawn();
    this._bindEvents();
    this._loop();
  }

  _resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _spawn() {
    const count = Math.floor(window.innerWidth / 50);
    for (let i = 0; i < count; i++) {
      this.icons.push(this._makeIcon(true));
    }
  }

  _makeIcon(randomY = false) {
    const size = 22 + Math.random() * 26;
    const color = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    return {
      text:    this.SYMBOLS[Math.floor(Math.random() * this.SYMBOLS.length)],
      x:       Math.random() * this.canvas.width,
      y:       randomY ? Math.random() * this.canvas.height : this.canvas.height + 30,
      vx:      (Math.random() - 0.5) * 0.35,
      vy:      -(0.25 + Math.random() * 0.4),
      size,
      alpha:   0.45 + Math.random() * 0.45,
      color,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      mx: 0, my: 0,   // mouse repulsion velocity
    };
  }

  _bindEvents() {
    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('resize', () => {
      this._resize();
    });
  }

  _loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.icons.forEach((icon, i) => {
      // Mouse repulsion
      const dx = icon.x - this.mouse.x;
      const dy = icon.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 120;

      if (dist < repelRadius) {
        const force = (repelRadius - dist) / repelRadius;
        icon.mx += (dx / dist) * force * 1.8;
        icon.my += (dy / dist) * force * 1.8;
      }

      // Dampen mouse velocity
      icon.mx *= 0.88;
      icon.my *= 0.88;

      // Move
      icon.x += icon.vx + icon.mx;
      icon.y += icon.vy + icon.my;
      icon.rotation += icon.rotSpeed;

      // Wrap horizontally
      if (icon.x < -50)  icon.x = this.canvas.width + 50;
      if (icon.x > this.canvas.width + 50) icon.x = -50;

      // Reset when off top
      if (icon.y < -50) {
        this.icons[i] = this._makeIcon(false);
        return;
      }

      // Draw
      this.ctx.save();
      this.ctx.translate(icon.x, icon.y);
      this.ctx.rotate(icon.rotation);
      this.ctx.font = `${icon.size}px 'DM Mono', monospace`;
      this.ctx.fillStyle = `${icon.color}${icon.alpha})`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(icon.text, 0, 0);
      this.ctx.restore();
    });

    this.raf = requestAnimationFrame(() => this._loop());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const fi = new FloatingIcons('floating-icons-canvas');
  fi.init();
});