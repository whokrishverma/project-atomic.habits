// habit archive panel: opens in the right column from habits → habit archive
// (also from the "$ habit --archive" command inside the all-habits panel).
(() => {
  const $ = id => document.getElementById(id);
  const ap = $('arpnl'), np = $('newp');
  const km = $('keys-main'), kn = $('keys-new'), ka = $('keys-app');
  const tab = document.querySelector('nav .it[data-k="habits"]');
  const hide = p => { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); };

  // TODO: replace with the real archive once habits are persisted.
  // item: [name, icon key (see I in dashboard.js), icon colour]
  const archived = [['drink water', 'water', 'var(--cyan)']];

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const draw = () => {
    $('arsub').textContent = archived.length
      ? `// ${archived.length} archived habit${archived.length === 1 ? '' : 's'}`
      : '// no archived habits';
    $('arlist').innerHTML = archived.map(([n, k, c], i) =>
      `<div class="arh" data-i="${i}"><svg class="i" viewBox="0 0 16 16" style="color:${c}">${I[k]}</svg><span class="nm">${esc(n)}</span>` +
      `<button type="button" class="ar-resume" aria-label="resume ${esc(n)}">[resume]</button>` +
      `<button type="button" class="ar-del" aria-label="delete ${esc(n)}">[del]</button></div>`).join('');
  };
  $('arlist').addEventListener('click', e => {
    const b = e.target.closest('button'); const row = e.target.closest('.arh'); if (!b || !row) return;
    // TODO: [resume] should move the habit back to the active list; [del] should ask for confirmation and delete it for good.
    archived.splice(+row.dataset.i, 1); draw();
  });

  const close = () => {
    if (!ap.classList.contains('open')) return;
    hide(ap); ka.style.display = 'none'; km.style.display = 'flex'; tab.classList.remove('act');
  };
  const prevClose = window.__closeHelp;               // closes help, feedback, profile, overview and library panels
  const open = () => {
    if (np.classList.contains('open')) $('cancel').click();
    if (window.__closeAppearance) window.__closeAppearance();
    if (prevClose) prevClose();
    draw();
    ap.classList.add('open'); ap.setAttribute('aria-hidden', 'false'); ap.querySelector('.scroll').scrollTop = 0;
    km.style.display = 'none'; kn.style.display = 'none'; ka.style.display = 'flex'; tab.classList.add('act');
  };
  window.__closeHelp = () => { if (prevClose) prevClose(); close(); };

  document.querySelector('[data-open="archive"]').addEventListener('click', e => {
    e.preventDefault(); open(); e.currentTarget.closest('.nv').classList.remove('open');
  });
  // any other right-column panel (menu item or "+ habit") replaces this one
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if ((o && o.dataset.open !== 'archive') || e.target.closest('#addh')) close();
  }, true);
  $('arclose').addEventListener('click', close);
  // the "$ habit --archive" command in the all-habits panel opens this panel
  $('ovarch').addEventListener('click', () => document.querySelector('[data-open="archive"]').click());
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
