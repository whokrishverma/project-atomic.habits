// "habit --new" panel: closed by default, opens only from "+ habit"
(() => {
  const p = document.getElementById('newp'), km = document.getElementById('keys-main'), kn = document.getElementById('keys-new');
  const hn = document.getElementById('hn'), hc = document.getElementById('hc');
  const open = () => { if (window.__closeAppearance) window.__closeAppearance(); if (window.__closeHelp) window.__closeHelp(); p.classList.add('open'); p.setAttribute('aria-hidden','false'); km.style.display='none'; kn.style.display='flex'; hn.focus(); };
  const close = () => { p.classList.remove('open'); p.setAttribute('aria-hidden','true'); kn.style.display='none'; km.style.display='flex'; };
  document.getElementById('addh').addEventListener('click', open);
  document.getElementById('cancel').addEventListener('click', close);
  document.getElementById('save').addEventListener('click', () => { hn.value = hc.value = ''; hn.dispatchEvent(new Event('input')); hc.dispatchEvent(new Event('input')); close(); });
  addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.key === 'Escape' && p.classList.contains('open')) close();
    else if (e.key === 'Enter' && p.classList.contains('open')) document.getElementById('save').click();
    else if (e.key === 'a' && !typing && !p.classList.contains('open')) { e.preventDefault(); open(); }
  });
  hn.addEventListener('input', () => document.getElementById('c1').textContent = hn.value.length + '/50');
  hc.addEventListener('input', () => document.getElementById('c2').textContent = hc.value.length + '/30');
  p.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-v]').forEach(o => o.addEventListener('click', () => {
    g.querySelectorAll('[data-v]').forEach(x => x.classList.remove('on')); o.classList.add('on');
  })));
})();
