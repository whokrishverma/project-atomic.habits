// profile → pro and achievements panels (right column, opened from the profile menu)
(() => {
  const $ = id => document.getElementById(id);
  const pro = $('propnl'), ach = $('acpnl'), np = $('newp');
  const km = $('keys-main'), kn = $('keys-new'), ka = $('keys-app');
  const tab = document.querySelector('nav .it[data-k="profile"]');
  const panels = [pro, ach];
  const hide = p => { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); };
  const anyOpen = () => panels.some(p => p.classList.contains('open'));

  // ---- achievements: sample data -------------------------------------------
  // TODO: replace with real progress, earned dates and xp once habits are persisted.
  const TIERS = [
    { n: 'total completions', d: 'total habit completions',       v: 0,    goal: 10 },
    { n: 'goal days',         d: 'days your daily goal was met',  v: 0,    goal: 7 },
    { n: 'dedication',        d: 'most completions on a single habit', v: 0, goal: 10 },
    { n: 'routine runner',    d: 'total routines completed',      v: null, goal: 1 }
  ];
  const NEXT = { tier: 'bronze', xp: 10 };
  const MILESTONES = [
    { n: 'boot sequence',     xp: 10,  d: 'complete the onboarding flow' },
    { n: 'init',              xp: 10,  d: 'your first habit — the one that started it all', earned: '2026-11-15' },
    { n: 'early bird',        xp: 15,  d: 'completed a habit before 7am', earned: '2026-11-17' },
    { n: 'night owl',         xp: 15,  d: 'complete a habit after 11pm' },
    { n: 'creature of habit', xp: 25,  d: 'complete the same habit 200 times' },
    { n: 'uptime: 7d',        xp: 15,  d: 'maintain a 7-day streak on any habit' },
    { n: 'uptime: 30d',       xp: 40,  d: 'maintain a 30-day streak on any habit' },
    { n: 'uptime: 60d',       xp: 75,  d: 'maintain a 60-day streak on any habit' },
    { n: 'crontab',           xp: 25,  d: 'complete the same habit within the same hour for 7 days straight' },
    { n: 'perfect week',      xp: 25,  d: 'meet your daily goal 7 days in a row' },
    { n: 'hello world',       xp: 25,  d: 'have completions on 30 different days' },
    { n: 'legacy system',     xp: 150, d: 'have completions on 365 different days' },
    { n: 'reboot',            xp: 30,  d: 'break a streak of 14+ days, then rebuild a 7-day streak on the same habit' }
  ];
  // hidden challenges stay masked until unlocked; only the hint is shown
  const HIDDEN = [
    { hint: "the day isn't over yet" },
    { hint: 'some work gets done after midnight' },
    { hint: 'a fresh start' },
    { hint: 'less can be more' },
    { hint: 'what goes around comes around' },
    { hint: 'time is of the essence' },
    { hint: 'sometimes letting go is progress' },
    { hint: 'collect them all' }
  ];

  // masked text uses only this glyph pattern (cycled and cut to the length asked for)
  const MASK = '▓█░▒▓▒█░▓▒';
  const mask = (len, from = 0) => Array.from({ length: len }, (_, i) => MASK[(from + i) % MASK.length]).join('');
  // [title length, description length] per hidden challenge (matches the reference layout)
  const MASK_LEN = [[6, 10], [8, 10], [6, 9], [9, 9], [9, 9], [7, 10], [13, 14], [11, 10]];

  // progress bar: 6 segments of 4 shade chars split by │, e.g. [░░░░│░░░░│░░░░│░░░░│░░░░│░░░░]
  const SEG = 6, SEGW = 4;
  const bar = (v, goal) => {
    const unit = goal / SEG;
    const out = [];
    for (let s = 0; s < SEG; s++) {
      const filled = v == null ? 0 : Math.max(0, Math.min(SEGW, Math.round((v - s * unit) / unit * SEGW)));
      const cls = v != null && filled === 0 && s === Math.floor(Math.min(v, goal - 1e-9) / unit) ? 'cur' : (filled ? 'fill' : '');
      out.push(`<span${cls ? ` class="${cls}"` : ''}>${'▒'.repeat(filled)}${'░'.repeat(SEGW - filled)}</span>`);
    }
    return `[${out.join('│')}]<span class="cnt">${v == null ? '--' : v}/${goal}</span>`;
  };

  const svg = (p, extra = '') => `<svg class="i" viewBox="0 0 16 16" style="fill:currentColor;stroke:none" ${extra}><path ${p}/></svg>`;
  const ICON_TREND = '<svg class="i" viewBox="0 0 16 16"><path d="M2 13.500h12M2.500 10l3-3 2.500 2L13 4M10.500 4H13v2.500"/></svg>';
  const ICON_FLAG = svg('d="M3 1.500h1.500V14.500H3zM5.500 2.500h8l-2 3 2 3h-8z"');
  const ICON_EYE = '<svg class="i" viewBox="0 0 16 16"><path d="M1 8c1.500-2.500 4-4.500 7-4.500S13.500 5.500 15 8c-1.500 2.500-4 4.500-7 4.500S2.500 10.500 1 8z"/><circle cx="8" cy="8" r="2"/><path d="M2.500 13.500l11-11"/></svg>';
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const draw = () => {
    const tiers = TIERS.map(t => `<div class="tier"><b>${esc(t.n)}</b>
      <div class="note">// ${esc(t.d)}</div>
      <div class="pbar2">${bar(t.v, t.goal)}</div>
      <div class="nx">→ <b>${NEXT.tier}</b> <span class="mu">+${NEXT.xp} xp</span></div></div>`).join('');
    const ms = MILESTONES.map(m => `<div class="ms${m.earned ? ' on' : ''}"><span class="bx">${m.earned ? '[∗]' : '[ ]'}</span> <b class="nm">${esc(m.n)}</b> <span class="xp">+${m.xp} xp</span>
      <div class="ds"><div class="note">// ${esc(m.d)}</div>${m.earned ? `<div class="earned">// earned: ${m.earned}</div>` : ''}</div></div>`).join('');
    const hid = HIDDEN.map((h, i) => `<div class="ms hd"><span class="bx">[ ]</span> <span class="hid">${mask(MASK_LEN[i][0], i * 3)}</span> <span class="xp">+?? xp</span>
      <div class="ds"><div class="note rd">// <span class="hid">${mask(MASK_LEN[i][1], i * 3 + 2)}</span></div><div class="note">// ${esc(h.hint)}</div></div></div>`).join('');
    $('acbody').innerHTML = `
      <div class="sec">${ICON_TREND}tiers</div>
      <div class="ind"><div class="note">// complete habits and meet daily goals to progress through tiers — each tier earns xp</div>${tiers}</div>
      <div class="sec">${ICON_FLAG}milestones</div>
      <div class="ind ach-s"><div class="note">// one-time achievements for reaching key moments</div>${ms}</div>
      <div class="sec">${ICON_EYE}hidden challenges</div>
      <div class="ind ach-s" style="padding-bottom:14px"><div class="note">// unlock them to find out</div>${hid}</div>`;
    // the first section heading sits flush with the top of the panel
    const first = $('acbody').firstElementChild; if (first) first.style.marginTop = '0';
  };

  // ---- panel plumbing (same pattern as the archive / library panels) ------
  const close = () => {
    if (!anyOpen()) return;
    panels.forEach(hide); ka.style.display = 'none'; km.style.display = 'flex'; tab.classList.remove('act');
  };
  const prevClose = window.__closeHelp;               // closes help, feedback, account and levels panels
  const open = p => {
    if (np.classList.contains('open')) $('cancel').click();
    if (window.__closeAppearance) window.__closeAppearance();
    if (prevClose) prevClose();
    panels.forEach(hide);
    if (p === ach) draw();
    p.classList.add('open'); p.setAttribute('aria-hidden', 'false'); p.querySelector('.scroll').scrollTop = 0;
    km.style.display = 'none'; kn.style.display = 'none'; ka.style.display = 'flex'; tab.classList.add('act');
  };
  window.__closeHelp = () => { if (prevClose) prevClose(); close(); };

  [['pro', pro], ['achievements', ach]].forEach(([k, p]) =>
    document.querySelector(`[data-open="${k}"]`).addEventListener('click', e => {
      e.preventDefault(); open(p); e.currentTarget.closest('.nv').classList.remove('open');
    }));
  // any other right-column panel (menu item or "+ habit") replaces these; account / levels have their own handler
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if ((o && o.dataset.open !== 'pro' && o.dataset.open !== 'achievements') || e.target.closest('#addh')) close();
  }, true);
  $('proclose').addEventListener('click', close);
  $('acclose').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // ---- pro: placeholder actions -------------------------------------------
  const msg = $('promsg'), say = t => { msg.textContent = t; clearTimeout(say.t); say.t = setTimeout(() => msg.textContent = '', 3500); };
  // TODO: open the real checkout (paddle) for the chosen plan
  pro.querySelectorAll('[data-plan]').forEach(b => b.addEventListener('click', () => say(`// checkout: ${b.dataset.plan} (not connected yet)`)));
  // TODO: redeem a promo code
  $('proredeem').addEventListener('click', () => say('// redeem codes are not connected yet'));
  // TODO: link to the real terms, privacy and refund pages
  pro.querySelectorAll('[data-legal]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); say(`// ${a.dataset.legal} page not linked yet`); }));
})();
