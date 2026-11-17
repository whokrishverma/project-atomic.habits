// calendar: November 2026 starts on a Sunday; today = 16
const cal=document.getElementById('cal');
['mo','tu','we','th','fr','sa','su'].forEach(d=>cal.insertAdjacentHTML('beforeend',`<div class="dow">${d}</div>`));
for(let i=0;i<6;i++)cal.insertAdjacentHTML('beforeend','<div class="d e"><span>0</span></div>');
for(let n=1;n<=30;n++){
  const cls=n===16?'today':n>16?'fut':'';
  cal.insertAdjacentHTML('beforeend',`<div class="d ${cls}"><span>${n===16?'∗16':n}</span></div>`);
}
// contributions: 22 empty weeks + current week (today = monday, outlined)
const cells=document.getElementById('cells');
for(let w=0;w<22;w++)for(let r=0;r<7;r++)cells.insertAdjacentHTML('beforeend','<i></i>');
cells.insertAdjacentHTML('beforeend','<i class="t"></i>');
// suggestions
const I={
 water:'<path d="M8 2c3 4 4.500 6 4.500 8a4.500 4.500 0 0 1-9 0C3.500 8 5 6 8 2z"/>',
 stretch:'<circle cx="5" cy="3.500" r="1.300"/><path d="M5 5l3 4-4 4M8 9h5M3 8l2-3"/>',
 read:'<path d="M2 3.500c2-1 4-1 6 .5 2-1.500 4-1.500 6-.5v9c-2-1-4-1-6 .5-2-1.500-4-1.500-6-.5z M8 4v9"/>',
 journal:'<path d="M3 13l1-3 8-8 2 2-8 8z M10 4l2 2"/>',
 meditate:'<path d="M8 1.500a5 5 0 0 0-3.500 8.500v3h5v-2h1.500v-2l1-.5-1.200-1.500A5 5 0 0 0 8 1.500z"/><path d="M7 5.500c1-1 2.500-.5 2.500.8S8 8.200 8 9"/>',
 walk:'<circle cx="9" cy="2.800" r="1.300"/><path d="M9 5l-2 3 2 2v4M7 8l-3 1M9 6l3 2M9 10l3 3"/>',
 exercise:'<circle cx="10" cy="2.800" r="1.300"/><path d="M9 5l-3 2 1 3-3 3M9 5l3 3M7 10l3 1 1 3M6 7L3 6"/>',
 alarm:'<circle cx="8" cy="9" r="5"/><path d="M8 6.500V9l2 1M2.500 4l2-2M13.500 4l-2-2"/>',
 sleep:'<path d="M2 12V6.500h12V12M2 9.500h12M4 6.500V5h3v1.500M9 6.500V5h3v1.500M2 12v1.500M14 12v1.500"/>',
 phone:'<rect x="4.500" y="1.500" width="7" height="13" rx="1.500"/><path d="M2 2l12 12"/>'
};
const S=[['drink water','water','#4fd0e6'],['stretch','stretch','#e6edf3'],['read','read','#e8913a'],['journal','journal','#e6edf3'],['meditate','meditate','#a35fe0'],['walk 10k steps','walk','#5fd068'],['exercise','exercise','#e6edf3'],['wake up before 8am','alarm','#e8b83a'],['sleep 8h','sleep','#6a5ae0'],['no phone in bed','phone','#e6edf3']];
document.getElementById('sug').innerHTML=S.map(([n,k,c])=>`<div class="li" style="color:${c}"><span class="bx">[ ]</span><span class="ic"><svg class="i" viewBox="0 0 16 16" style="width:11px;height:11px">${I[k]}</svg></span>${n}<span class="add">[add]</span></div>`).join('');
