// Appearance panel and persistent colour themes.
(() => {
  const ap = document.getElementById('apnl'), tp = document.getElementById('tpnl'), np = document.getElementById('newp');
  const km = document.getElementById('keys-main'), kn = document.getElementById('keys-new'), ka = document.getElementById('keys-app');
  const sys = document.querySelector('nav .it[data-k="system"]');
  const themeKey = 'initHabitsTheme';
  const themes = new Set(['github-dark', 'ansi-dark', 'nord', 'gruvbox-dark', 'material-dark', 'catppuccin-mocha', 'solarized-cream', 'dracula', 'tokyo-night', 'monokai', 'one-dark', 'ayu-dark', 'ayu-mirage', 'kanagawa', 'everforest-dark', 'light-basic', 'solarized-light', 'github-light', 'rose-pine-dawn', 'one-light', 'ayu-light', 'everforest-light', 'catppuccin-latte']);
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')];
  const themeListToggles = [...document.querySelectorAll('[data-theme-toggle]')];
  const visibleThemeCount = 5;

  const setThemeListExpanded = (options, expanded) => {
    if (!options) return;
    const buttons = [...options.querySelectorAll('[data-theme-choice]')];
    buttons.forEach((button, index) => {
      button.hidden = !expanded && index >= visibleThemeCount;
    });
    const toggle = themeListToggles.find(item => item.dataset.themeToggle === options.id);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? '[show less]' : '[show more]';
    }
  };

  themeListToggles.forEach(toggle => {
    const options = document.getElementById(toggle.dataset.themeToggle);
    setThemeListExpanded(options, false);
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') !== 'true';
      setThemeListExpanded(options, expanded);
    });
  });

  const applyTheme = (name, save = true) => {
    const theme = themes.has(name) ? name : 'github-dark';
    document.documentElement.dataset.theme = theme;
    themeButtons.forEach(button => {
      const selected = button.dataset.themeChoice === theme;
      button.setAttribute('aria-pressed', String(selected));
      const marker = button.querySelector('.theme-check');
      if (marker) marker.textContent = selected ? '*' : '';

      // Keep a previously selected theme visible when the panel is opened.
      if (selected && button.hidden) {
        const options = button.closest('.theme-options');
        setThemeListExpanded(options, true);
      }
    });
    const current = themeButtons.find(button => button.dataset.themeChoice === theme);
    const currentSwatches = document.getElementById('theme-current-swatches');
    const currentName = document.getElementById('theme-current-name');
    if (current && currentSwatches && currentName) {
      currentSwatches.innerHTML = current.querySelector('.swatches').innerHTML;
      currentName.textContent = current.textContent.replace(/\*|\[pro\]/g, '').trim();
    }
    const previewName = document.getElementById('theme-preview-name');
    if (previewName) previewName.textContent = '// ' + theme.replace(/-/g, ' ');
    if (save) {
      try { localStorage.setItem(themeKey, theme); }
      catch { /* storage may be unavailable; the theme still applies for this tab */ }
    }
  };

  let initialTheme = 'github-dark';
  try { initialTheme = localStorage.getItem(themeKey) || initialTheme; } catch { /* storage may be unavailable */ }
  applyTheme(initialTheme, false);
  // TODO: pro themes are locked placeholders; wire this to the pro plan / upsell when it exists.
  themeButtons.forEach(button => button.addEventListener('click', () => { if (!button.hasAttribute('data-pro')) applyTheme(button.dataset.themeChoice); }));

  const isOpen = () => ap.classList.contains('open') || tp.classList.contains('open');
  const hide = panel => { panel.classList.remove('open'); panel.setAttribute('aria-hidden','true'); };
  const show = panel => { panel.classList.add('open'); panel.setAttribute('aria-hidden','false'); panel.querySelector('.scroll').scrollTop = 0; };
  const prepare = () => {
    if (np.classList.contains('open')) document.getElementById('cancel').click();
    if (window.__closeHelp) window.__closeHelp();
    km.style.display = 'none'; kn.style.display = 'none'; ka.style.display = 'flex'; sys.classList.add('act');
  };
  const open = () => { prepare(); hide(tp); show(ap); };
  const close = () => {
    if (!isOpen()) return;
    hide(ap); hide(tp);
    ka.style.display = 'none'; km.style.display = 'flex'; sys.classList.remove('act');
  };
  // themes panel: opens in the right column from system → themes or appearance → themes.
  // [close] closes it; esc steps back to appearance when it was opened from there.
  let themesFromAppearance = false;
  const openThemes = () => {
    themesFromAppearance = ap.classList.contains('open');
    prepare(); hide(ap); show(tp);
  };
  const closeThemes = () => { hide(tp); show(ap); };
  window.__closeAppearance = close;
  document.querySelector('[data-open="appearance"]').addEventListener('click', e => {
    e.preventDefault(); open(); e.currentTarget.closest('.nv').classList.remove('open');
  });
  document.querySelector('[data-open="themes"]').addEventListener('click', e => {
    e.preventDefault(); openThemes(); e.currentTarget.closest('.nv').classList.remove('open');
  });
  document.getElementById('apclose').addEventListener('click', close);
  document.getElementById('theme-open').addEventListener('click', openThemes);
  document.getElementById('tpclose').addEventListener('click', close);
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (tp.classList.contains('open') && themesFromAppearance) closeThemes(); else close();
  });
  [ap, tp].forEach(panel => panel.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-v]').forEach(o => o.addEventListener('click', () => {
    g.querySelectorAll('[data-v]').forEach(x => x.classList.remove('on')); o.classList.add('on');
  }))));
  const un = document.getElementById('un'), unc = document.getElementById('unc');
  un.addEventListener('input', () => unc.textContent = un.value.length + '/15');
})();
