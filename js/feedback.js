document.addEventListener('DOMContentLoaded', () => {
  const stars     = document.querySelectorAll('.star');
  const nameEl    = document.getElementById('feedback-name');
  const msgEl     = document.getElementById('feedback-msg');
  const submitBtn = document.getElementById('feedback-submit');
  const successEl = document.getElementById('feedback-success');

  let selectedRating = 0;

  stars.forEach((star, i) => {
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, j) => s.classList.toggle('hovered', j <= i));
    });
    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hovered'));
    });
    star.addEventListener('click', () => {
      selectedRating = i + 1;
      stars.forEach((s, j) => s.classList.toggle('active', j < selectedRating));
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = nameEl?.value.trim();
      const msg  = msgEl?.value.trim();
      if (!name || !msg) return;

      fetch('https://formspree.io/f/xjgaeywb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message: msg, rating: selectedRating || 5 })
      });

      if (nameEl) nameEl.value = '';
      if (msgEl)  msgEl.value  = '';
      selectedRating = 0;
      stars.forEach(s => s.classList.remove('active'));

      if (successEl) successEl.classList.add('visible');
      setTimeout(() => successEl?.classList.remove('visible'), 3000);
    });
  }
});