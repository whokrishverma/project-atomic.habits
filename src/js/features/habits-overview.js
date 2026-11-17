// "all habits" panel: opens in the right column from habits → all habits
(() => {
  const $ = id => document.getElementById(id);
  const ov = $('ovpnl'), np = $('newp');
  const km = $('keys-main'), kn = $('keys-new'), ka = $('keys-app');
  const tab = document.querySelector('nav .it[data-k="habits"]');
  const hide = p => { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); };

  // TODO: replace with the real habit list once habits are persisted.
  // Colours match the identity colours used in the suggestions list (dashboard.js).
  const flame = '<svg class="i f" viewBox="0 0 16 16"><path d="M8 1c1 3 4 4.500 4 8.500A4 4 0 0 1 4 9.500C4 8 5 7 5.500 6 6.500 7 7 7 7 7 7.500 5 7 3 8 1z"/></svg>';
  const cal = '<svg class="i f" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3 2.500h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM3.500 6v6.500h9V6zM5 8h1.200v1.200H5zm2.400 0h1.200v1.200H7.400zM9.800 8H11v1.200H9.800zM5 10.300h1.200v1.200H5zm2.400 0h1.200v1.200H7.400z"/></svg>';
  const cake = '<path d="M2 14h12M3 14v-3h10v3M4 11V8h8v3M8 8V5M8 5c-1-1 0-2 0-3 1 1 1 2 0 3z"/>';
  const icon = (k, c) => `<svg class="i" viewBox="0 0 16 16" style="color:${c}">${k === 'cake' ? cake : I[k]}</svg>`;
  const T = '#e6edf3';
  const habits = [
    { n: 'no sugar',           k: 'cake',     c: 'var(--red)', meta: ['ends may 16'] },
    { n: 'stretch',            k: 'stretch',  c: T,            meta: ['goal: 3 times per day'] },
    { n: 'read',               k: 'read',     c: '#e8913a',    meta: ['goal: 20 pages'] },
    { n: 'journal',            k: 'journal',  c: T,            meta: [] },
    { n: 'meditate',           k: 'meditate', c: '#a35fe0',    meta: ['goal: 5 times per day'] },
    { n: 'walk 10k steps',     k: 'walk',     c: '#5fd068',    meta: ['goal: 10k steps'] },
    { n: 'exercise',           k: 'exercise', c: T,            tag: '[w 3]', meta: [] },
    { n: 'wake up before 8am', k: 'alarm',    c: '#e8b83a',    meta: [] },
    { n: 'sleep 8h',           k: 'sleep',    c: '#6a5ae0',    meta: ['goal: 8 hours'] },
    { n: 'no phone in bed',    k: 'phone',    c: T,            meta: [] }
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  $('ovlist').innerHTML = habits.map(h => `<div class="ovh" style="color:${h.c}">
    <div class="ovn">${icon(h.k, h.c)}<span>${esc(h.n)}</span>${h.tag ? `<em>${h.tag}</em>` : ''}<span class="fl">${flame}0</span></div>
    ${h.meta.concat(['every day']).map((m, i, a) => `<div class="ovm">// ${i === a.length - 1 ? cal + ' ' : ''}${esc(m)}</div>`).join('')}
  </div>`).join('');
  $('ovsum').textContent = `// ${habits.length} active habits, 0 routines, 0 reminders`;

  const close = () => {
    if (!ov.classList.contains('open')) return;
    hide(ov); ka.style.display = 'none'; km.style.display = 'flex'; tab.classList.remove('act');
  };
  const prevClose = window.__closeHelp;               // also closes help, feedback and profile panels
  const open = () => {
    if (np.classList.contains('open')) $('cancel').click();
    if (window.__closeAppearance) window.__closeAppearance();
    if (prevClose) prevClose();
    ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false'); ov.querySelector('.scroll').scrollTop = 0;
    km.style.display = 'none'; kn.style.display = 'none'; ka.style.display = 'flex'; tab.classList.add('act');
  };
  window.__closeHelp = () => { if (prevClose) prevClose(); close(); };
  window.__closeOverview = close;

  document.querySelector('[data-open="overview"]').addEventListener('click', e => {
    e.preventDefault(); open(); e.currentTarget.closest('.nv').classList.remove('open');
  });
  // any other right-column panel (menu item or "+ habit") replaces this one
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if ((o && o.dataset.open !== 'overview') || e.target.closest('#addh')) close();
  }, true);
  $('ovclose').addEventListener('click', close);
  // TODO: open the habit archive once archiving exists.
  $('ovarch').addEventListener('click', () => {});
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
