// nav dropdowns: open on hover (or click/tap), one at a time
(() => {
  const all = [...document.querySelectorAll('nav .nv')];
  const closeAll = except => all.forEach(n => n !== except && n.classList.remove('open'));
  all.forEach(n => {
    n.addEventListener('mouseenter', () => { closeAll(n); n.classList.add('open'); });
    n.addEventListener('mouseleave', () => n.classList.remove('open'));
    n.querySelector('.it').addEventListener('click', e => { e.preventDefault(); closeAll(n); n.classList.toggle('open'); });
  });
  document.addEventListener('click', e => { if (!e.target.closest('nav .nv')) closeAll(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
})();
