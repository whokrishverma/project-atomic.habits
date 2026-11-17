// profile panels: account (sync & data) and levels, opened from the profile menu
(() => {
  const $ = id => document.getElementById(id);
  const acc = $('pacc'), lvl = $('plv'), np = $('newp');
  const km = $('keys-main'), kn = $('keys-new'), ka = $('keys-app');
  const tab = document.querySelector('nav .it[data-k="profile"]');
  const hide = p => { p.classList.remove('open'); p.setAttribute('aria-hidden','true'); };
  const closeAll = () => {
    if (!acc.classList.contains('open') && !lvl.classList.contains('open')) return;
    hide(acc); hide(lvl); ka.style.display = 'none'; km.style.display = 'flex'; tab.classList.remove('act');
  };
  const open = p => {
    if (np.classList.contains('open')) $('cancel').click();
    if (window.__closeAppearance) window.__closeAppearance();
    if (window.__closeHelp) window.__closeHelp();   // also closes the other profile panel
    hide(acc); hide(lvl);
    p.classList.add('open'); p.setAttribute('aria-hidden','false'); p.querySelector('.scroll').scrollTop = 0;
    km.style.display = 'none'; kn.style.display = 'none'; ka.style.display = 'flex'; tab.classList.add('act');
  };
  window.__closeProfile = closeAll;
  const prevClose = window.__closeHelp;
  window.__closeHelp = () => { if (prevClose) prevClose(); closeAll(); };
  [['account', acc], ['levels', lvl]].forEach(([k, p]) =>
    document.querySelector(`[data-open="${k}"]`).addEventListener('click', e => {
      e.preventDefault(); open(p); e.currentTarget.closest('.nv').classList.remove('open');
    }));
  document.querySelectorAll('[data-pclose]').forEach(b => b.addEventListener('click', closeAll));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  // account actions
  const msg = $('pmsg'), say = t => { msg.textContent = t; clearTimeout(say.t); say.t = setTimeout(() => msg.textContent = '', 3500); };
  const save = (name, type, text) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); };
  $('syncb').addEventListener('click', () => {
    const st = $('syst'); st.textContent = 'syncing...'; st.className = 'busy';
    setTimeout(() => { st.textContent = 'up to date'; st.className = 'ok'; }, 900);   // TODO: call your sync endpoint
  });
  $('exb').addEventListener('click', () => { save('init-habits-backup.json', 'application/json', JSON.stringify({ app: 'init.Habits', exported: new Date().toISOString(), habits: [], completions: [], settings: {} }, null, 2)); say('// backup saved'); });   // TODO: real data
  $('exc').addEventListener('click', () => { save('init-habits-completions.csv', 'text/csv', 'date,habit,completed\n'); say('// csv saved'); });                                                              // TODO: real data
  $('imb').addEventListener('click', () => $('imf').click());
  $('imf').addEventListener('change', () => {
    const f = $('imf').files[0]; if (!f) return;
    f.text().then(t => { JSON.parse(t); say('// backup read: ' + f.name); }).catch(() => say('// not a valid backup file'));   // TODO: apply to app state
    $('imf').value = '';
  });
  $('so').addEventListener('click', () => { if (confirm('sign out?')) say('// signed out'); });                  // TODO: real sign-out
  $('del').addEventListener('click', () => { if (confirm('permanently delete your account and all its data?')) say('// delete requested'); });   // TODO: real delete
})();
