/* ============================================================
   LOADER.JS — Cinematic Intro Loader Logic
   ============================================================ */

class Loader {
  constructor() {
    this.loader    = document.getElementById('loader');
    this.fill      = document.querySelector('.loader-progress-fill');
    this.percent   = document.querySelector('.loader-percent');
    this.status    = document.querySelector('.loader-status');
    this.slideUp   = document.querySelector('.loader-slide-up');

    this.statuses = [
      'Initializing systems...',
      'Loading intelligence...',
      'Compiling creativity...',
      'Building experience...',
      'Almost ready...',
    ];
    this.statusIdx = 0;
    this.count = 0;
  }

  init() {
    this._countUp();
    this._cycleStatus();
    this._scheduleExit();
  }

  _countUp() {
    const target = 100;
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.count = Math.floor(eased * target);
      if (this.percent) this.percent.textContent = this.count + '%';
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  _cycleStatus() {
    if (!this.status) return;
    this.status.textContent = this.statuses[this.statusIdx];
    this.statusIdx++;
    if (this.statusIdx < this.statuses.length) {
      setTimeout(() => this._cycleStatus(), 380);
    }
  }

  _scheduleExit() {
    setTimeout(() => this._exit(), 2600);
  }

  _exit() {
    if (this.slideUp) {
      this.slideUp.classList.add('animate');
    }
    setTimeout(() => {
      if (this.loader) {
        this.loader.classList.add('hidden');
        document.body.style.overflow = '';
      }
      // Trigger hero entrance animations
      document.dispatchEvent(new CustomEvent('loaderDone'));
    }, 900);
  }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';
  const loader = new Loader();
  loader.init();
});