// stats → overview, month and week panels: open in the right column from the stats menu.
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
    bars: 'M2 9h3v5H2zM6.500 5h3v9h-3zM11 2h3v12h-3z',
    eye: 'M8 3.500C4.500 3.500 2 6.500 1 8c1 1.500 3.500 4.500 7 4.500S13 9.500 15 8c-1-1.500-3.500-4.500-7-4.500zM8 5.800a2.200 2.200 0 1 1 0 4.400 2.200 2.200 0 0 1 0-4.400z',
    flame: 'M8 1c1 3 4 4.500 4 8.500A4 4 0 0 1 4 9.500C4 8 5 7 5.500 6 6.500 7 7 7 7 7 7.500 5 7 3 8 1z',
    trophy: 'M4 2h8v3.500a4 4 0 0 1-3 3.900V12h2.500v1.500h-7V12H7V9.400a4 4 0 0 1-3-3.900zM2 3h2v2.500A2 2 0 0 1 2 3.500zM12 3h2v.5a2 2 0 0 1-2 2z',
    clock: 'M8 1.500a6.500 6.500 0 1 1 0 13 6.500 6.500 0 0 1 0-13zM7.300 4v4.400l3 1.700.7-1.100-2.400-1.400V4z',
    star: 'M8 1.500l1.900 4 4.300.5-3.200 3 .9 4.300L8 11l-3.900 2.300L5 9 1.800 6l4.300-.5z'
  };
  const cake = '<svg class="ck" viewBox="0 0 16 16"><path d="M2 14h12M3 14v-3h10v3M4 11V8h8v3M8 8V5M8 5c-1-1 0-2 0-3 1 1 1 2 0 3z"/></svg>';
  const head = (ic, t) => `<div class="sech">${svg(ICON[ic])}<span>${t}</span></div>`;
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

  // ---- overview ----------------------------------------------------------
  // TODO: xp / level come from real completions once habits are persisted.
  const XP = { level: 1, total: 25, next: 30 };
  const DAILY = HABITS.filter(h => !h.weekly);
  const T = '#e6edf3';
  const LOOK = {                                       // icon + colour per habit, same as the all-habits panel
    'no sugar': ['cake', 'var(--red)'], stretch: ['stretch', T], read: ['read', '#e8913a'], journal: ['journal', T], meditate: ['meditate', '#a35fe0'],
    'walk 10k steps': ['walk', '#5fd068'], exercise: ['exercise', T], 'wake up before 8am': ['alarm', '#e8b83a'], 'sleep 8h': ['sleep', '#6a5ae0'], 'no phone in bed': ['phone', T]
  };
  const CAKE = '<path d="M2 14h12M3 14v-3h10v3M4 11V8h8v3M8 8V5M8 5c-1-1 0-2 0-3 1 1 1 2 0 3z"/>';
  const hicon = h => { const [k, c] = LOOK[h.n]; return `<svg class="i" viewBox="0 0 16 16" style="color:${c}">${k === 'cake' ? CAKE : I[k]}</svg>`; };
  const hname = h => `<em style="color:${LOOK[h.n][1]}">${hicon(h)}${h.n}</em>`;
  const WINDOWS = { '7d': 7, '30d': 30, '90d': 90, '365d': 365, all: Infinity };
  let oWin = '30d';

  const range = (from, to) => { const out = []; for (let d = midnight(from); d <= to; d = addDays(d, 1)) out.push(d); return out; };
  const frac = d => DAILY.filter(h => doneOn(d).includes(HABITS.indexOf(h))).length / DAILY.length;   // share of daily habits done
  const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  const P = x => Math.round(x * 100) + '%';
  const bestRun = days => { let best = 0, run = 0; days.forEach(d => { run = frac(d) >= GOAL ? run + 1 : 0; best = Math.max(best, run); }); return best; };
  const nowRun = days => { let n = 0; for (let i = days.length - 1; i >= 0; i--) { if (frac(days[i]) >= GOAL) n++; else if (i < days.length - 1) break; } return n; };   // today may still be open
  const habitRun = (h, today) => {
    const i = HABITS.indexOf(h); let n = 0, d = doneOn(today).includes(i) ? today : addDays(today, -1);
    while (d >= START && doneOn(d).includes(i)) { n++; d = addDays(d, -1); }
    return n;
  };
  const rateOf = (h, days) => days.length ? days.filter(d => doneOn(d).includes(HABITS.indexOf(h))).length / days.length : 0;
  const dbar = f => `<span class="tr"><i style="width:${Math.round(f * 100)}%"></i></span>`;

  const heatmap = today => {
    const first = addDays(today, -dow(today) - 52 * 7);                                    // monday, 52 weeks back
    let cells = '', months = '', prev = -1;
    for (let w = 0; w < 53; w++) {
      const mon = addDays(first, w * 7);
      if (mon.getMonth() !== prev && (w > 0 || mon.getDate() <= 7)) months += `<span style="left:${w * 10.4}px">${MON[mon.getMonth()]}</span>`;
      prev = mon.getMonth();
      for (let r = 0; r < 7; r++) {
        const d = addDays(mon, r); if (d > today) break;
        const c = d >= START ? doneOn(d).length / HABITS.length : 0;
        const lv = c <= 0 ? 0 : Math.min(5, Math.ceil(c * 5));
        cells += `<i class="${+d === +today ? 't' : lv ? 'h' + lv : ''}"></i>`;
      }
    }
    return `<div class="heat"><div class="dl"><span>m</span><span></span><span>w</span><span></span><span>f</span><span></span><span>s</span></div>` +
      `<div class="hsc"><div class="mo" style="width:${53 * 10.4}px">${months}</div><div class="cells">${cells}</div></div></div>` +
      '<div class="leg">// less <i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i><i class="h5"></i><span>more</span></div>';
  };

  const renderOverview = el => {
    const today = midnight(new Date()), n = WINDOWS[oWin];
    const all = range(START, today);
    const from = n === Infinity ? START : addDays(today, -(n - 1));
    const days = range(from > START ? from : START, today);
    const tag = `<span class="wn">[${oWin}]</span>`;
    const comp = days.reduce((a, d) => a + doneOn(d).length, 0);
    const rates = DAILY.map(h => rateOf(h, days));
    const top = days.length ? rates.indexOf(Math.max(...rates)) : -1, low = days.length ? rates.indexOf(Math.min(...rates)) : -1;
    // most improved: compare with the window just before this one (only days that have tracking data)
    let improved = 'not enough data';
    if (n !== Infinity) {
      const before = range(addDays(days[0], -n), addDays(days[0], -1)).filter(d => d >= START);
      if (before.length) {
        const gain = DAILY.map((h, i) => rates[i] - rateOf(h, before)), g = Math.max(...gain);
        if (g > 0) improved = `${hname(DAILY[gain.indexOf(g)])} (+${Math.round(g * 100)}%)`;
      }
    }
    const worked = new Set(); days.forEach(d => doneOn(d).forEach(i => worked.add(i)));
    const byDow = Array.from({ length: 7 }, (_, k) => mean(days.filter(d => dow(d) === k).map(frac)));
    const streaks = DAILY.map(h => [h, habitRun(h, today)]).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const sec = (ic, t, sub, body, first) => head(ic, t).replace('class="sech"', first ? 'class="sech"' : 'class="sech sec3"') + `<div class="sc">// ${sub}</div>` + body;
    const wins = Object.keys(WINDOWS).map(w => `<button type="button" data-w="${w}"${w === oWin ? ' class="on"' : ''}>[${w}]</button>`).join('') +
      '<button type="button" data-todo="more">[more]</button><button type="button" data-todo="custom">[custom]</button>';   // TODO: extra presets and a custom date range
    const prevScroll = el.querySelector('.hsc');
    const sl = prevScroll ? prevScroll.scrollLeft : null;

    el.innerHTML =
      sec('eye', 'lifetime overview', 'your overall tracking summary',
        kv('days tracked', `${all.length} days`) + kv('avg completion', P(mean(all.map(frac)))) +
        kv('daily goal met', `${all.filter(d => frac(d) >= GOAL).length} days`) +
        kv('total completions', all.reduce((a, d) => a + doneOn(d).length, 0)), true) +
      sec('flame', 'streaks', 'consecutive days hitting your daily goal',
        kv('current streak', `${nowRun(all)} days`) + kv('best streak', `${bestRun(all)} days`)) +
      sec('month', 'data window', 'choose from presets, or select a custom range', `<div class="wins">${wins}</div>`) +
      sec('bars', 'completion rates' + tag, 'how often you complete scheduled habits',
        kv(oWin === 'all' ? 'all time' : 'this ' + oWin, P(mean(days.map(frac)))) +
        kv('perfect days', `${days.filter(d => frac(d) === 1).length}/${days.length}`) +
        kv('weekday avg', P(mean(days.filter(d => dow(d) < 5).map(frac)))) + kv('weekend avg', P(mean(days.filter(d => dow(d) > 4).map(frac))))) +
      sec('month', 'day of week' + tag, 'completion rates broken down by day',
        ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'].map((d, k) => `<div class="dwr"><span>${d}</span>${dbar(byDow[k])}<span>${P(byDow[k])}</span></div>`).join('')) +
      sec('trophy', 'habit highlights' + tag, 'how each habit is doing in the selected window',
        kv('top performer', top < 0 ? '–' : `${hname(DAILY[top])} (${P(rates[top])})`) +
        kv('needs attention', low < 0 ? '–' : `${hname(DAILY[low])} (${P(rates[low])})`) + kv('most improved', improved)) +
      sec('clock', 'activity' + tag, 'what you tracked in this window',
        kv('total completions', comp) + kv('habits worked on', worked.size) + kv('routines worked on', 0)) +   // TODO: routines aren't tracked yet
      sec('month', 'contributions', 'your activity over the past year', heatmap(today)) +
      sec('star', 'xp &amp; level', 'experience earned from completions',
        kv('level', XP.level) + kv('total xp', XP.total) +
        `<div class="xb">[<span class="tr"><i style="width:${Math.round(XP.total / XP.next * 100)}%"></i></span>] ${Math.round(XP.total / XP.next * 100)}%</div>` +
        `<div class="sc">// ${XP.total}/${XP.next} xp to level ${XP.level + 1}</div>`) +
      sec('trophy', 'top habits (by streak)', 'your highest-streak habits',
        streaks.map(([h, r], i) => `<div class="tp"><span>${i + 1}. ${hname(h)}</span><span>${r} days</span></div>`).join('')) + NOTE;

    const hs = el.querySelector('.hsc');
    hs.scrollLeft = sl === null ? hs.scrollWidth : sl;
  };

  // ---- panel plumbing (same pattern as the library / archive panels) ------
  const setup = (panel, name, render, reset, step, after) => {
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
      if (after) after(panel);
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
  const ovBody = $('sopnl').querySelector('.stb');
  ovBody.addEventListener('click', e => {             // data window presets (the [more] / [custom] buttons are placeholders)
    const b = e.target.closest('[data-w]'); if (!b) return;
    oWin = b.dataset.w; renderOverview(ovBody);
  });
  setup($('sopnl'), 'stats-overview', renderOverview, () => { oWin = '30d'; }, () => {}, p => { const h = p.querySelector('.hsc'); h.scrollLeft = h.scrollWidth; });
  setup($('smpnl'), 'stats-month', renderMonth, () => { mOff = 0; }, d => { mOff = Math.min(0, mOff + d); });
  setup($('swpnl'), 'stats-week', renderWeek, () => { wOff = 0; }, d => { wOff = Math.min(0, wOff + d); });
})();
