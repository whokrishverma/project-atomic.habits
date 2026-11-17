// stats → month and stats → week panels: open in the right column from the stats menu.
// Both are driven by sample data until persistence exists (see TODOs).
(() => {
  const $ = id => document.getElementById(id);
  const np = $('newp');
  const km = $('keys-main'), kn = $('keys-new'), ka = $('keys-app');
  const tab = document.querySelector('nav .it[data-k="stats"]');
  const hide = p => { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); };

  // ---- sample data -------------------------------------------------------
  // TODO: replace with the real habit list and completion history once habits are persisted.
  const HABITS = [
    { n: 'no sugar', c: 'var(--red)', cake: true }, { n: 'stretch' }, { n: 'read' }, { n: 'journal' }, { n: 'meditate' },
    { n: 'walk 10k steps' }, { n: 'exercise', weekly: true }, { n: 'wake up before 8am' }, { n: 'sleep 8h' }, { n: 'no phone in bed' }
  ];
  const START = new Date(2026, 10, 16);              // TODO: first day with tracking data
  const GOAL = 0.6;                                  // matches "goal: 60%" in the status panel
  const DONE = {};                                   // 'y-m-d' -> [habit indexes done that day]

  // ---- dates -------------------------------------------------------------
  const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const MONTH = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const midnight = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const key = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const dow = d => (d.getDay() + 6) % 7;             // monday = 0
  const doneOn = d => DONE[key(d)] || [];

  // ---- stats over a date range (only days that have started, today included) ----
  const calc = (from, to, today, list) => {
    const days = [];
    for (let d = midnight(from > START ? from : START), end = to < today ? to : today; d <= end; d = addDays(d, 1)) days.push(d);
    const idx = list.map(h => HABITS.indexOf(h));
    const per = days.map(d => idx.filter(i => doneOn(d).includes(i)).length);
    const met = per.map(n => n / list.length >= GOAL);
    let best = 0, run = 0; met.forEach(m => { run = m ? run + 1 : 0; best = Math.max(best, run); });
    const rates = idx.map(i => days.length ? days.filter(d => doneOn(d).includes(i)).length / days.length : 0);
    const top = days.length ? rates.indexOf(Math.max(...rates)) : -1;
    return {
      days, possible: list.length * days.length, completed: per.reduce((a, b) => a + b, 0),
      goals: met.filter(Boolean).length, best, perfect: idx.filter((i, k) => days.length && rates[k] === 1).length,
      top: top < 0 ? null : { h: list[top], pct: Math.round(rates[top] * 100) }
    };
  };
  const pct = s => s.possible ? Math.round(s.completed / s.possible * 100) : 0;

  // ---- shared markup -----------------------------------------------------
  const svg = p => `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="${p}"/></svg>`;
  const ICON = {
    month: 'M3 2.500h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM3.500 6v6.500h9V6zM5 8h1.200v1.200H5zm2.400 0h1.200v1.200H7.400zM9.800 8H11v1.200H9.800zM5 10.300h1.200v1.200H5zm2.400 0h1.200v1.200H7.400z',
    week: 'M3 2.500h10a1 1 0 0 1 1 1v6.500a3 3 0 0 0-5 3.500H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM3.500 6v6.500h5.200A3 3 0 0 1 12.500 10V6zM11.500 11.500a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
    bars: 'M2 9h3v5H2zM6.500 5h3v9h-3zM11 2h3v12h-3z'
  };
  const cake = '<svg class="ck" viewBox="0 0 16 16"><path d="M2 14h12M3 14v-3h10v3M4 11V8h8v3M8 8V5M8 5c-1-1 0-2 0-3 1 1 1 2 0 3z"/></svg>';
  const head = (ic, t) => `<div class="sech">${svg(ICON[ic])}${t}</div>`;
  const nav = (label, canNext) =>
    `<div class="pn"><button type="button" data-d="-1" aria-label="previous">&lt;</button><b>${label}</b><button type="button" data-d="1" aria-label="next"${canNext ? '' : ' disabled'}>&gt;</button></div>`;
  const kv = (k, v) => `<div class="kv">${k}: <span>${v}</span></div>`;
  const NOTE = '<div class="ftn">// per-habit stats: right-click any habit → [view stats]</div>';

  // ---- month -------------------------------------------------------------
  let mOff = 0;
  const renderMonth = el => {
    const today = midnight(new Date());
    const first = new Date(today.getFullYear(), today.getMonth() + mOff, 1);
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
    let cells = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'].map(d => `<span class="dw">${d}</span>`).join('') + '<span></span>'.repeat(dow(first));
    for (let n = 1; n <= last.getDate(); n++) {
      const d = new Date(first.getFullYear(), first.getMonth(), n);
      let cls = 'no';                                            // before tracking started, or still to come
      if (d >= START && d <= today) {
        const done = doneOn(d).filter(i => !HABITS[i].weekly).length / HABITS.filter(h => !h.weekly).length;
        cls = +d === +today ? 'tod' : done >= GOAL ? 'goal' : 'miss';
      }
      cells += `<span class="${cls}">${n}</span>`;
    }
    const s = calc(first, last, today, HABITS.filter(h => !h.weekly));
    el.innerHTML = head('month', 'monthly overview') + '<div class="sc">// calendar heatmap and monthly stats</div>' +
      nav(`${MONTH[first.getMonth()]} ${first.getFullYear()}`, mOff < 0) +
      `<div class="mg">${cells}</div>` +
      '<div class="lg"><i style="background:var(--green)"></i>goal met<i style="background:var(--cyan)"></i>shield<i style="background:var(--muted)"></i>missed</div>' +
      head('bars', 'month stats').replace('class="sech"', 'class="sech sec2"') + '<div class="sc">// stats for the displayed month</div>' +
      kv('completion', pct(s) + '%') + kv('completed', `${s.completed}/${s.possible} habits`) + kv('goals met', `${s.goals}/${s.days.length} days`) +
      kv('shields used', 0) + kv('best streak this month', `${s.best} days`) +   // TODO: shields aren't tracked yet
      kv('most consistent', s.top ? `<em style="color:${s.top.h.c || 'var(--green)'}">${s.top.h.cake ? cake : ''}${s.top.h.n}</em> (${s.top.pct}%)` : '–') + NOTE;
  };

  // ---- week --------------------------------------------------------------
  let wOff = 0;
  const renderWeek = el => {
    const today = midnight(new Date());
    const mon = addDays(today, -dow(today) + 7 * wOff), sun = addDays(mon, 6);
    const days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
    let g = '<span></span>' + ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'].map((d, i) => `<span class="dw${+days[i] === +today ? ' tod' : ''}">${d}</span>`).join('');
    HABITS.forEach((h, i) => {
      g += `<span class="hn">${h.n}</span>` + days.map(d => {
        if (d < START || d > today) return '<span class="no">·</span>';
        if (doneOn(d).includes(i)) return '<span class="ok">✓</span>';
        return +d === +today ? '<span class="dt">·</span>' : '<span class="miss">×</span>';
      }).join('');
    });
    const s = calc(mon, sun, today, HABITS);
    const fmt = d => `${MON[d.getMonth()]} ${d.getDate()}`;
    el.innerHTML = head('week', 'weekly overview') + '<div class="sc">// dot matrix habit grid</div>' +
      nav(`${fmt(mon)} – ${fmt(sun)}`, wOff < 0) +
      `<div class="wg">${g}</div>` +
      '<div class="lg wl"><span class="ok">✓</span> done <span class="part">–</span> partial <span class="miss">×</span> missed</div>' +
      head('bars', 'week stats').replace('class="sech"', 'class="sech sec2"') + '<div class="sc">// stats for the displayed week</div>' +
      kv('completion', pct(s) + '%') + kv('completed', `${s.completed}/${s.possible} habits`) + kv('goals met', `${s.goals}/${s.days.length} days`) +
      kv('best streak this week', `${s.best} days`) + kv('perfect habits', s.perfect) +
      kv('most consistent', s.top ? `<em>${s.top.h.n}</em> (${s.top.pct}%)` : '–') + NOTE;
  };

  // ---- panel plumbing (same pattern as the library / archive panels) ------
  const setup = (panel, name, render, reset, step) => {
    const body = panel.querySelector('.stb');
    const draw = () => render(body);
    const close = () => {
      if (!panel.classList.contains('open')) return;
      hide(panel); ka.style.display = 'none'; km.style.display = 'flex'; tab.classList.remove('act');
    };
    const prevClose = window.__closeHelp;           // closes help, feedback, profile and the other right-column panels
    const open = () => {
      if (np.classList.contains('open')) $('cancel').click();
      if (window.__closeAppearance) window.__closeAppearance();
      if (prevClose) prevClose();
      reset(); draw();
      panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); panel.querySelector('.scroll').scrollTop = 0;
      km.style.display = 'none'; kn.style.display = 'none'; ka.style.display = 'flex'; tab.classList.add('act');
    };
    window.__closeHelp = () => { if (prevClose) prevClose(); close(); };
    document.querySelector(`[data-open="${name}"]`).addEventListener('click', e => {
      e.preventDefault(); open(); e.currentTarget.closest('.nv').classList.remove('open');
    });
    body.addEventListener('click', e => {
      const b = e.target.closest('.pn button'); if (!b || b.disabled) return;
      step(+b.dataset.d); draw();
    });
    document.addEventListener('click', e => {         // any other right-column panel (menu item or "+ habit") replaces this one
      const o = e.target.closest('[data-open]');
      if ((o && o.dataset.open !== name) || e.target.closest('#addh')) close();
    }, true);
    panel.querySelector('.x').addEventListener('click', close);
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  };
  setup($('smpnl'), 'stats-month', renderMonth, () => { mOff = 0; }, d => { mOff = Math.min(0, mOff + d); });
  setup($('swpnl'), 'stats-week', renderWeek, () => { wOff = 0; }, d => { wOff = Math.min(0, wOff + d); });
})();
