// habits library panel: opens in the right column from habits → library.
// [add] pre-fills the "habit --new" panel so the habit can be edited before saving.
(() => {
  const $ = id => document.getElementById(id);
  const lp = $('hlpnl'), np = $('newp');
  const km = $('keys-main'), kn = $('keys-new'), ka = $('keys-app');
  const tab = document.querySelector('nav .it[data-k="habits"]');
  const hide = p => { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); };

  // small filled/stroked icons, 16x16
  const P = {
    spark: '<path d="M8 1.500l1.400 3.700L13 6.500 9.400 7.900 8 11.500 6.600 7.900 3 6.500l3.600-1.300zM12.500 10.500l.6 1.400 1.400.6-1.400.6-.6 1.400-.6-1.400-1.400-.6 1.400-.6z" fill="currentColor" stroke="none"/>',
    drop: '<path d="M8 2c3 4 4.500 6 4.500 8a4.500 4.500 0 0 1-9 0C3.500 8 5 6 8 2z" fill="currentColor" stroke="none"/>',
    walk: '<circle cx="9" cy="2.800" r="1.300"/><path d="M9 5l-2 3 2 2v4M7 8l-3 1M9 6l3 2M9 10l3 3"/>',
    head: '<path d="M8 1.500a5 5 0 0 0-3.500 8.500v3h5v-2h1.500v-2l1-.5-1.200-1.500A5 5 0 0 0 8 1.500z"/><path d="M7 5.500c1-1 2.500-.5 2.500.8S8 8.200 8 9"/>',
    book: '<path d="M2 3.500c2-1 4-1 6 .5 2-1.500 4-1.500 6-.5v9c-2-1-4-1-6 .5-2-1.500-4-1.500-6-.5z" fill="currentColor" stroke="none"/>',
    hands: '<path d="M5 14c-2-1-3-3-2-6l1.500-3M8 14c-2.500-1-3.500-4-2.500-7l1-3M11 13c-1.500 1-3 1-4 0M10 3l.5 2.500M13 6l-1.500 2" />',
    sun: '<path d="M2 12h12M4.500 12a3.500 3.500 0 0 1 7 0M8 3v2M3.500 5.500L5 7M12.500 5.500L11 7"/>',
    stretch: '<circle cx="5" cy="3.500" r="1.300"/><path d="M5 5l3 4-4 4M8 9h5M3 8l2-3"/>',
    flag: '<path d="M3 14V2.500M3 3h9.500l-2 3 2 3H3z" fill="currentColor"/>',
    mood: '<rect x="2.500" y="2.500" width="11" height="11" rx="2" fill="currentColor" stroke="none"/><path d="M5.500 6.500h5M5.500 9.500h3" stroke="var(--panel)"/>',
    moon: '<path d="M12.500 10A5.500 5.500 0 0 1 6 3.500a5.500 5.500 0 1 0 6.500 6.500z" fill="currentColor" stroke="none"/>',
    noscreen: '<rect x="2" y="3" width="12" height="8.500" rx="1"/><path d="M6 14h4M2 2l12 12"/>',
    bed: '<path d="M2 12V6.500h12V12M2 9.500h12M4 6.500V5h3v1.500M9 6.500V5h3v1.500M2 12v1.500M14 12v1.500"/>',
    dumbbell: '<path d="M1.500 6.500v3M3.500 5v6M12.500 5v6M14.500 6.500v3M3.500 8h9" stroke-width="2"/>',
    check: '<circle cx="8" cy="8" r="6"/><path d="M5.200 8.200l2 2 3.600-4"/>',
    phone: '<path d="M4 2h2.500l1 3-1.500 1.200a8 8 0 0 0 3.800 3.800L11 8.500l3 1V12a1.500 1.500 0 0 1-1.500 1.500A10.500 10.500 0 0 1 2.500 3.500 1.500 1.500 0 0 1 4 2z" fill="currentColor" stroke="none"/>',
    nophone: '<rect x="4.500" y="1.500" width="7" height="13" rx="1.500"/><path d="M2 2l12 12"/>',
    pen: '<path d="M3 13l1-3 8-8 2 2-8 8z M10 4l2 2"/>',
    target: '<circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2.500"/>',
    clock: '<circle cx="8" cy="8" r="6"/><path d="M8 4.500V8l2 1.500"/>',
    heart: '<path d="M8 13.500C3 10 2 7.500 2 6a3 3 0 0 1 6-.5A3 3 0 0 1 14 6c0 1.500-1 4-6 7.500z" fill="currentColor" stroke="none"/>',
    leaf: '<path d="M3 13c0-6 3-9.500 10-10 0 6-3 10-9 10zM3 13l5-5"/>',
    bolt: '<path d="M9 1.500L3.500 9H8l-1 5.500L12.500 7H8z" fill="currentColor" stroke="none"/>',
    warmup: '<circle cx="5" cy="3.500" r="1.300"/><path d="M5 5.500l2 3.500-3 4M7 9l4 1.500M5 6l-2.500 2M10 3l1.500 1.500M12 6l1.500-.5"/>',
    lift: '<circle cx="8" cy="5" r="1.300"/><path d="M8 6.500V11l-2 3.500M8 11l2 3.500M3 4h10M1.500 3v2M14.500 3v2M8 6.500L5 4M8 6.500L11 4"/>',
    run: '<circle cx="10" cy="2.800" r="1.300"/><path d="M9.500 5L7 8l3 2.500-1 4M7 8L4 7.500M9.500 5l3 2.500M10 10.500l3 1"/>',
    cooldown: '<circle cx="4" cy="4" r="1.300"/><path d="M4 5.500c1 2 3 3 5 3.500l4 3.500M6 8.500l-3 4M9 9l-1 4.500"/>',
    recovery: '<circle cx="5.500" cy="3" r="1.300"/><path d="M5.500 4.500c.5 2 1.500 3 3 4l-.5 5M8.500 8.500l4 .5M5.500 6l-3 1.500"/>',
    foam: '<rect x="1.500" y="10" width="10" height="3.500" rx="1.700"/><circle cx="12" cy="6" r="1.200"/><path d="M3 8.500l5-1.500 3 1.500"/>',
    fish: '<path d="M1.500 8c2-3 5-4 8-3l3.500-2v10L9.500 11c-3 1-6 0-8-3z" fill="currentColor" stroke="none"/>',
    utensils: '<path d="M4 1.500v13M2 1.500v4a2 2 0 0 0 4 0v-4M12 14.500v-13c-2 1-2.500 4-2.500 6H12"/>',
    apple: '<path d="M8 4.500C6 3 2.500 4.500 3 8.500c.5 3.500 2.500 6 5 5 2.500 1 4.500-1.500 5-5 .5-4-3-5.500-5-4zM8 4.500c0-1.500.5-2.500 2-3" fill="currentColor"/>',
    carrot: '<path d="M11.500 4.500L3 13.500 2.500 13l.5-.5 8.500-8.500zM10 3.500l2.500-2M12 5.500l2.500-1.500M11 4.500l1-3" /><path d="M4 12l7.500-7.500 1 1L5 13z" fill="currentColor" stroke="none"/>',
    pills: '<rect x="1.500" y="6" width="8" height="4" rx="2" transform="rotate(-40 5.500 8)" fill="currentColor" stroke="none"/><circle cx="11.500" cy="10.500" r="3" fill="currentColor" stroke="none"/><circle cx="12" cy="4" r="1.800" fill="currentColor" stroke="none"/>',
    scale: '<path d="M3 6h10l1.500 8h-13z" fill="currentColor" stroke="none"/><path d="M5.500 6a2.500 2.500 0 0 1 5 0" />',
    lips: '<path d="M1.500 8c2-2 3.500-3 6.500-1.500C11 5 12.500 6 14.500 8c-2 3-4 4-6.500 4S3.500 11 1.500 8z" fill="currentColor" stroke="none"/><path d="M2 8h12" stroke="var(--panel)"/>',
    smile: '<circle cx="8" cy="8" r="6"/><path d="M5.500 6.500v.5M10.500 6.500v.5M5 9.500c1.500 2 4.500 2 6 0"/>',
    ban: '<circle cx="8" cy="8" r="6"/><path d="M3.800 3.800l8.400 8.400"/>',
    clockfill: '<circle cx="8" cy="8" r="6.500" fill="currentColor" stroke="none"/><path d="M8 4.500V8l2.500 1.500" stroke="var(--panel)"/>',
    sunburst: '<circle cx="8" cy="8" r="3" fill="currentColor" stroke="none"/><path d="M8 1.500v2M8 12.500v2M1.500 8h2M12.500 8h2M3.400 3.400l1.400 1.400M11.200 11.200l1.400 1.400M3.400 12.600l1.400-1.400M11.200 4.800l1.400-1.400"/>',
    shower: '<path d="M3 14V6a4 4 0 0 1 4-4h2.500M7 5.500l4 2.500H6.500z" fill="currentColor"/><path d="M8 10v1M10 10v1M12 10v1M7 13v1M9 13v1M11 13v1M13 13v1"/>',
    wind: '<path d="M1.500 5h8a2 2 0 1 0-2-2M1.500 8h11a2 2 0 1 1-2 2M1.500 11h6a2 2 0 1 1-2 2"/>',
    clap: '<path d="M6 14c-2-1-3.500-3-3-5.500l1-2.500 2 1.500L6.500 4l2 1 1-2.500 1.500.8-.8 2.200 2 .5c.5 3-1 6-3.500 7.500-1 .5-2 .6-3.200.5z" fill="currentColor" stroke="none"/>',
    quote: '<path d="M2 2.500h12v8H8l-3 3v-3H2z" fill="currentColor" stroke="none"/><path d="M5.500 5v2M9 5v2" stroke="var(--panel)" stroke-width="2"/>',
    cup: '<path d="M2.500 7h9v1.500a4.500 4.500 0 0 1-9 0zM11.500 7.500h1a1.500 1.500 0 0 1 0 3h-1.500M1.500 14h11" fill="currentColor"/>',
    mute: '<path d="M2 6h3l4-3.500v11L5 10H2zM11 5.500l3.500 5M14.500 5.500l-3.500 5" fill="currentColor"/>',
    chatwarn: '<path d="M1.500 3h10v7H6l-3 2.500V10h-1.500z M9 6h5.500v6h-1.500v2L10.500 12H9z" fill="currentColor" stroke="none"/><path d="M12 7.500v2.300M12 11v.2" stroke="var(--panel)"/>',
    hourglass: '<path d="M4 1.500h8M4 14.500h8M4.500 1.500c0 4 3.500 4.500 3.500 6.500S4.500 10.500 4.500 14.500M11.500 1.500c0 4-3.500 4.500-3.500 6.500s3.500 2.500 3.500 6.500" fill="currentColor"/>',
    timer: '<circle cx="8" cy="9" r="5.500"/><path d="M8 5.500V9l2 1.500M6 1.500h4M12.500 3.500l1 1"/>',
    laptop: '<rect x="3" y="3.500" width="10" height="7" rx="1" fill="currentColor" stroke="none"/><path d="M1.500 12.500h13"/>',
    mail: '<rect x="1.500" y="3" width="13" height="10" rx="1.500" fill="currentColor" stroke="none"/><path d="M2 4l6 5 6-5" stroke="var(--panel)"/>',
    mailopen: '<path d="M1.500 7L8 1.500 14.500 7v6.500h-13z" fill="currentColor" stroke="none"/><path d="M2 8l6 4 6-4" stroke="var(--panel)"/>',
    clipboard: '<rect x="3" y="2.500" width="10" height="12" rx="1.500" fill="currentColor" stroke="none"/><path d="M6 1.500h4v2H6z M5.500 7h5M5.500 9.500h5M5.500 12h3" stroke="var(--panel)"/>',
    chart: '<path d="M2 2v12h12M4 11l3-4 2.500 2.500L14 4"/>',
    calendar: '<rect x="2" y="3" width="12" height="11" rx="1.500" fill="currentColor" stroke="none"/><path d="M5 1.500v3M11 1.500v3M2 6.500h12M5 9h1M7.500 9h1M10 9h1M5 11.500h1M7.500 11.500h1M10 11.500h1" stroke="var(--panel)"/>',
    briefcase: '<rect x="1.500" y="5" width="13" height="9" rx="1.500" fill="currentColor" stroke="none"/><path d="M5.500 5V3h5v2M1.500 9h13" stroke="var(--panel)"/>',
    news: '<rect x="4.500" y="2" width="10" height="12" rx="1" fill="currentColor" stroke="none"/><path d="M4.500 5H2v7a2 2 0 0 0 2 2M7 5h5M7 8h5M7 11h3" stroke="var(--panel)"/>',
    bulb: '<path d="M8 1.500a4.500 4.500 0 0 0-2.500 8.200V12h5V9.700A4.500 4.500 0 0 0 8 1.500zM6.500 14h3" fill="currentColor"/>',
    bulboff: '<path d="M8 1.500a4.500 4.500 0 0 0-2.500 8.200V12h5V9.700A4.500 4.500 0 0 0 8 1.500zM6.500 14h3M2 2l12 12" fill="currentColor"/>',
    alarm: '<circle cx="8" cy="9" r="5" fill="currentColor" stroke="none"/><path d="M8 6.500V9l1.800 1.200M2 4.500l2.500-2M14 4.500l-2.500-2" stroke="var(--panel)"/><path d="M2 4.500l2.500-2M14 4.500l-2.500-2"/>',
    zzz: '<path d="M10 1.500A5.500 5.500 0 1 0 14 10 4.500 4.500 0 0 1 10 1.500z" fill="currentColor" stroke="none"/><path d="M9.500 2h3l-3 3h3M11.500 7h2l-2 2h2"/>',
    wine: '<path d="M4.500 1.500h7c.5 4-.5 7-3.500 7s-4-3-3.500-7zM8 8.500v5M5 14.500h6" fill="currentColor"/>',
    checkfill: '<circle cx="8" cy="8" r="6.500" fill="currentColor" stroke="none"/><path d="M5.200 8.200l2 2 3.600-4" stroke="var(--panel)"/>',
    gradcap: '<path d="M8 2.500L1 6l7 3.500L15 6zM4 8v3c1 1.500 7 1.500 8 0V8M14.500 6.500v4" fill="currentColor" stroke="none"/>',
    bookclosed: '<path d="M3.500 2.500h8a1 1 0 0 1 1 1v10h-8a1 1 0 0 1-1-1z" fill="currentColor" stroke="none"/><path d="M5.500 5h4M5.500 7h3" stroke="var(--panel)"/><path d="M3.500 12.500h9" stroke="var(--panel)"/>',
    notecircle: '<circle cx="8" cy="8" r="6"/><path d="M5.500 10.500l.5-2 4.500-4.500 1.500 1.500L7.500 10zM4.500 5l6.500 6.500"/>',
    undo: '<path d="M6 3.500L2.500 7 6 10.500M3 7h6a4 4 0 0 1 0 8H7"/>',
    books: '<path d="M2 3h2.500v10H2zM5.500 3H8v10H5.500zM9 5l2.300-.6 2.500 8.600-2.300.6zM2 11h2.500M5.500 11H8"/>',
    lines: '<path d="M2 3.500h12M2 6.500h12M2 9.500h6M2 12.500h6M10 11l2 2 2.500-3" />',
    langbox: '<rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" stroke="none"/><path d="M5 11.500L8 4.500l3 7M6 9.500h4" stroke="var(--panel)"/>',
    film: '<rect x="1.500" y="3" width="13" height="10" rx="1" fill="currentColor" stroke="none"/><path d="M4.500 3v10M11.500 3v10M1.500 6h3M1.500 10h3M11.500 6h3M11.500 10h3" stroke="var(--panel)"/>',
    headphones: '<path d="M2.500 10V8a5.500 5.500 0 0 1 11 0v2"/><rect x="2" y="9.500" width="3" height="4.500" rx="1" fill="currentColor"/><rect x="11" y="9.500" width="3" height="4.500" rx="1" fill="currentColor"/>',
    aa: '<path d="M1.500 12L4.500 4l3 8M2.800 9h3.400M9.500 12V7.500a2 2 0 0 1 3.500-1M9.500 9.500c0-1.500 3.500-1.500 3.500 0V12" />',
    people: '<circle cx="5.500" cy="5" r="2" fill="currentColor" stroke="none"/><circle cx="11" cy="5.500" r="1.700" fill="currentColor" stroke="none"/><path d="M1.500 13c0-3 2-4.500 4-4.500s4 1.500 4 4.500zM10 9c2 0 4.500 1 4.500 4H11.500" fill="currentColor" stroke="none"/>',
    chat: '<path d="M8 2.500c3.500 0 6 2 6 4.700S11.500 12 8 12H6l-3 2v-3.500C2.500 9.500 2 8.500 2 7.200 2 4.500 4.500 2.500 8 2.500z" fill="currentColor" stroke="none"/>',
    calplus: '<rect x="2" y="3" width="11" height="10" rx="1.500" fill="currentColor" stroke="none"/><path d="M4.500 1.500v3M10.500 1.500v3M2 6.500h11" stroke="var(--panel)"/><circle cx="12" cy="12" r="3" fill="#e8913a" stroke="var(--panel)"/><path d="M12 10.500v3M10.500 12h3" stroke="var(--panel)"/>',
    userplus: '<circle cx="8" cy="8" r="6.500"/><circle cx="8" cy="6.300" r="2" fill="currentColor"/><path d="M4.500 12c1-1.500 2.200-2 3.500-2s2.500.5 3.500 2M1.500 12.500h3M3 11v3"/>',
    idcard: '<rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" stroke="none"/><circle cx="6" cy="7" r="1.500" stroke="var(--panel)"/><path d="M4 11c.5-1.500 3.500-1.500 4 0M9.500 6h2.500M9.500 9h2.500" stroke="var(--panel)"/>',
    creditcard: '<rect x="1.500" y="3" width="13" height="10" rx="1.500" fill="currentColor" stroke="none"/><path d="M1.500 6.500h13M3.500 10.500h3" stroke="var(--panel)"/>',
    list: '<rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" stroke="none"/><path d="M4.500 5.500h1M7 5.500h4.500M4.500 8h1M7 8h4.500M4.500 10.500h1M7 10.500h4.500" stroke="var(--panel)"/>',
    cash: '<rect x="1.500" y="4" width="13" height="8" rx="1" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.800" stroke="var(--panel)"/><path d="M3.500 6v4M12.500 6v4" stroke="var(--panel)"/>',
    bars: '<rect x="2" y="8.500" width="3" height="5" rx=".5" fill="currentColor" stroke="none"/><rect x="6.500" y="5" width="3" height="8.500" rx=".5" fill="currentColor" stroke="none"/><rect x="11" y="2.500" width="3" height="11" rx=".5" fill="currentColor" stroke="none"/>',
    house: '<path d="M1.500 8L8 2l6.500 6M3.500 7v7h3.500v-4h2v4h3.500V7" fill="currentColor" stroke="none"/>',
    tshirt: '<path d="M5.500 2L1.500 4.500l1.500 3L4.500 7v7h7V7l1.500.5 1.500-3L10.500 2c-.5 1.500-4.500 1.500-5 0z" fill="currentColor" stroke="none"/>',
    washer: '<rect x="2" y="1.500" width="12" height="13" rx="2" fill="currentColor" stroke="none"/><circle cx="8" cy="9" r="3.500" stroke="var(--panel)"/><path d="M4.500 4h1M7 4h1" stroke="var(--panel)"/>',
    cart: '<path d="M1.500 2.500h2l1.500 7h7l1.500-5H4.200M6 13.500h.1M11 13.500h.1" fill="currentColor" stroke-width="2"/>',
    trash: '<path d="M2.500 4h11M6 4V2.500h4V4M3.800 4.500l.7 9h7l.7-9z M6.500 6.500v5M9.500 6.500v5" fill="currentColor"/>',
    drawer: '<path d="M2 6l2-3.500h8L14 6v7.500H2z" fill="currentColor" stroke="none"/><path d="M2 8.500h3.500l1 1.500h3l1-1.500H14" stroke="var(--panel)"/>',
    brush: '<path d="M13.500 2.500L7 9l1.500 1.500L15 4zM6.500 9.500C4.500 9.500 4 11 3.500 12.500c-.3 1-.8 1.500-1.500 1.500 2.500.5 5.500 0 6-2.500z" fill="currentColor" stroke="none"/>',
    hammer: '<path d="M2 13.500l7-7M7 3.500l3-1.500 4 4-1.500 3-2.500-1.500-1.500-1.500z" fill="currentColor"/>',
    notes: '<path d="M2 14V8l3-1v7M2 10.500l3-1M7 14V6.500M7 9h2.500M7 12h2.500M11 14V3h2.500M11 6h2.500M11 9h2.500M11 12h2.500"/>',
    camera: '<path d="M1.500 5h3l1-2h5l1 2h3v8.500h-13z" fill="currentColor" stroke="none"/><circle cx="8" cy="9" r="2.500" stroke="var(--panel)"/>',
    flame: '<path d="M8 1.500c.5 2.500 4 4 4 8a4 4 0 0 1-8 0c0-1.500.5-2.500 1.500-3.500.2 1 .8 1.500 1.500 1.500C7 6 7 3.500 8 1.500z" fill="currentColor" stroke="none"/>',
    heartbolt: '<path d="M8 14C3 10.500 2 8 2 6.500a3 3 0 0 1 6-.5 3 3 0 0 1 6 .5c0 1.500-1 4-6 7.500z" fill="currentColor" stroke="none"/><path d="M8.800 5L6.500 8.500H9L7.800 11.500" stroke="var(--panel)"/>',
    person: '<circle cx="8" cy="2.800" r="1.500" fill="currentColor" stroke="none"/><path d="M5.500 6.500h5v4H9.500V14h-3v-3.500H5.500z" fill="currentColor" stroke="none"/>',
    arrowup: '<path d="M3 13L13 3M6 3h7v7"/>',
    bike: '<circle cx="3.500" cy="11" r="2.500"/><circle cx="12.500" cy="11" r="2.500"/><path d="M3.500 11L6.500 5.500h4l2 5.500M6.500 5.500L8 11h4.500M5.500 4h2"/>',
    stopwatch: '<circle cx="8" cy="9" r="5.500" fill="currentColor" stroke="none"/><path d="M8 5.500V9l2 1.500" stroke="var(--panel)"/><path d="M6.500 1.500h3M8 1.500v2.500"/>',
    swim: '<circle cx="11" cy="4" r="1.300"/><path d="M1.500 12c1.500 0 1.500-1 3-1s1.500 1 3 1 1.500-1 3-1 1.500 1 3 1M2 9l4-3 3 1.500M1.500 14.500c1.500 0 1.500-1 3-1s1.500 1 3 1 1.500-1 3-1 1.500 1 3 1"/>',
    wheelchair: '<circle cx="7" cy="2.500" r="1.300" fill="currentColor"/><path d="M7 4.500V9h4l1.500 4M7 6.500h3M5 7.500a4 4 0 1 0 5.500 5"/>'
  };
  const C = { text: 'var(--text)', cyan: '#4fd0e6', lime: '#5fd068', teal: '#4fc4b0', yellow: '#e8b83a', orange: '#e8913a', pink: '#e0629a', indigo: '#6a5ae0', red: '#e5566d', blue: '#5a8cf0', purple: '#b055d6', rose: '#d9606e', crimson: '#d9503c', violet: '#8b3fe0', green: '#4cc46a', sky: '#4fb0e0', deep: '#5a4fe0', amber: '#e8913a', lemon: '#ece23c', chartreuse: '#a4d83c' };

  // TODO: replace with a real library source; entries are placeholders for the prototype.
  // item: [name, icon, icon colour, comment, opts]   group: { g: title, icon, c, cm, items }
  const it = (n, k, c, cm, o = {}) => ({ n, k, c, cm, ...o });
  const LIB = {
    'popular': [
      { g: 'the starter pack', icon: 'spark', c: C.text, cm: 'gentle, keepable first week', items: [
        it('drink water', 'drop', C.cyan, 'a glass with each meal helps'),
        it('walk 10k steps', 'walk', C.lime, 'a brisk stroll counts'),
        it('meditate', 'head', C.teal, 'any length beats none'),
        it('read 20 pages', 'book', C.yellow, 'morning or bedtime — your call'),
        it('gratitude', 'heart', C.yellow, 'three things is plenty') ] },
      { g: 'morning kickstart', icon: 'sun', c: C.orange, cm: 'shape the first 30 minutes', items: [
        it('morning glass of water', 'drop', C.cyan, 'before coffee'),
        it('stretch', 'stretch', C.lime, '2 minutes is a start'),
        it('set intentions for the day', 'flag', C.orange, 'one word can do it'),
        it('mood check-in', 'mood', C.pink, 'one word, no analysis') ] },
      { g: 'evening wind-down', icon: 'moon', c: C.indigo, cm: 'cue the day into closing', items: [
        it('no screens', 'noscreen', C.purple, 'swap for a book or chat'),
        it('tidy the kitchen', 'spark', C.indigo, 'tomorrow-you starts here'),
        it('evening read', 'book', C.yellow, 'paper beats a phone'),
        it('in bed by 11pm', 'bed', C.indigo, 'give yourself a 30min runway') ] },
      it('workout 3x per week', 'dumbbell', C.red, 'pick any three days', { name: C.red, w: '[w 0/3]', weekly: true }),
      it('8 hours of sleep', 'moon', C.indigo, 'wind down helps you hit it', { name: C.indigo }),
      it('journal', 'check', C.blue, 'one paragraph counts', { name: C.blue }),
      it('call mom', 'phone', C.pink, 'sunday by default', { name: C.pink }),
      it('no phone in bed', 'nophone', C.purple, 'charge it in another room', { name: C.purple })
    ],
    'health & fitness': [
      { g: 'morning workout', icon: 'dumbbell', c: C.text, cm: 'full strength block, 3x/week', items: [
        it('warm up', 'warmup', C.text, 'loose, not stretched'),
        it('strength training', 'lift', C.red, 'any split works — push, pull, legs'),
        it('cardio', 'run', C.orange, 'anything that leaves you breathing hard'),
        it('cool down stretch', 'cooldown', C.teal, 'the part most people skip') ] },
      { g: 'post-workout recovery', icon: 'recovery', c: C.text, cm: 'pair with morning workout', items: [
        it('foam roll', 'foam', C.text, 'hit sore spots first'),
        it('rehydrate', 'drop', C.cyan, '2 extra glasses'),
        it('protein shake', 'fish', C.text, 'within an hour of finishing'),
        it('recovery walk', 'walk', C.green, 'easy pace, loose shoulders') ] },
      { g: 'healthy eating', icon: 'utensils', c: C.text, cm: 'simple daily checklist', items: [
        it('eat fruit', 'apple', C.red, 'fresh, frozen, whole — any counts'),
        it('eat vegetables', 'carrot', C.green, 'aim for three colors'),
        it('hit protein goal', 'fish', C.text, 'spread it across the day'),
        it('take vitamins', 'pills', C.lime, 'keep them where you can see them') ] },
      it('run 5km', 'run', C.orange, 'distance follows your locale', { name: C.orange, w: '[w 0/2]', weekly: true }),
      it('log weight', 'scale', C.lime, 'same day, same time of week', { name: C.lime, w: '[w 0/1]', weekly: true }),
      it('floss', 'lips', C.pink, 'thirty seconds, big payoff', { name: C.pink }),
      it('skincare', 'smile', C.rose, 'cleanse, then moisturise', { name: C.rose }),
      it('no soda today', 'ban', C.crimson, 'a small no-streak', { name: C.crimson }),
      it('brush teeth 2x', 'lips', C.text, 'morning and night', { name: C.text }),
      it('no eating after 8pm', 'clockfill', C.violet, 'give your body 12 hours off', { name: C.violet }),
      it('sunlight exposure', 'sunburst', C.yellow, 'best within an hour of waking', { name: C.yellow }),
      it('cold shower', 'shower', C.cyan, 'start with 30 seconds', { name: C.cyan })
    ],
    'mindfulness': [
      { g: 'morning meditation', icon: 'head', c: C.text, cm: 'ten min, whole day shifts', items: [
        it('breathing practice', 'wind', C.cyan, 'long exhale, easy inhale'),
        it('deep meditation', 'head', C.teal, 'your method, your pace'),
        it('gratitude journal', 'clap', C.yellow, 'one line is enough'),
        it('morning affirmations', 'quote', C.purple, 'one sentence, said out loud') ] },
      { g: 'mindful break', icon: 'leaf', c: C.text, cm: 'a midday reset, 3 minutes', items: [
        it('step away from screen', 'noscreen', C.text, 'feet on floor, eyes out a window'),
        it('3-min breathing', 'wind', C.cyan, 'slow the out-breath'),
        it('drink something warm', 'cup', C.orange, 'let it warm your hands too') ] },
      it('5 minutes of silence', 'mute', C.teal, 'no phone, no music, no input', { name: C.teal }),
      it('no negative self-talk', 'chatwarn', C.red, 'catch the thought, then let it go', { name: C.red }),
      it('pause before reacting', 'hourglass', C.green, 'one breath before you answer', { name: C.green }),
      it('weekly digital detox', 'nophone', C.yellow, 'one screen-free morning', { name: C.yellow }),
      it('mindful walk', 'walk', C.teal, 'leave the phone at home', { name: C.teal })
    ],
    'focus & work': [
      { g: 'deep work block', icon: 'target', c: C.text, cm: 'protect 90 focused minutes', items: [
        it('clear desk', 'spark', C.text, 'even a single stack moved counts'),
        it('do not disturb', 'nophone', C.text, 'phone face-down, apps closed'),
        it('90-min focus block', 'timer', C.red, 'no tabs, no apps'),
        it('take a break', 'leaf', C.green, 'stand, walk, water, back') ] },
      { g: 'workday shutdown', icon: 'laptop', c: C.text, cm: 'close the day, leave it there', items: [
        it('inbox to zero', 'mail', C.blue, 'reply, defer, file, delete'),
        it("review today's wins", 'checkfill', C.yellow, 'two things worth a nod'),
        it('plan tomorrow', 'clipboard', C.orange, 'pick the three biggest tasks'),
        it('close laptop', 'laptop', C.text, 'a clear end to the day') ] },
      { g: 'weekly review', icon: 'chart', c: C.text, cm: '30 minutes that compound', items: [
        it("review last week's goals", 'flag', C.text, 'what moved, what stalled, what got skipped'),
        it('clear inbox', 'mailopen', C.blue, "don't read everything — just clear it"),
        it('set goals for next week', 'target', C.purple, 'no more than three real priorities'),
        it('plan key meetings', 'calendar', C.text, 'know the ask before you go in') ] },
      it('4 hours of deep work', 'timer', C.crimson, 'spread across two sessions', { name: C.crimson }),
      it('pomodoro sessions', 'hourglass', C.yellow, 'tap once per session', { name: C.yellow }),
      it('log work hours', 'briefcase', C.blue, 'a true picture, not a goal', { name: C.blue }),
      it('no social media before noon', 'nophone', C.yellow, 'give mornings to your own thoughts', { name: C.yellow }),
      it('no meetings before 10am', 'calendar', C.text, 'protect the best thinking hours', { name: C.text }),
      it('read industry news', 'news', C.blue, 'stop after ten minutes', { name: C.blue })
    ],
    'sleep & recovery': [
      { g: 'wind-down routine', icon: 'moon', c: C.deep, cm: 'a 30-min glide into bed', items: [
        it('dim lights', 'bulb', C.yellow, "warm tones tell the body it's late"),
        it('herbal tea', 'cup', C.orange, 'caffeine-free'),
        it('bedtime read', 'book', C.yellow, 'fiction calms better than news') ] },
      { g: 'sleep prep', icon: 'zzz', c: C.deep, cm: 'the last five minutes', items: [
        it('set alarm', 'alarm', C.indigo, 'one alarm, no snooze'),
        it('lights off', 'bulboff', C.indigo, 'dark room, cool room'),
        it('breathing relaxation', 'wind', C.sky, 'try the 4-7-8 pattern') ] },
      it('wake by 7am', 'alarm', C.amber, "tap as soon as you're up", { name: C.amber }),
      it('no screens 1hr before bed', 'noscreen', C.deep, 'phones on the shelf, not the nightstand', { name: C.deep }),
      it('no caffeine after 2pm', 'cup', C.amber, "it lingers longer than you'd think", { name: C.amber }),
      it('afternoon power nap', 'moon', C.purple, '20 min, set a timer', { name: C.purple }),
      it('no alcohol tonight', 'wine', C.text, 'a no-streak', { name: C.text })
    ],
    'learning': [
      { g: 'daily learning', icon: 'gradcap', c: C.text, cm: '30 min a day stacks fast', items: [
        it('study session', 'bookclosed', C.yellow, 'timer on, distractions off'),
        it('take notes', 'notecircle', C.yellow, 'in your own words'),
        it("review yesterday's notes", 'undo', C.text, 'recall first, re-read only if stuck') ] },
      { g: 'weekend study block', icon: 'books', c: C.text, cm: 'a deeper session, pick a time', items: [
        it('deep study', 'bookclosed', C.yellow, 'one topic, all the way in'),
        it('one new concept', 'bulb', C.yellow, 'something you could explain out loud'),
        it('summarise what you learned', 'lines', C.blue, 'a paragraph is plenty') ] },
      it('duolingo lesson', 'langbox', C.green, 'any lesson, any length', { name: C.green }),
      it('watch a documentary', 'film', C.purple, "pick something you normally wouldn't", { name: C.purple, w: '[w 0/1]', weekly: true }),
      it('listen to a podcast', 'headphones', C.orange, 'commutes and chores are gold', { name: C.orange }),
      it('learn 5 new words', 'aa', C.blue, 'any language', { name: C.blue }),
      it('online course', 'gradcap', C.yellow, 'one bite at a time', { name: C.yellow }),
      it('review your notes', 'undo', C.teal, 'recall first, re-read second', { name: C.teal, w: '[w 0/1]', weekly: true })
    ],
    'relationships': [
      { g: 'connect with loved ones', icon: 'people', c: C.text, cm: 'a sunday ritual', items: [
        it('call family', 'phone', C.pink, 'any call counts'),
        it('text friends', 'chat', C.cyan, 'even a meme counts'),
        it('plan something for the week', 'calplus', C.text, 'pick a day, send the invite') ] },
      it('call dad', 'phone', C.blue, 'any length works', { name: C.blue, w: '[w 0/1]', weekly: true }),
      it('date night', 'heart', C.pink, 'both phones stay in the drawer', { name: C.pink }),
      it('quality time with partner', 'idcard', C.red, 'undivided — phones away', { name: C.red }),
      it('reach out to old friend', 'userplus', C.green, "someone you've drifted from", { name: C.green, w: '[w 0/1]', weekly: true }),
      it('family dinner', 'utensils', C.yellow, 'phones off the table', { name: C.yellow, w: '[w 0/3]', weekly: true }),
      it('no phone at the table', 'nophone', C.text, 'eye contact over notifications', { name: C.text })
    ],
    'finance': [
      { g: 'weekly money check-in', icon: 'chart', c: C.text, cm: '15 min/week, money on rails', items: [
        it("review week's spending", 'creditcard', C.yellow, 'look at the top five line items'),
        it('log expenses', 'list', C.text, 'fill any gaps in your tracker'),
        it('transfer to savings', 'cash', C.green, 'even 10% helps'),
        it('check budget vs plan', 'bars', C.yellow, 'adjust before next week') ] },
      it('no impulse buys', 'ban', C.lemon, 'wait 48 hours before you buy', { name: C.lemon }),
      it('meal at home', 'utensils', C.orange, 'a cheaper, better dinner', { name: C.orange, w: '[w 0/5]', weekly: true }),
      it('track investments', 'chart', C.green, 'a glance, not a deep dive', { name: C.green, w: '[w 0/1]', weekly: true }),
      it('save weekly amount', 'cash', C.lemon, 'any amount builds the habit', { name: C.lemon, w: '[w 0/1]', weekly: true })
    ],
    'home': [
      { g: 'morning tidy', icon: 'spark', c: C.text, cm: 'five minutes, three things', items: [
        it('make the bed', 'bed', C.text, 'signals the room is on'),
        it('wipe surfaces', 'spark', C.text, 'counter and desk is a good start'),
        it('water plants', 'leaf', C.green, 'skip the ones still damp') ] },
      { g: 'evening reset', icon: 'house', c: C.text, cm: 'close day, house ready', items: [
        it('dishes done', 'utensils', C.text, 'a clean sink is half the fight'),
        it("lay out tomorrow's clothes", 'tshirt', C.text, 'tomorrow-you will thank you'),
        it('turn off lights', 'bulboff', C.yellow, 'kitchen, hallway, bathroom') ] },
      { g: 'weekend cleanup', icon: 'spark', c: C.text, cm: 'weekly reset, in one go', items: [
        it('laundry', 'washer', C.cyan, 'start early — it takes all day'),
        it('vacuum', 'wind', C.text, 'high-traffic areas first'),
        it('groceries', 'cart', C.orange, 'the list beats the wander'),
        it('take out trash', 'trash', C.text, 'all bins, not just the kitchen') ] },
      it('meal prep sunday', 'utensils', C.orange, 'future-you eats better', { name: C.orange }),
      it('10 minute tidy', 'spark', C.purple, 'timer on — and a timer off', { name: C.purple }),
      it('change bed sheets', 'bed', C.text, 'fresh sheets help sleep', { name: C.text, w: '[w 0/1]', weekly: true }),
      it('declutter one drawer', 'drawer', C.teal, 'one drawer, no more', { name: C.teal, w: '[w 0/1]', weekly: true })
    ],
    'creativity': [
      { g: 'morning pages', icon: 'notecircle', c: C.text, cm: 'three pages, no editing', items: [
        it('free writing', 'pen', C.blue, 'whatever comes up'),
        it('capture one idea', 'bulb', C.yellow, "write it before it's gone"),
        it('sketch something', 'brush', C.pink, 'bad drawings count') ] },
      { g: 'creative session', icon: 'brush', c: C.text, cm: 'protected time for your craft', items: [
        it('tidy your workspace', 'spark', C.text, 'one sweep, two minutes'),
        it('work on side project', 'hammer', C.purple, 'small progress still counts'),
        it('log what you made', 'checkfill', C.green, 'even half-finished is worth noting') ] },
      it('write 500 words', 'pen', C.blue, "don't edit while you draft", { name: C.blue }),
      it('practice instrument', 'notes', C.purple, 'small and daily beats long and rare', { name: C.purple }),
      it('take a photo today', 'camera', C.teal, 'phone cameras work fine', { name: C.teal })
    ],
    'apple health': [
      it('daily steps', 'walk', C.chartreuse, 'auto-counts from iPhone or Apple Watch', { name: C.chartreuse, ro: true }),
      it('exercise minutes', 'flame', C.yellow, 'closes your green ring', { name: C.yellow, ro: true }),
      it('active energy', 'heartbolt', C.orange, 'calories you actually move', { name: C.orange, ro: true }),
      it('stand hours', 'person', C.blue, 'at least one minute per hour', { name: C.blue, ro: true }),
      it('flights climbed', 'arrowup', C.green, 'take the stairs today', { name: C.green, ro: true }),
      it('walk/run distance', 'run', C.text, 'every step on your feet counts', { name: C.text, ro: true }),
      it('cycle distance', 'bike', C.text, 'commute or joyride', { name: C.text, w: '[w 0/3]', ro: true }),
      it('weigh in', 'scale', C.text, 'syncs your latest reading', { name: C.text, w: '[w 0/1]', ro: true }),
      it('sleep duration', 'bed', C.deep, 'from your sleep schedule', { name: C.deep, ro: true }),
      it('mindful minutes', 'head', C.teal, 'any mindful session counts', { name: C.teal, ro: true }),
      it('work out', 'lift', C.red, 'any workout counts', { name: C.red, w: '[w 0/4]', ro: true }),
      it('workout minutes', 'stopwatch', C.text, 'time spent training', { name: C.text, w: '[w 0/3]', ro: true }),
      it('time in daylight', 'sunburst', C.yellow, 'needs an apple watch to record', { name: C.yellow, ro: true }),
      it('stand minutes', 'person', C.text, 'time on your feet, not hours', { name: C.text, ro: true }),
      it('swim distance', 'swim', C.blue, 'laps add up', { name: C.blue, w: '[w 0/2]', ro: true }),
      it('wheelchair distance', 'wheelchair', C.text, 'needs wheelchair mode in apple health', { name: C.text, ro: true }),
      it('wheelchair pushes', 'wheelchair', C.chartreuse, 'your steps equivalent', { name: C.chartreuse, ro: true }),
      it('hit protein target', 'utensils', C.text, 'needs a food logger that writes to apple health', { name: C.text, ro: true }),
      it('hit fibre target', 'leaf', C.green, 'needs a food logger that writes to apple health', { ro: true })
    ]
  };
  // optional intro line shown above a tab's list
  const NOTES = { 'apple health': 'apple health habits sync from the mobile app — browse only here' };

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const ico = (k, c) => `<svg class="i" viewBox="0 0 16 16" style="color:${c}">${P[k]}</svg>`;
  const row = (h, grp) => grp
    ? `<div class="hlg"><div class="hlr"><span class="gi">${ico(h.icon, h.c)}</span><b style="color:${h.c}">${esc(h.g)}</b><button type="button" class="ad" data-group="${esc(h.g)}">[add]</button></div><div class="hlc">// ${esc(h.cm)}</div>${h.items.map(i => row(i)).join('')}</div>`
    : `<div class="hli"><div class="hlr"><span class="bx">[ ]</span><span class="gi">${ico(h.k, h.c)}</span><span class="nm"${h.name ? ` style="color:${h.name}"` : ''}>${esc(h.n)}</span>${h.w ? `<span class="w">${h.w}</span>` : ''}<button type="button" class="ad"${h.ro ? ' disabled aria-disabled="true" title="browse only — syncs from the mobile app"' : ''} data-name="${esc(h.n)}" data-cm="${esc(h.cm)}"${h.weekly ? ' data-weekly' : ''}>[add]</button></div><div class="hlc">// ${esc(h.cm)}</div></div>`;

  const tabs = $('hltabs'), body = $('hlbody');
  let current = 'popular';
  const draw = () => {
    tabs.innerHTML = Object.keys(LIB).map(k => `<button type="button" role="tab" aria-selected="${k === current}" data-tab="${k}">${k}</button>`).join('');
    body.innerHTML = (NOTES[current] ? `<div class="sub">// ${esc(NOTES[current])}</div>` : '') + LIB[current].map(h => row(h, !!h.g)).join('');
    const sel = tabs.querySelector('[aria-selected="true"]');
    if (sel) { const a = sel.getBoundingClientRect(), b = tabs.getBoundingClientRect(); if (a.left < b.left) tabs.scrollLeft -= b.left - a.left + 8; else if (a.right > b.right) tabs.scrollLeft += a.right - b.right + 8; }
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    current = b.dataset.tab; draw(); lp.querySelector('.scroll').scrollTop = 0;
  });
  body.addEventListener('click', e => {
    const b = e.target.closest('.ad'); if (!b || b.disabled) return;   // read-only (apple health) items can't be added
    if (b.dataset.group) {
      // TODO: routines are not built yet; this should pre-fill a routine with the group's habits.
      const n = $('hlnote'); n.textContent = '// routines are not available yet'; clearTimeout(n.t); n.t = setTimeout(() => n.textContent = '', 3000);
      return;
    }
    $('addh').click();                                   // opens "habit --new", closing this panel
    const hn = $('hn'), hc = $('hc');
    hn.value = b.dataset.name; hc.value = b.dataset.cm.slice(0, 30);
    hn.dispatchEvent(new Event('input')); hc.dispatchEvent(new Event('input'));
    if (b.hasAttribute('data-weekly')) { const w = np.querySelector('[data-g] [data-v]:nth-child(2)'); if (w) w.click(); }
  });

  const close = () => {
    if (!lp.classList.contains('open')) return;
    hide(lp); ka.style.display = 'none'; km.style.display = 'flex'; tab.classList.remove('act');
  };
  const prevClose = window.__closeHelp;               // closes help, feedback, profile and overview panels
  const open = () => {
    if (np.classList.contains('open')) $('cancel').click();
    if (window.__closeAppearance) window.__closeAppearance();
    if (prevClose) prevClose();
    draw();
    lp.classList.add('open'); lp.setAttribute('aria-hidden', 'false'); lp.querySelector('.scroll').scrollTop = 0;
    km.style.display = 'none'; kn.style.display = 'none'; ka.style.display = 'flex'; tab.classList.add('act');
  };
  window.__closeHelp = () => { if (prevClose) prevClose(); close(); };

  document.querySelector('[data-open="library"]').addEventListener('click', e => {
    e.preventDefault(); open(); e.currentTarget.closest('.nv').classList.remove('open');
  });
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if ((o && o.dataset.open !== 'library') || e.target.closest('#addh')) close();
  }, true);
  $('hlclose').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
