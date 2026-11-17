// help + feedback panels: open in the right column from help → help / feedback
(() => {
  const $ = id => document.getElementById(id);
  const hp = $('hpnl'), fp = $('fpnl'), np = $('newp');
  const km = $('keys-main'), kn = $('keys-new'), ka = $('keys-app');
  const helpTab = document.querySelector('nav .it[data-k="help"]');
  const hide = p => { p.classList.remove('open'); p.setAttribute('aria-hidden','true'); };
  const closeAll = () => {
    if (!hp.classList.contains('open') && !fp.classList.contains('open')) return;
    hide(hp); hide(fp); ka.style.display = 'none'; km.style.display = 'flex'; helpTab.classList.remove('act');
  };
  const open = (p, keys) => {
    if (np.classList.contains('open')) $('cancel').click();
    if (window.__closeAppearance) window.__closeAppearance();
    if (window.__closeProfile) window.__closeProfile();
    hide(hp); hide(fp);
    p.classList.add('open'); p.setAttribute('aria-hidden','false'); p.querySelector('.scroll').scrollTop = 0;
    km.style.display = 'none'; kn.style.display = 'none'; ka.style.display = 'none'; keys.style.display = 'flex';
    helpTab.classList.add('act');
  };
  window.__closeHelp = closeAll;
  const wire = (name, p, keys) => document.querySelector(`[data-open="${name}"]`).addEventListener('click', e => {
    e.preventDefault(); open(p, keys); e.currentTarget.closest('.nv').classList.remove('open');
  });
  wire('help', hp, ka);       // help view shows the "setting / change / select" key hints
  wire('feedback', fp, km);   // feedback view shows the main key hints
  $('hpclose').addEventListener('click', closeAll);
  $('fbclose').addEventListener('click', closeAll);
  $('hpask').addEventListener('click', () => { open(fp, km); $('fbmsg').focus(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  // help: click a topic to expand a short description
  hp.querySelectorAll('.hl').forEach(b => b.addEventListener('click', () => b.classList.toggle('on')));

  // feedback form
  const msg = $('fbmsg'), cnt = $('fbcnt'), sub = $('fbsub'), sent = $('fbsent'), fl = $('fbfiles'), fi = $('fbfile');
  let files = [];
  const sync = () => { cnt.textContent = `[${msg.value.length}/5000]`; sub.classList.toggle('ready', msg.value.trim().length > 0); };
  const draw = () => {
    fl.innerHTML = '';
    files.forEach((f, i) => {
      const d = document.createElement('div'), x = document.createElement('b');
      d.textContent = '// ' + f.name; x.textContent = '[x]'; x.onclick = () => { files.splice(i, 1); draw(); };
      d.appendChild(x); fl.appendChild(d);
    });
  };
  msg.addEventListener('input', () => { sent.style.display = 'none'; sync(); });
  $('fbatt').addEventListener('click', () => fi.click());
  fi.addEventListener('change', () => { files = files.concat([...fi.files]).slice(0, 3); fi.value = ''; draw(); });
  sub.addEventListener('click', () => {
    if (!msg.value.trim()) return;
    // TODO: POST { message: msg.value, email: $('fbem').value, files } to your feedback endpoint
    msg.value = ''; $('fbem').value = ''; files = []; draw(); sync(); sent.style.display = 'block';
  });
})();
