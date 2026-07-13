// VEDIKA — shared interactions

document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? 'none' : 'flex';
      navLinks.style.cssText += open ? '' : 'position:absolute;top:100%;left:0;right:0;background:var(--bg);flex-direction:column;padding:24px 32px;border-bottom:1px solid var(--line);gap:18px;';
    });
  }

  // Quantity selectors
  document.querySelectorAll('.qty-box').forEach(box => {
    const input = box.querySelector('input');
    box.querySelector('.qty-minus')?.addEventListener('click', () => {
      input.value = Math.max(1, parseInt(input.value || '1', 10) - 1);
    });
    box.querySelector('.qty-plus')?.addEventListener('click', () => {
      input.value = parseInt(input.value || '1', 10) + 1;
    });
  });

  // Product tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs-wrap');
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      group.querySelector('#' + btn.dataset.tab).classList.add('active');
    });
  });

  // Gallery thumbs
  document.querySelectorAll('.gallery-thumbs .thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.gallery-thumbs .thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Blog filter tags (visual only)
  document.querySelectorAll('.blog-filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.blog-filter-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
    });
  });

  // Newsletter / contact form demo submit
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Thank you!';
        setTimeout(() => btn.textContent = original, 2200);
      }
      form.reset();
    });
  });

});
