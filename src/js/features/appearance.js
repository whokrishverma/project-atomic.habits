// Appearance panel and persistent colour themes.
(() => {
  const ap = document.getElementById('apnl'), np = document.getElementById('newp');
  const km = document.getElementById('keys-main'), kn = document.getElementById('keys-new'), ka = document.getElementById('keys-app');
  const sys = document.querySelector('nav .it[data-k="system"]');
  const themeKey = 'initHabitsTheme';
  const themes = new Set(['github-dark', 'ansi-dark', 'nord', 'material-dark', 'light-basic', 'solarized-light']);
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')];

  const applyTheme = (name, save = true) => {
    const theme = themes.has(name) ? name : 'github-dark';
    document.documentElement.dataset.theme = theme;
    themeButtons.forEach(button => {
      const selected = button.dataset.themeChoice === theme;
      button.setAttribute('aria-pressed', String(selected));
      const marker = button.querySelector('.theme-check');
      if (marker) marker.textContent = selected ? '*' : '';
    });
    const note = document.getElementById('theme-saved');
    if (note) note.textContent = save ? '// theme saved on this device' : '// current theme';
    if (save) {
      try { localStorage.setItem(themeKey, theme); }
      catch { if (note) note.textContent = '// theme applies until this tab is closed'; }
    }
  };

  let initialTheme = 'github-dark';
  try { initialTheme = localStorage.getItem(themeKey) || initialTheme; } catch { /* storage may be unavailable */ }
  applyTheme(initialTheme, false);
  themeButtons.forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.themeChoice)));

  const open = () => {
    if (np.classList.contains('open')) document.getElementById('cancel').click();
    if (window.__closeHelp) window.__closeHelp();
    ap.classList.add('open'); ap.setAttribute('aria-hidden','false'); ap.querySelector('.scroll').scrollTop = 0;
    km.style.display = 'none'; kn.style.display = 'none'; ka.style.display = 'flex'; sys.classList.add('act');
  };
  const close = () => {
    if (!ap.classList.contains('open')) return;
    ap.classList.remove('open'); ap.setAttribute('aria-hidden','true');
    ka.style.display = 'none'; km.style.display = 'flex'; sys.classList.remove('act');
  };
  window.__closeAppearance = close;
  document.querySelector('[data-open="appearance"]').addEventListener('click', e => {
    e.preventDefault(); open(); e.currentTarget.closest('.nv').classList.remove('open');
  });
  document.getElementById('apclose').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  ap.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-v]').forEach(o => o.addEventListener('click', () => {
    g.querySelectorAll('[data-v]').forEach(x => x.classList.remove('on')); o.classList.add('on');
  })));
  const un = document.getElementById('un'), unc = document.getElementById('unc');
  un.addEventListener('input', () => unc.textContent = un.value.length + '/15');
})();
