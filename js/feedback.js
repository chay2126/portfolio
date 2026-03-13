/* ============================================================
   FEEDBACK.JS — Star Rating + Form Submission
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const stars   = document.querySelectorAll('.star');
  const nameEl  = document.getElementById('feedback-name');
  const msgEl   = document.getElementById('feedback-msg');
  const submitBtn = document.getElementById('feedback-submit');
  const successEl = document.getElementById('feedback-success');
  const listEl  = document.getElementById('feedback-list');

  let selectedRating = 0;
  let feedbacks = JSON.parse(localStorage.getItem('cp_feedbacks') || '[]');

  // Render existing feedbacks
  _renderAll();

  // Star hover
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

  // Submit
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = nameEl?.value.trim();
      const msg  = msgEl?.value.trim();
      if (!name || !msg) return;

      const entry = {
        name,
        msg,
        rating: selectedRating || 5,
        date: new Date().toLocaleDateString()
      };

      feedbacks.unshift(entry);
      localStorage.setItem('cp_feedbacks', JSON.stringify(feedbacks));

      // Reset
      if (nameEl) nameEl.value = '';
      if (msgEl)  msgEl.value  = '';
      selectedRating = 0;
      stars.forEach(s => s.classList.remove('active'));

      // Show success
      if (successEl) successEl.classList.add('visible');
      setTimeout(() => successEl?.classList.remove('visible'), 3000);

      _renderAll();
    });
  }

  function _renderAll() {
    if (!listEl) return;
    listEl.innerHTML = feedbacks.slice(0, 5).map(f => `
      <div class="feedback-entry">
        <div class="feedback-entry-name">${f.name}</div>
        <div class="feedback-entry-stars">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}</div>
        <div class="feedback-entry-msg">${f.msg}</div>
      </div>
    `).join('');
  }
});