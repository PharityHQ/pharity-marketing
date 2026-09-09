/* ============================================================================
   PHARITY: shared marketing shell behavior

   Include at the end of <body>:   <script src="assets/pharity-site.js"></script>
   And this, early in <head>, so the reveal state is gated before first paint:
     <script>document.documentElement.classList.add('js')</script>

   Exposes: window.Pharity = { icon, hardware, mountHardware, revealScan }

   Everything here degrades. With JS disabled the page is fully readable: the
   nav collapses into a <details> disclosure that opens natively, reveal
   elements never hide, and the hardware container falls back to a silhouette.
   ========================================================================== */
(function () {
  'use strict';

  var d = document;
  var root = d.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  /* ── Icons ─────────────────────────────────────────────────────────────
     One stroke set, 24-grid, currentColor. Keep them plain: they read at
     10px inside the device mock.                                          */

  var P = {
    grid:      '<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1.2"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/>',
    refresh:   '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
    users:     '<path d="M16 20v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="9" cy="7" r="3.2"/><path d="M22 20v-1.6a4 4 0 0 0-3-3.9"/><path d="M16.5 3.9a4 4 0 0 1 0 7.2"/>',
    pill:      '<rect x="2.6" y="8.4" width="18.8" height="7.2" rx="3.6" transform="rotate(-45 12 12)"/><path d="M8.5 8.5l7 7"/>',
    doc:       '<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h4"/>',
    star:      '<path d="m12 3 2.7 5.7 6 .9-4.35 4.3 1.03 6.1L12 17.9 6.62 20l1.03-6.1L3.3 9.6l6-.9z"/>',
    building:  '<path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15"/><path d="M14 10h4a2 2 0 0 1 2 2v9"/><path d="M2 21h20"/><path d="M7.5 8h3M7.5 12h3M7.5 16h3"/>',
    usercog:   '<circle cx="9.5" cy="7.5" r="3.4"/><path d="M2.6 20.5a7 7 0 0 1 11-5.4"/><circle cx="17.5" cy="17.5" r="2.6"/><path d="M17.5 13.4v1.2M17.5 20.4v1.2M13.4 17.5h1.2M20.4 17.5h1.2"/>',
    video:     '<rect x="2.5" y="6" width="13" height="12" rx="2.4"/><path d="m15.5 10.5 6-3.2v9.4l-6-3.2z"/>',
    activity:  '<path d="M3 12h4l2.6-7 4.4 14 2.6-7H21"/>',
    package:   '<path d="m12 2.6 8.4 4.6v9.6L12 21.4 3.6 16.8V7.2z"/><path d="m3.6 7.2 8.4 4.6 8.4-4.6"/><path d="M12 11.8v9.6"/>',
    chart:     '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    settings:  '<circle cx="12" cy="12" r="3.1"/><path d="M19.2 14.6a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.47V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-.97H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.47-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.77.32H9a1.6 1.6 0 0 0 .97-1.47V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 .97 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.77V9a1.6 1.6 0 0 0 1.47.97H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.47.97z"/>',
    plus:      '<path d="M12 5v14M5 12h14"/>',
    search:    '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    bell:      '<path d="M18 8.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/>',
    sparkle:   '<path d="m12 3 1.9 4.9L19 9.8l-5.1 1.9L12 16.6l-1.9-4.9L5 9.8l5.1-1.9z"/><path d="M19 15.5 19.8 18l2.2.9-2.2.9-.8 2.5-.8-2.5-2.2-.9 2.2-.9z"/>',
    send:      '<path d="M21.5 2.5 11 13"/><path d="M21.5 2.5 15 21.5l-4-8.5-8.5-4z"/>',
    checkcirc: '<circle cx="12" cy="12" r="9"/><path d="m8.4 12.2 2.5 2.5 4.9-5"/>',
    filter:    '<path d="M3 5h18l-7 8.2V20l-4 1.5v-8.3z"/>',
    pencil:    '<path d="M16.4 3.6a2.3 2.3 0 0 1 3.2 3.2L7.4 19 3 20.5 4.5 16z"/>',
    arrow:     '<path d="M4.5 12h14"/><path d="m13 6.5 5.5 5.5L13 17.5"/>',
    chev:      '<path d="m9 5 7 7-7 7"/>',
    truck:     '<path d="M2.5 6.5h10.5v9H2.5z"/><path d="M13 9.5h4l3 3.2v2.8h-7z"/><circle cx="6.5" cy="18" r="1.9"/><circle cx="17" cy="18" r="1.9"/>',
    bars:      '<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',
    x:         '<path d="M6 6l12 12M18 6 6 18"/>',
    shield:    '<path d="M12 2.8 20 6v6c0 5-3.4 8.1-8 9.2C7.4 20.1 4 17 4 12V6z"/><path d="m8.8 12.2 2.3 2.3 4.1-4.3"/>',
    lock:      '<rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/>',
    route:     '<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.6 6H14a4 4 0 0 1 0 8h-4a4 4 0 0 0 0 8h5.4" transform="translate(0 -4)"/>',
    card:      '<rect x="2.5" y="5" width="19" height="14" rx="2.4"/><path d="M2.5 10h19"/>',
    home:      '<path d="m3 10.5 9-7 9 7V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20z"/>',
    list:      '<path d="M8 6.5h13M8 12h13M8 17.5h13"/><path d="M3.5 6.5h.01M3.5 12h.01M3.5 17.5h.01"/>',
    user:      '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    wifi:      '<path d="M2.5 9a15 15 0 0 1 19 0"/><path d="M6 12.6a10 10 0 0 1 12 0"/><path d="M9.4 16.2a5 5 0 0 1 5.2 0"/><path d="M12 19.6h.01"/>',
    battery:   '<rect x="2" y="8" width="17" height="8" rx="2.2"/><path d="M21.5 11v2"/>',
    signal:    '<path d="M3 18.5v-3M8.3 18.5v-6M13.7 18.5v-9M19 18.5v-12"/>'
  };

  function icon(name, cls) {
    var p = P[name];
    if (!p) return '';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (cls ? ' class="' + cls + '"' : '') + '>' + p + '</svg>';
  }
  function iconFill(name) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + (P[name] || '') + '</svg>';
  }
  var appleGlyph =
    '<svg class="ph-hw__apple" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.2 1.2-2.5 1.3-2.5-.1 0-2.5-1-2.5-3.6M14.2 5.5c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3"/></svg>';

  /* ── Reveal on scroll ─────────────────────────────────────────────────── */

  function revealScan(scope) {
    var els = (scope || d).querySelectorAll('[data-reveal]:not([data-rv-bound])');
    if (!els.length) return;
    if (reduced.matches || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) {
        el.setAttribute('data-rv-bound', '');
        el.classList.add('is-in');
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      // Stagger siblings that enter together, capped at 5 steps.
      var hits = entries.filter(function (e) { return e.isIntersecting; });
      var byParent = new Map();
      hits.forEach(function (e) {
        var k = e.target.parentNode;
        if (!byParent.has(k)) byParent.set(k, 0);
        var n = byParent.get(k);
        e.target.style.transitionDelay = Math.min(n, 5) * 60 + 'ms';
        byParent.set(k, n + 1);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(els, function (el) {
      el.setAttribute('data-rv-bound', '');
      io.observe(el);
    });
  }

  /* ── Nav ──────────────────────────────────────────────────────────────── */

  function initNav() {
    var nav = d.querySelector('.ph-nav');
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle('is-scrolled', window.scrollY > 4);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // The disclosure already works without JS. These are conveniences.
    var dis = d.querySelector('.ph-nav__disclosure');
    if (!dis) return;

    d.addEventListener('click', function (e) {
      if (dis.open && !dis.contains(e.target)) dis.open = false;
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dis.open) {
        dis.open = false;
        var s = dis.querySelector('summary');
        if (s) s.focus();
      }
    });
    dis.addEventListener('click', function (e) {
      if (e.target.closest('.ph-nav__panel a')) dis.open = false;
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1000) dis.open = false;
    });
  }

  /* ── Demo data ─────────────────────────────────────────────────────────
     Sample only. Prescriber is "Dr. A. Reyes", clinic is "Northside
     Aesthetics", patients are initials, compounds are non-GLP-1.          */

  var PHARMA_A = 'Apex Compounding Pharmacy';
  var PHARMA_B = 'Beacon Compounding Co.';

  /* The one order the hero narrates. It appears in the lifted pane and in the
     activity strip behind it, both visible at once, so it is a constant:
     they used to be two hand-typed strings carrying two different amounts. */
  var ORDER_ID = 'ORD-DEMO-HYBG3';

  /* Amounts are deliberately absent from this mock, exactly as they are from
     the settlement record on For Pharmacies and the record on How it works.
     A marketing page that prints prices for compounded preparations argues
     against the site's own "your price is your price" position, and the
     numbers previously disagreed with each other. This is the single token
     every settled row prints. */
  var SETTLED = 'Itemized';

  // Avatars carry bare initials ("SK"); the text beside them keeps the
  // dotted form ("S.K."). Patients are never named.
  function av(initials, warm) {
    return '<span class="ph-av' + (warm ? ' ph-av--warm' : '') + '">' +
      initials.replace(/[^A-Za-z0-9]/g, '') + '</span>';
  }

  /* ── Panes ─────────────────────────────────────────────────────────────── */

  function paneQueue() {
    /* Every column's number is its own card count, and every stat tile is
       derived from these columns. Hand-typed, they disagreed in three places
       at once: the "Ready to send" tile said 2 over a column of 1, the
       "Delivered" column header said 4 over 2 cards. A viewer who reads a
       screenshot of a record system notices arithmetic; on a page whose
       argument is "one record, nothing is inferred later", it is the worst
       possible detail to get wrong. */
    var COLS = [
      ['Drafts', '#9AA6B4', [
        ['P.P.', 'Methylcobalamin 1 mg/mL', 'P.P. · 1 mg/mL',   'Aug 23', null],
        ['T.V.', 'Lipo-C 30 mL',            'T.V. · 30 mL',     'Aug 22', null]
      ]],
      ['Awaiting signature', '#D98A33', [
        ['E.N.', 'Glutathione 200 mg/mL', 'E.N. · 200 mg/mL', 'Aug 22', null],
        ['L.S.', 'Ascorbic acid 500 mg',  'L.S. · 500 mg',    'Aug 21', null]
      ]],
      ['Ready to send', '#A87B31', [
        ['R.C.', 'NAD+ 100 mg/mL', 'R.C. · 100 mg/mL', 'Aug 23', null]
      ]],
      ['In transit', '#2266BB', [
        ['Y.A.', 'NAD+ 100 mg/mL',           'Y.A. · 100 mg/mL', 'Aug 23', PHARMA_A],
        ['I.R.', 'Methylcobalamin 1 mg/mL',  'I.R. · 1 mg/mL',   'Aug 21', PHARMA_A],
        ['J.W.', 'Glutathione 200 mg/mL',    'J.W. · 200 mg/mL', 'Aug 20', PHARMA_B]
      ]],
      ['Delivered', '#1FA971', [
        ['S.K.', 'Lipo-C 30 mL',    'S.K. · 30 mL',     'Aug 19', PHARMA_A],
        ['D.O.', 'NAD+ 100 mg/mL',  'D.O. · 100 mg/mL', 'Aug 18', PHARMA_B]
      ]]
    ];
    var n = function (label) {
      for (var i = 0; i < COLS.length; i++) if (COLS[i][0] === label) return COLS[i][2].length;
      return 0;
    };

    var stats = [
      ['gold',  'In queue',        n('Drafts') + n('Awaiting signature'), 'Drafts + awaiting signature', 'doc'],
      ['amber', 'Ready to send',   n('Ready to send'), 'Signed, no order yet', 'send'],
      ['blue',  'In transit',      n('In transit'),    'Orders on the way',    'checkcirc'],
      ['green', 'Delivered',       n('Delivered'),     'Confirmed received',   'package']
    ].map(function (s) {
      return '<div class="ph-stat" data-tone="' + s[0] + '">' +
        '<div class="ph-stat__top"><span class="ph-stat__k">' + s[1] + '</span>' +
        '<span class="ph-stat__ico">' + icon(s[4]) + '</span></div>' +
        '<div class="ph-stat__v">' + s[2] + '</div>' +
        '<div class="ph-stat__d">' + s[3] + '</div>' +
        '<div class="ph-stat__bar"></div></div>';
    }).join('');

    var cols = COLS.map(function (c) {
      var cards = c[2].map(function (r) {
        return '<div class="ph-kan__card">' +
          '<div class="ph-kan__row">' + av(r[0]) +
          '<span class="ph-kan__t">' + r[1] + '</span>' +
          '<span class="ph-kan__d">' + r[3] + '</span></div>' +
          '<div class="ph-kan__s">' + r[2] + '</div>' +
          (r[4] ? '<span class="ph-kan__pharm">' + icon('building') + r[4] + '</span>' : '') +
          '</div>';
      }).join('');
      return '<div class="ph-kan__col">' +
        '<div class="ph-kan__head"><span class="ph-kan__dot" style="background:' + c[1] + '"></span>' +
        c[0] + '<span class="ph-kan__n">' + c[2].length + '</span></div>' +
        (cards || '<div class="ph-kan__empty">Nothing waiting here.</div>') +
        '</div>';
    }).join('');

    /* Activity strip: the settlement story, told as records. The amount
       column carries SETTLED, never a figure: the second row here sits
       directly behind the lifted pane and the two used to print different
       amounts for the same order id. */
    var acts = [
      ['gold',  'send',      'Rx signed by <b>Dr. A. Reyes</b> · routed to ' + PHARMA_A, '',     '2m'],
      ['blue',  'card',      'Card on file charged at signature · <b>' + ORDER_ID + '</b>', SETTLED, '2m'],
      ['amber', 'package',   PHARMA_B + ' marked <b>ORD-DEMO-11EEA</b> filling',        '',     '1h'],
      ['green', 'checkcirc', 'Delivery confirmed · <b>ORD-DEMO-08OD2</b> · pharmacy is merchant of record', SETTLED, '3h']
    ].map(function (a) {
      return '<div class="ph-act__row">' +
        '<span class="ph-act__dot" style="' +
          ({ gold:'background:rgb(212 168 79/.16);color:#A87B31',
             blue:'background:rgb(34 102 187/.12);color:#2266BB',
             amber:'background:rgb(217 138 51/.14);color:#B9711F',
             green:'background:rgb(31 169 113/.14);color:#148056' })[a[0]] + '">' +
        icon(a[1]) + '</span>' +
        '<span class="ph-act__t">' + a[2] + '</span>' +
        '<span class="ph-act__amt">' + a[3] + '</span>' +
        '<span class="ph-act__ago">' + a[4] + '</span></div>';
    }).join('');

    return '<div class="ph-app__stats">' + stats + '</div>' +
      '<div class="ph-app__seehead"><div>' +
      '<div class="ph-app__label">Pipeline</div>' +
      '<div class="ph-app__h2">Prescriptions by phase</div></div>' +
      '<span class="ph-app__see">View full list</span></div>' +
      '<div class="ph-kan">' + cols + '</div>' +
      '<div class="ph-app__seehead" style="margin-top:1.1em">' +
      '<div><div class="ph-app__label">Activity</div></div>' +
      '<span class="ph-app__see">Export audit trail</span></div>' +
      '<div class="ph-act" style="margin-top:0">' + acts + '</div>';
  }

  function paneRx() {
    /* Prescription ids use the RX-DEMO prefix, matching the record walked
       through on How it works. They used to read PH-DEMO here and RX-DEMO
       there, for the same kind of object. */
    var RX = [
      ['P.P.', 'Methylcobalamin', '1 mg/mL',   'RX-DEMO-167RQ', 'draft',   'Draft',              'pencil', null,     '2d'],
      ['T.V.', 'Lipo-C',          '30 mL',     'RX-DEMO-158S8', 'draft',   'Draft',              'pencil', null,     '3d'],
      ['E.N.', 'Glutathione',     '200 mg/mL', 'RX-DEMO-14S78', 'await',   'Awaiting signature', 'doc',    null,     '3d'],
      ['L.S.', 'Ascorbic acid',   '500 mg',    'RX-DEMO-13C8J', 'await',   'Awaiting signature', 'doc',    null,     '4d'],
      ['Y.A.', 'NAD+',            '100 mg/mL', 'RX-DEMO-12AW0', 'signed',  'Signed',             'send',   PHARMA_A, '4d'],
      ['I.R.', 'Methylcobalamin', '1 mg/mL',   'RX-DEMO-1180S', 'signed',  'Signed',             'send',   PHARMA_A, '5d'],
      ['J.W.', 'Glutathione',     '200 mg/mL', 'RX-DEMO-10I24', 'transit', 'In transit',         'truck',  PHARMA_B, '6d'],
      ['R.C.', 'NAD+',            '100 mg/mL', 'RX-DEMO-09S4T', 'signed',  'Signed',             'send',   PHARMA_A, '7d'],
      ['S.K.', 'Lipo-C',          '30 mL',     'RX-DEMO-08K2R', 'transit', 'In transit',         'truck',  PHARMA_A, '7d'],
      ['D.O.', 'NAD+',            '100 mg/mL', 'RX-DEMO-07M1B', 'done',    'Delivered',          'checkcirc', PHARMA_B, '9d'],
      ['A.W.', 'Ascorbic acid',   '500 mg',    'RX-DEMO-06T4L', 'done',    'Delivered',          'checkcirc', PHARMA_A, '11d']
    ];

    /* Counted from the rows. The hand-typed version listed a "Ready to send"
       filter that matched no row, omitted "Signed" which matched three, and
       its five buckets summed to 19 against an "All 18". */
    var cnt = function (t) { return RX.filter(function (r) { return r[4] === t; }).length; };
    var pills = [
      ['All', RX.length, null, true],
      ['Drafts', cnt('draft'), '#9AA6B4'],
      ['Awaiting signature', cnt('await'), '#D98A33'],
      ['Signed', cnt('signed'), '#A87B31'],
      ['In transit', cnt('transit'), '#2266BB'],
      ['Delivered', cnt('done'), '#1FA971']
    ].map(function (p) {
      return '<span class="ph-pill"' + (p[3] ? ' data-on' : '') + '>' +
        (p[2] ? '<span class="ph-pill__dot" style="background:' + p[2] + '"></span>' : '') +
        p[0] + ' <b>' + p[1] + '</b></span>';
    }).join('');

    var rows = RX.map(function (r) {
      return '<tr><td><div class="ph-tbl__cmp">' + av(r[0]) + '<span><b>' + r[1] +
        '</b> · ' + r[2] + '<small class="ph-tbl__rx">' + r[0] + ' · ' + r[3] + '</small></span></div></td>' +
        '<td>Dr. A. Reyes, MD</td>' +
        '<td><span class="ph-st" data-t="' + r[4] + '">' + icon(r[6]) + r[5] + '</span></td>' +
        '<td>' + (r[7]
          ? '<span class="ph-tbl__pharm">' + icon('building') + r[7] + '</span>'
          : '<span style="color:#A2ADBB">Not yet routed</span>') + '</td>' +
        '<td style="color:#93A0B1">' + r[8] + '</td></tr>';
    }).join('');

    return '<div class="ph-app__headrow" style="margin-bottom:.55em">' +
      '<div><div class="ph-app__label">Prescriptions</div>' +
      '<div class="ph-app__h2">All prescriptions</div>' +
      '<div class="ph-app__sub">Every Rx your clinic has drafted, signed, or routed.</div></div></div>' +
      '<div class="ph-pills">' + pills + '</div>' +
      '<div class="ph-tbl"><div class="ph-tbl__bar">' +
      '<span class="ph-tbl__find">' + icon('search') + 'Search by Rx#, patient, or compound</span>' +
      '<span class="ph-tbl__filter">' + icon('filter') + 'Prescriber</span>' +
      '<span class="ph-tbl__filter">' + icon('building') + 'Pharmacy</span>' +
      '<span class="ph-tbl__rows">' + RX.length + ' rows</span></div>' +
      '<table><thead><tr><th>Compound · Patient</th><th>Prescriber</th><th>Status</th>' +
      '<th>Pharmacy</th><th>Age</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  function paneOrders() {
    /* An order only exists once a prescriber has signed, and the card is
       charged at signature: so every row here is settled, and every row
       prints the same token. The previous version printed eight medication
       prices in this column, which is a claim the site does not otherwise
       make, and the first row carried a third contradictory figure for
       ORDER_ID. */
    var ORD = [
      ['Aug 23', ORDER_ID,         'NAD+ 100 mg/mL · Y.A.',          PHARMA_A, 'signed',  'Submitted', 'send'],
      ['Aug 21', 'ORD-DEMO-12LS7', 'Methylcobalamin 1 mg/mL · I.R.', PHARMA_A, 'filling', 'Filling',   'package'],
      ['Aug 20', 'ORD-DEMO-11EEA', 'Glutathione 200 mg/mL · J.W.',   PHARMA_B, 'filling', 'Filling',   'package'],
      ['Aug 19', 'ORD-DEMO-10S6H', 'Lipo-C 30 mL · S.K.',            PHARMA_A, 'transit', 'Shipped',   'truck'],
      ['Aug 16', 'ORD-DEMO-08OD2', 'NAD+ 100 mg/mL · D.O.',          PHARMA_B, 'done',    'Delivered', 'checkcirc'],
      ['Aug 12', 'ORD-DEMO-07R6F', 'Ascorbic acid 500 mg · L.S.',    PHARMA_A, 'done',    'Delivered', 'checkcirc'],
      ['Aug 10', 'ORD-DEMO-06N3S', 'Methylcobalamin 1 mg/mL · P.P.', PHARMA_A, 'done',    'Delivered', 'checkcirc'],
      ['Aug 08', 'ORD-DEMO-053NK', 'Glutathione 200 mg/mL · E.N.',   PHARMA_A, 'done',    'Delivered', 'checkcirc'],
      ['Aug 05', 'ORD-DEMO-04J8P', 'Lipo-C 30 mL · T.V.',            PHARMA_B, 'done',    'Delivered', 'checkcirc'],
      ['Aug 02', 'ORD-DEMO-03B7Q', 'Ascorbic acid 500 mg · R.C.',    PHARMA_A, 'done',    'Delivered', 'checkcirc']
    ];

    var cnt = function (t) { return ORD.filter(function (r) { return r[4] === t; }).length; };
    var pills = [
      ['All', ORD.length, null, true],
      ['Submitted', cnt('signed'),  '#A87B31'],
      ['Filling',   cnt('filling'), '#7A5A21'],
      ['Shipped',   cnt('transit'), '#2266BB'],
      ['Delivered', cnt('done'),    '#1FA971']
    ].map(function (p) {
      return '<span class="ph-pill"' + (p[3] ? ' data-on' : '') + '>' +
        (p[2] ? '<span class="ph-pill__dot" style="background:' + p[2] + '"></span>' : '') +
        p[0] + ' <b>' + p[1] + '</b></span>';
    }).join('');

    var rows = ORD.map(function (r) {
      return '<tr><td style="color:#93A0B1">' + r[0] + '</td>' +
        '<td><b style="color:#16202E" class="ph-tbl__rx">' + r[1] + '</b>' +
        '<small style="display:block;font-size:.84em;color:#7E8A99">' + r[2] + '</small></td>' +
        '<td><span class="ph-tbl__pharm">' + icon('building') + r[3] + '</span></td>' +
        '<td><span class="ph-st" data-t="' + r[4] + '">' + icon(r[6]) + r[5] + '</span></td>' +
        '<td class="ph-tbl__tot">' + SETTLED + '</td></tr>';
    }).join('');

    return '<div class="ph-app__headrow" style="margin-bottom:.55em">' +
      '<div><div class="ph-app__label">Account</div>' +
      '<div class="ph-app__h2">Your orders</div>' +
      '<div class="ph-app__sub">The card on file is charged when the prescriber signs. ' +
      'The pharmacy is the merchant of record; the Pharity fee is itemized separately.</div></div></div>' +
      '<div class="ph-pills">' + pills + '</div>' +
      '<div class="ph-tbl"><div class="ph-tbl__bar">' +
      '<span class="ph-tbl__find">' + icon('search') + 'Search orders' + '</span>' +
      '<span class="ph-tbl__filter">' + icon('building') + 'Pharmacy' + '</span>' +
      '<span class="ph-tbl__rows">August 2026 · ' + ORD.length + ' orders</span></div>' +
      '<table><thead><tr><th>Date</th><th>Order</th><th>Pharmacy</th><th>Status</th>' +
      '<th style="text-align:right">Settlement</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  /* ── Chrome ────────────────────────────────────────────────────────────── */

  function rail() {
    var g = function (items) {
      return '<div class="ph-app__nav">' + items.map(function (i) {
        return '<span class="ph-app__ico"' + (i[1] ? ' data-on' : '') + '>' + icon(i[0]) + '</span>';
      }).join('') + '</div>';
    };
    return '<aside class="ph-app__rail" aria-hidden="true">' +
      '<span class="ph-app__mark"><span>P</span></span>' +
      '<span class="ph-app__new">' + icon('plus') + '</span>' +
      g([['grid', 1], ['clipboard'], ['refresh']]) +
      g([['users'], ['pill'], ['doc'], ['star']]) +
      g([['building'], ['usercog'], ['video']]) +
      g([['activity'], ['package'], ['chart']]) +
      '<span class="ph-app__rail-sp"></span>' +
      '<span class="ph-app__ico">' + icon('settings') + '</span>' +
      '<span class="ph-app__avatar">NA</span>' +
      '</aside>';
  }

  /* ── The pulled-out sidebar card ────────────────────────────────────────
     The clinic's left-hand navigation, lifted off the screen and floated over
     the machine's left edge. Eight places you can be in the product, grouped
     the way the product groups them.

     Icons are the product's OWN rail glyphs (see rail() above) rather than a
     fresh set: this is meant to read as that rail pulled out, so the two have
     to agree. grid=Home, clipboard=Queue, pill=Prescriptions, users=Patients,
     package=Orders, building=Pharmacies, card=Billing, settings=Settings.

     The third element of a row is the view index it TRACKS. Three of the eight
     are the three views the segmented control switches between, so when the
     pointer clicks Prescriptions on screen this card's Prescriptions row goes
     active with it. The other five are never active: they are what makes the
     card a map of the product rather than a second copy of the tab strip.

     Queue is marked active in the markup because pane 0 is the pane that
     renders by default. The card therefore states something true about the
     screen before any script has run.                                      */
  var SIDE_NAV = [
    [['grid', 'Home'],          ['clipboard', 'Queue', 0]],
    [['pill', 'Prescriptions', 1], ['users', 'Patients']],
    [['package', 'Orders', 2],  ['building', 'Pharmacies']],
    [['card', 'Billing'],       ['settings', 'Settings']]
  ];

  function sidecard() {
    var groups = SIDE_NAV.map(function (grp) {
      return '<div class="ph-hw__side-grp">' + grp.map(function (r) {
        return '<span class="ph-hw__side-row"' +
          (r.length > 2 ? ' data-view="' + r[2] + '"' : '') +
          (r[2] === 0 ? ' data-on=""' : '') + '>' +
          icon(r[0]) + '<span>' + r[1] + '</span></span>';
      }).join('') + '</div>';
    }).join('');
    /* aria-hidden for the same reason the device is: this is a picture of an
       interface, and its eight labels are not how the hero conveys anything.
       The sr-only description already covers what the illustration shows. */
    return '<div class="ph-hw__side" aria-hidden="true">' +
      '<div class="ph-hw__side-nav">' + groups + '</div></div>';
  }

  function menubar() {
    return '<div class="ph-hw__menubar" aria-hidden="true">' + appleGlyph +
      '<b>Pharity</b><span>File</span><span>Edit</span><span>View</span>' +
      '<span>Window</span><span>Help</span>' +
      '<span class="ph-hw__mb-right">' + icon('wifi') + icon('search') +
      icon('battery') + '<span>2:14 PM</span></span></div>';
  }

  /* ── Build ─────────────────────────────────────────────────────────────── */

  var VIEWS = [
    { id: 'queue',  label: 'Queue',         build: paneQueue },
    { id: 'rx',     label: 'Prescriptions', build: paneRx },
    { id: 'orders', label: 'Orders',        build: paneOrders }
  ];

  var CURSOR_SVG =
    '<svg viewBox="0 0 12 19" fill="none" aria-hidden="true">' +
      '<path d="M1 1.2 1 15.3 4.6 11.9 7 17.4 9.5 16.3 7.2 11 11.2 10.6Z" ' +
        'fill="#10181F" stroke="#fff" stroke-width="1.15" stroke-linejoin="round"/>' +
    '</svg>';

  function hardware() {
    var uid = 'hw' + Math.random().toString(36).slice(2, 8);

    /* The visible segment is display-only markup. The real controls are the
       transparent buttons in .ph-hw__hits, which is a SIBLING of the device
       rather than a child: see the note on .ph-hw__hits in the stylesheet.
       (That indirection used to exist because a click could not reach into a
       3D-composited layer. The device is flat now; what keeps the buttons
       outside is the aria-hidden subtree, which is a different problem.)  */
    var segs = VIEWS.map(function (v, i) {
      return '<span data-sel="' + (i === 0) + '">' + v.label + '</span>';
    }).join('');

    var hits = VIEWS.map(function (v, i) {
      return '<button class="ph-hw__hit" type="button" data-pane="' + v.id + '" ' +
        'aria-pressed="' + (i === 0) + '">' +
        '<span class="ph-sr">Show ' + v.label.toLowerCase() + '</span></button>';
    }).join('');

    var panes = VIEWS.map(function (v, i) {
      return '<div class="ph-app__pane' + (i === 0 ? ' is-active' : '') + '" ' +
        'id="' + uid + '-p' + i + '">' + v.build() + '</div>';
    }).join('');


  /* ── The deck, as one inline SVG ────────────────────────────────────────
     viewBox units: 1000 across the deck's OWN width. The reference deck is
     1840px wide, so one unit is 1.84 reference px.

     Drawn here rather than in CSS because the silhouette needs a curved
     inward taper on the bottom corners, a thumb scoop that is a lighter
     inset with a groove rather than a bite out of the outline, and two feet.
     Every number below was measured off the client's reference vector.     */
  function baseSVG() {
    var BW   = 1000;
    var SLAB = 24.46;          /* 45 ref px, the slab            */
    var FOOT =  4.61;          /* 8.5 ref px, the rubber feet    */
    var H    = SLAB + FOOT;
    var STRAIGHT = 11.96;      /* the sides run vertical to here, 49% down */
    var IN   = 14.13;          /* bottom inset each side, 26 ref px        */
    /* Scoop: ref x843..1169, 23 rows deep, centred on 1006 against a screen
       centre of 1007. 23 rows is 51% of the slab. */
    var SX0 = 410.9, SX1 = 587.9, SH = 12.50, SR = 5.4;
    var F1a = 48.9, F1b = 115.8, F2a = 883.7, F2b = 950.5, FT = 3.5;

    /* Control points solved against the reference's own inset profile:
       rms 0.9px at reference scale. */
    var slab =
      'M3,0 L997,0 Q1000,0 1000,3 L1000,' + STRAIGHT +
      ' C1000,20.56 985,' + SLAB + ' ' + (BW - IN) + ',' + SLAB +
      ' L' + IN + ',' + SLAB +
      ' C15,' + SLAB + ' 0,20.56 0,' + STRAIGHT +
      ' L0,3 Q0,0 3,0 Z';

    var scoop =
      'M' + SX0 + ',0 H' + SX1 + ' V' + (SH - SR) +
      ' A' + SR + ',' + SR + ' 0 0 1 ' + (SX1 - SR) + ',' + SH +
      ' H' + (SX0 + SR) +
      ' A' + SR + ',' + SR + ' 0 0 1 ' + SX0 + ',' + (SH - SR) + ' Z';

    function foot(a, b) {
      return 'M' + a + ',' + SLAB + ' H' + b + ' L' + (b - FT) + ',' + H +
             ' H' + (a + FT) + ' Z';
    }

    return '<svg class="ph-hw__base" viewBox="0 0 ' + BW + ' ' + H.toFixed(2) + '" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<defs>' +
        /* The face, sampled at x=500 in the reference, clear of both the scoop
           and the tapered ends. Twelve stops because it is a real curve:
           bright to 15%, darkest plateau at 76-82%, then a fast return which
           is light catching the rounded bottom edge. */
        '<linearGradient id="phBaseFace" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#ECE9E2"/>' +
          '<stop offset=".07" stop-color="#EAE3DC"/>' +
          '<stop offset=".15" stop-color="#E7DFD8"/>' +
          '<stop offset=".25" stop-color="#DCD6CF"/>' +
          '<stop offset=".36" stop-color="#D0CAC2"/>' +
          '<stop offset=".47" stop-color="#BEB7AF"/>' +
          '<stop offset=".58" stop-color="#ACA59D"/>' +
          '<stop offset=".70" stop-color="#979189"/>' +
          '<stop offset=".80" stop-color="#938B7F"/>' +
          '<stop offset=".88" stop-color="#A79F94"/>' +
          '<stop offset=".93" stop-color="#C6C1B7"/>' +
          '<stop offset="1" stop-color="#CFCCC5"/>' +
        '</linearGradient>' +
        /* The scoop ACROSS. Not hand-picked colour: these are the reference's
           own row-11 pixels traced edge to edge and thinned to the stops that
           reproduce it within 3.5/255. The narrow dark groove one pixel inside
           each edge is the whole reason the scoop reads as a dip; a flat fill
           with a hairline round it reads as a sticker. Both end stops are
           transparent so the groove dissolves into whatever the face gradient
           is at that height instead of drawing a pale line beside it. */
        '<linearGradient id="phScoopX" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="#C5C0BA" stop-opacity="0"/>' +
          '<stop offset=".0031" stop-color="#C5C0BA"/>' +
          '<stop offset=".0061" stop-color="#928E88"/>' +
          '<stop offset=".0092" stop-color="#84807A"/>' +
          '<stop offset=".0153" stop-color="#8F8A84"/>' +
          '<stop offset=".0491" stop-color="#ECE7E0"/>' +
          '<stop offset=".5" stop-color="#F7F0E8"/>' +
          '<stop offset=".9509" stop-color="#EEE7E0"/>' +
          '<stop offset=".9601" stop-color="#E3DCD6"/>' +
          '<stop offset=".9785" stop-color="#C8C1BA"/>' +
          '<stop offset=".9908" stop-color="#8B847D"/>' +
          '<stop offset=".9939" stop-color="#8B847D"/>' +
          '<stop offset=".9969" stop-color="#938C86"/>' +
          '<stop offset="1" stop-color="#938C86" stop-opacity="0"/>' +
        '</linearGradient>' +
        /* ...and DOWN, as a mask, because the scoop needs a falloff on both
           axes and one gradient only has one. The reference holds the interior
           flat at its full 241 for twenty-one of the scoop's twenty-three
           rows, then washes out 241 -> 208 -> 174 with nothing dark in
           between: there is no bottom edge to draw, only a dissolve. */
        '<linearGradient id="phScoopFade" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#FFF"/>' +
          '<stop offset=".93" stop-color="#FFF"/>' +
          '<stop offset="1" stop-color="#000"/>' +
        '</linearGradient>' +
        '<mask id="phScoopMask" maskUnits="userSpaceOnUse" color-interpolation="sRGB" ' +
          'x="' + SX0 + '" y="0" width="' + (SX1 - SX0) + '" height="' + SH + '">' +
          '<rect x="' + SX0 + '" y="0" width="' + (SX1 - SX0) + '" height="' + SH +
          '" fill="url(#phScoopFade)"/>' +
        '</mask>' +
        /* Rubber. Light where the deck overhangs it, darkest two thirds down,
           lifting again at the floor. Sampled across x196..280 so the readings
           are the foot and not its end curves. */
        '<linearGradient id="phFoot" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#A79F96"/>' +
          '<stop offset=".184" stop-color="#9B968E"/>' +
          '<stop offset=".306" stop-color="#A29F98"/>' +
          '<stop offset=".428" stop-color="#8A8781"/>' +
          '<stop offset=".55" stop-color="#53514C"/>' +
          '<stop offset=".673" stop-color="#42413D"/>' +
          '<stop offset=".796" stop-color="#3B3A37"/>' +
          '<stop offset=".918" stop-color="#605F5D"/>' +
          '<stop offset="1" stop-color="#7E7C7A"/>' +
        '</linearGradient>' +
        '<clipPath id="phSlabClip"><path d="' + slab + '"/></clipPath>' +
      '</defs>' +
      '<path d="' + foot(F1a, F1b) + '" fill="url(#phFoot)"/>' +
      '<path d="' + foot(F2a, F2b) + '" fill="url(#phFoot)"/>' +
      '<path d="' + slab + '" fill="url(#phBaseFace)"/>' +
      '<g clip-path="url(#phSlabClip)" mask="url(#phScoopMask)">' +
        '<path d="' + scoop + '" fill="url(#phScoopX)"/>' +
      '</g>' +
      '</svg>';
  }


    /* The machine is a PICTURE OF THE PRODUCT, so the whole device subtree is
       hidden from assistive tech and described once instead.

       Measured, not assumed: before this, 268 visually-rendered text nodes
       inside the mock were exposed to screen readers, every sample statistic,
       kanban card, patient initial and timestamp, at 5.3-7.4px. A screen
       reader user met a wall of sample dashboard data before reaching the
       hero's actual proposition. */
    return '' +
      '<div class="ph-hw__field" aria-hidden="true"></div>' +
      '<p class="ph-sr">Illustration: the Pharity clinic dashboard, showing sample ' +
        'prescriptions moving from draft through signature to delivered. The figures ' +
        'and names are sample data. The controls that follow change which view of ' +
        'this illustration is shown.</p>' +
      '<div class="ph-hw__device" aria-hidden="true">' +
        '<div class="ph-hw__aura"></div>' +
        '<div class="ph-hw__shadow ph-hw__shadow--ambient"></div>' +
        '<div class="ph-hw__shadow"></div>' +
        '<div class="ph-hw__lid"><div class="ph-hw__bezel">' +
          '<div class="ph-hw__notch"><span class="ph-hw__cam"></span></div>' +
          '<div class="ph-hw__screen">' +
            menubar() +
            '<div class="ph-app">' + rail() +
              '<div class="ph-app__canvas">' +
                '<div class="ph-app__top">' +
                  '<span class="ph-app__crumb">Clinic</span>' +
                  '<span class="ph-app__search">' + icon('search') +
                    '<span>Search patients, prescriptions, pharmacies</span>' +
                    '<span class="ph-app__kbd">⌘K</span></span>' +
                  '<span class="ph-app__topicons">' + icon('bell') + icon('sparkle') + '</span>' +
                '</div>' +
                '<div class="ph-app__scroll">' +
                  '<div class="ph-app__headrow">' +
                    '<div>' +
                      '<div class="ph-app__meta"><span class="ph-app__live">Live</span>' +
                      '<span>·</span><span>Today · 2:14 PM</span>' +
                      '<span>·</span><span>Northside Aesthetics</span></div>' +
                      '<div class="ph-app__hello">Good afternoon, Dr. Reyes.</div>' +
                      '<div class="ph-app__sub">Three items are blocking queued prescriptions. Start there.</div>' +
                    '</div>' +
                    '<div class="ph-app__headact">' +
                      '<div class="ph-app__seg" data-seg>' + segs + '</div>' +
                      '<span class="ph-app__cta">' + icon('plus') + 'New Rx</span>' +
                    '</div>' +
                  '</div>' +
                  panes +
                '</div>' +
              '</div>' +
            '</div>' +
            '<span class="ph-hw__ring" data-ring></span>' +
            '<span class="ph-hw__cursor" data-cursor>' + CURSOR_SVG + '</span>' +
            '<div class="ph-hw__glass"></div>' +
          '</div>' +
        '</div></div>' +
        baseSVG() +
        /* Inside the device, so it is positioned against the lid and travels
           with it; NOT inside .ph-hw__screen, which clips, and the card has to
           hang past the machine's left edge. */
        sidecard() +
        '<span class="ph-hw__sample">Sample data</span>' +
      '</div>' +
      '<div class="ph-hw__hits" data-hits role="group" ' +
        'aria-label="Dashboard illustration: choose a view">' + hits + '</div>';
  }


  /* ── The driven pointer ────────────────────────────────────────────────────
     A pointer moves inside the screen, hovers a real control, clicks it, and
     the interface changes as a consequence:

       hover Prescriptions -> click -> the view changes
       hover the queued Rx -> click -> the record opens
       hover Sign and route -> click -> the row moves to Signed and the
                                        pill counts move with it

     It replaces a carousel that swapped panes on a timer with nothing to
     explain why, which reads as a slideshow. This reads as someone using the
     product.

     The script is a list of discrete "do this, then wait d" steps. Pausing
     clears the pending timer; resuming runs the next step. Steps are small
     enough that the seam is invisible, and it avoids carrying fractional
     remainders around. One loop is about 13.4s.                            */
  function wirePointer(host) {
    function slice(n) { return Array.prototype.slice.call(n); }
    var screen = host.querySelector('.ph-hw__screen');
    var cur    = host.querySelector('[data-cursor]');
    var ring   = host.querySelector('[data-ring]');
    var canvas = host.querySelector('.ph-app__canvas');
    var tabs   = slice(host.querySelectorAll('.ph-app__seg [data-sel]'));
    var btns   = slice(host.querySelectorAll('.ph-hw__hit'));
    var panes  = slice(host.querySelectorAll('.ph-app__pane'));
    /* The three rows of the pulled-out card that track a view. */
    var sideRows = slice(host.querySelectorAll('.ph-hw__side-row[data-view]'));
    if (!panes.length || !btns.length) return;

    /* show() is the ONE place a view changes -- the script calls it, and so
       does a real click (see wireClicks) -- so the card is updated here rather
       than from the animation script. It cannot drift out of agreement with
       the screen, whichever of the two is driving. */
    function show(n) {
      panes.forEach(function (p, k) { p.classList.toggle('is-active', k === n); });
      tabs.forEach(function (t, k) { t.setAttribute('data-sel', String(k === n)); });
      btns.forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === n)); });
      sideRows.forEach(function (el) {
        if (+el.getAttribute('data-view') === n) el.setAttribute('data-on', '');
        else el.removeAttribute('data-on');
      });
    }

    /* Park each hit over its tab. getBoundingClientRect is post-layout, so
       this holds at any --hw-w. */
    function place() {
      var h = host.getBoundingClientRect();
      if (!h.width) return;
      tabs.forEach(function (t, k) {
        var r = t.getBoundingClientRect(), b = btns[k];
        if (!b) return;
        b.style.left   = (r.left - h.left) + 'px';
        b.style.top    = (r.top  - h.top)  + 'px';
        b.style.width  = r.width  + 'px';
        b.style.height = r.height + 'px';
      });
    }
    place();
    if ('ResizeObserver' in window) new ResizeObserver(place).observe(host);
    window.addEventListener('resize', place);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(place).catch(function () {});

    /* Everything past here is the animation. Without a screen or a cursor the
       three buttons above still work, so bail late rather than early. */
    if (!screen || !cur || !ring) { wireClicks(function () {}); return; }

    /* ── The row the script signs ──────────────────────────────────────── */
    var rxPane = panes[1], row = null, stat = null, statText = null;
    var statWas = '', tWas = '';
    if (rxPane) {
      var rows = slice(rxPane.querySelectorAll('tbody tr'));
      for (var i = 0; i < rows.length; i++) {
        var s = rows[i].querySelector('.ph-st[data-t="await"]');
        if (s) { row = rows[i]; stat = s; break; }
      }
    }
    if (stat) {
      // the label is the last text node; the status icon before it stays put
      for (var n = stat.childNodes.length - 1; n >= 0; n--) {
        if (stat.childNodes[n].nodeType === 3 && stat.childNodes[n].nodeValue.trim()) {
          statText = stat.childNodes[n]; break;
        }
      }
      statWas = statText ? statText.nodeValue : '';
      tWas = stat.getAttribute('data-t');
    }
    if (!row || !canvas) { wireClicks(function () {}); return; }

    /* The pills carry the counts, so signing has to move them too or the
       click has no arithmetic behind it. */
    function pill(label) {
      var ps = rxPane.querySelectorAll('.ph-pill');
      for (var i = 0; i < ps.length; i++) {
        if (ps[i].textContent.indexOf(label) === 0) return ps[i].querySelector('b');
      }
      return null;
    }
    var pAwait = pill('Awaiting signature'), pSigned = pill('Signed');
    var nAwait = pAwait ? +pAwait.textContent : 0;
    var nSigned = pSigned ? +pSigned.textContent : 0;

    function setSigned(on) {
      if (!stat) return;
      stat.setAttribute('data-t', on ? 'signed' : tWas);
      if (statText) statText.nodeValue = on ? 'Signed' : statWas;
      if (pAwait)  pAwait.textContent  = String(nAwait  + (on ? -1 : 0));
      if (pSigned) pSigned.textContent = String(nSigned + (on ? 1 : 0));
    }

    /* ── The record sheet ──────────────────────────────────────────────── */
    var cells = row.querySelectorAll('td');
    var cmp = row.querySelector('.ph-tbl__cmp b');
    var rx  = row.querySelector('.ph-tbl__rx');
    var sheet = d.createElement('div');
    sheet.className = 'ph-app__sheet';
    sheet.innerHTML =
      '<div class="ph-app__sheet-lbl">Awaiting signature</div>' +
      '<div class="ph-app__sheet-t">' + (cmp ? cmp.textContent : 'Prescription') + '</div>' +
      '<div class="ph-app__sheet-m">' + (rx ? rx.textContent : '') + '</div>' +
      '<div class="ph-app__sheet-grid">' +
        '<div><div class="ph-app__sheet-k">Prescriber</div>' +
          '<div class="ph-app__sheet-v">' + (cells[1] ? cells[1].textContent : '') + '</div></div>' +
        '<div><div class="ph-app__sheet-k">Routing to</div>' +
          '<div class="ph-app__sheet-v">Apex Compounding</div></div>' +
      '</div>' +
      /* Note first, button last: the row reads "card on file is charged ->
         Sign and route", and the button lands at the right end of the sheet,
         clear of the pulled-out sidebar card. See .ph-app__sheet-act. */
      '<div class="ph-app__sheet-act">' +
        '<span class="ph-app__sheet-note">Card on file is charged at signature.</span>' +
        '<span class="ph-app__sign">Sign and route</span>' +
      '</div>';
    canvas.appendChild(sheet);
    var signBtn = sheet.querySelector('.ph-app__sign');

    /* ── Pointer primitives ────────────────────────────────────────────── */
    var hot = [];
    function clearHover() {
      hot.forEach(function (el) { el.classList.remove('is-cur-hover'); });
      hot = [];
    }
    function hover(el) { if (el) { el.classList.add('is-cur-hover'); hot.push(el); } }

    /* Move the pointer TIP to a point inside el. The tip sits at the arrow's
       own origin, which the stylesheet offsets with a negative margin, so
       left/top here are the tip in screen coordinates. */
    function moveTo(el, fx, fy) {
      if (!el) return;
      var s = screen.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (!r.width) return;
      cur.style.left = (r.left - s.left + r.width  * fx) + 'px';
      cur.style.top  = (r.top  - s.top  + r.height * fy) + 'px';
    }
    function moveToPct(px, py) {
      var s = screen.getBoundingClientRect();
      cur.style.left = (s.width  * px) + 'px';
      cur.style.top  = (s.height * py) + 'px';
    }
    function press() {
      cur.classList.add('is-down');
      ring.style.left = cur.style.left;
      ring.style.top  = cur.style.top;
      ring.classList.remove('is-fire');
      void ring.offsetWidth;              // restart the animation
      ring.classList.add('is-fire');
      setTimeout(function () { cur.classList.remove('is-down'); }, 130);
    }

    /* Rest sits in the empty lower area of the last pipeline column, so the
       parked pointer never lands on a line of copy. */
    var REST = [.88, .70];
    var seq = [
      { d: 1700, f: function () { cur.classList.add('is-on'); moveToPct(REST[0], REST[1]); } },

      { d: 820,  f: function () { moveTo(tabs[1], .5, .5); } },
      { d: 420,  f: function () { hover(tabs[1]); } },
      { d: 100,  f: press },
      { d: 1150, f: function () { clearHover(); show(1); } },

      { d: 820,  f: function () { moveTo(row, .26, .5); } },
      { d: 420,  f: function () { hover(row); } },
      { d: 100,  f: press },
      { d: 1150, f: function () { clearHover(); sheet.classList.add('is-open'); } },

      { d: 760,  f: function () { moveTo(signBtn, .5, .5); } },
      { d: 420,  f: function () { hover(signBtn); } },
      { d: 100,  f: press },
      { d: 2200, f: function () {
          clearHover();
          sheet.classList.remove('is-open');
          setSigned(true);
          row.classList.remove('is-flash');
          void row.offsetWidth;
          row.classList.add('is-flash');
        } },

      /* Then Orders, which is where that signature just sent the thing. Two
         reasons it is worth the ~3s it adds to the loop:
           1. It is the end of the sentence. "Sign and route" with no third
              beat routes the prescription into a pane the viewer never sees.
           2. Without it the third view, and the third row of the pulled-out
              card, only ever move for someone who clicks them by hand -- so a
              third of both controls read as decoration.                    */
      { d: 820,  f: function () { moveTo(tabs[2], .5, .5); } },
      { d: 420,  f: function () { hover(tabs[2]); } },
      { d: 100,  f: press },
      { d: 1500, f: function () { clearHover(); show(2); } },
      { d: 1900, f: function () {} },          // dwell, so Orders is readable

      /* Reset ON THE WAY OUT, not once parked. REST is a point in the QUEUE
         pane's empty lower area (see above), and it is only empty there: the
         orders table runs full width, so parking first and resetting after
         left the pointer sitting on the word "Itemized" for 1.6s. Restoring
         pane 0 in the same step that starts the move keeps the park on empty
         ground, and the pointer's own motion covers the seam. */
      { d: 700,  f: function () {
          moveToPct(REST[0], REST[1]);
          setSigned(false);
          row.classList.remove('is-flash');
          show(0);
        } },
      { d: 1600, f: function () {} }
    ];

    var idx = 0, timer = null, live = false;
    var onScreen = false, hovered = false, driven = false;

    function tick() {
      if (!live) return;
      var s = seq[idx];
      idx = (idx + 1) % seq.length;
      try { s.f(); } catch (e) {}
      timer = setTimeout(tick, s.d);
    }
    function play() {
      if (live || driven || reduced.matches || !onScreen || hovered) return;
      live = true; tick();
    }
    function halt() {
      live = false;
      if (timer) { clearTimeout(timer); timer = null; }
      clearHover();
    }
    /* A visitor taking over stops the script for good and clears its state,
       so the two can never be driving the same interface at once. */
    function surrender() {
      driven = true;
      halt();
      cur.classList.remove('is-on');
      sheet.classList.remove('is-open');
      setSigned(false);
      row.classList.remove('is-flash');
    }

    wireClicks(surrender);

    host.addEventListener('pointerenter', function () { hovered = true; halt(); });
    host.addEventListener('pointerleave', function () { hovered = false; play(); });
    d.addEventListener('visibilitychange', function () { if (d.hidden) halt(); else play(); });
    if (reduced.addEventListener) {
      reduced.addEventListener('change', function () { if (reduced.matches) halt(); else play(); });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        onScreen = es[0].isIntersecting;
        if (onScreen) { place(); play(); } else halt();
      }, { threshold: .25 }).observe(host);
    } else { onScreen = true; play(); }

    function wireClicks(before) {
      btns.forEach(function (b, k) {
        b.addEventListener('click', function () { before(); show(k); });
      });
    }
  }

  function mountHardware(scope) {
    var hosts = (scope || d).querySelectorAll('[data-hw]:not([data-hw-ready])');
    Array.prototype.forEach.call(hosts, function (host) {
      host.setAttribute('data-hw-ready', '');
      host.innerHTML = hardware();
      wirePointer(host);
    });
  }

  /* ── The scrolling operating layer ─────────────────────────────────────
     Drives [data-flow]: reads how far the page has scrolled through the
     section and publishes ONE number, --flow-p (0 → 1). CSS does the rest:
     the track translate, the rail fill and the active card are all expressed
     as functions of that number, so there is exactly one source of truth and
     no way for the rail and the cards to disagree.

     ⚠ FLOW_MQ is duplicated as a media query in pharity-site.css (section 14).
     Change one, change the other. If JS binds where CSS has not pinned, the
     driver spins for nothing; if CSS pins where JS has not bound, the visitor
     gets six blank screens.

     data-flow-ready is added ONLY here, after a driver is actually attached.
     That attribute is what unlocks the pinned layout in CSS, so a JS failure
     of any kind leaves the plain stacked list: which is the honest fallback,
     not a degraded one.                                                     */

  var FLOW_MQ = '(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)';

  function mountFlow(scope) {
    var hosts = (scope || d).querySelectorAll('[data-flow]:not([data-flow-bound])');
    Array.prototype.forEach.call(hosts, function (sec) {
      sec.setAttribute('data-flow-bound', '');

      var pane  = sec.firstElementChild;
      var vp    = sec.querySelector('.ph-flow__viewport');
      var track = sec.querySelector('.ph-flow__track');
      var items = [].slice.call(sec.querySelectorAll('.ph-flow__i'));
      var ticks = [].slice.call(sec.querySelectorAll('.ph-flow__ticks i'));
      var now   = sec.querySelector('.ph-flow__now');
      var n     = items.length;
      if (n < 2 || !vp || !track) return;

      sec.style.setProperty('--flow-n', n);

      var mq = window.matchMedia ? window.matchMedia(FLOW_MQ) : null;
      var live = false;
      var ticking = false;
      var lastIdx = -1;
      var maxX = 0;

      /* How far the track may travel, measured, never assumed.

         Pulling each card in turn onto the container's left edge would run the
         track (n-1) card-widths to the left: which empties the right of the
         screen completely by the last step: one card at the far left and most
         of a window of nothing. Clamping the travel so the track comes to rest
         against its tail keeps the frame full at every position; past that
         point the sequence has arrived and only the highlight walks on.

         The tail is a flex item (.ph-flow__track::after), so scrollWidth sees
         it. Trailing PADDING would not be counted here and measured as zero. */
      function measure() {
        var padStart = parseFloat(getComputedStyle(vp).paddingInlineStart) || 0;
        var avail = vp.clientWidth - padStart;
        maxX = Math.max(0, track.scrollWidth - avail);
      }

      function apply() {
        ticking = false;
        var r = sec.getBoundingClientRect();
        // Distance the section can travel while pinned = its height minus the
        // sticky pane's height. getBoundingClientRect gives both without any
        // assumption about how tall the viewport or the nav happens to be.
        var travel = r.height - (pane ? pane.offsetHeight : 0);
        var p = travel > 0 ? (-r.top) / travel : 0;
        if (p < 0) p = 0; else if (p > 1) p = 1;

        sec.style.setProperty('--flow-p', p.toFixed(5));
        sec.style.setProperty('--flow-x', (-p * maxX).toFixed(2) + 'px');

        var idx = Math.round(p * (n - 1));
        if (idx === lastIdx) return;
        lastIdx = idx;

        items.forEach(function (el, k) {
          el.classList.toggle('is-active', k === idx);
          el.classList.toggle('is-next', k === idx + 1);
        });
        ticks.forEach(function (t, k) { t.classList.toggle('is-on', k <= idx); });
        if (now) now.textContent = ('0' + (idx + 1)).slice(-2);
      }

      function onResize() { measure(); onScroll(); }

      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
      }

      function enable() {
        if (live) return;
        live = true;
        // The attribute lands FIRST: it is what switches CSS into the pinned
        // layout, and measure() has to read the widths that layout produces.
        sec.setAttribute('data-flow-ready', '');
        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        if (typeof ResizeObserver === 'function') {
          if (!sec._flowRO) {
            sec._flowRO = new ResizeObserver(onResize);
            sec._flowRO.observe(vp);
          }
        }
        lastIdx = -1;
        apply();
      }

      function disable() {
        if (!live) return;
        live = false;
        sec.removeAttribute('data-flow-ready');
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        if (sec._flowRO) { sec._flowRO.disconnect(); sec._flowRO = null; }
        // Hand the stacked fallback back a clean slate: no half-lit cards, no
        // stale progress or offset left on the element.
        sec.style.removeProperty('--flow-p');
        sec.style.removeProperty('--flow-x');
        items.forEach(function (el) { el.classList.remove('is-active', 'is-next'); });
        ticks.forEach(function (t) { t.classList.remove('is-on'); });
      }

      function sync() { if (!mq || mq.matches) enable(); else disable(); }

      sync();
      if (mq) {
        if (mq.addEventListener) mq.addEventListener('change', sync);
        else if (mq.addListener) mq.addListener(sync);
      }
    });
  }

  /* ── Lead forms ─────────────────────────────────────────────────────────
     The apply and contact forms both POST to ONE endpoint in the Pharity app:
     POST /api/leads. Keep it that way — do not route a lead form to a mailto:
     URI, which several mail clients silently truncate past ~2,000 characters,
     and do not give either form its own endpoint.

     WHERE THE ENDPOINT LIVES. The marketing site is a static host and the app
     is a different origin, so the URL cannot be relative. Change it in ONE
     place — PHARITY_API_BASE below, or set window.PHARITY_API_BASE before this
     script loads (useful for a staging build). Every lead form's `action` is
     rewritten from it at boot, so the two can never disagree.

     PROGRESSIVE ENHANCEMENT, and it matters here more than usual:
       - With JS: fetch + an in-place confirmation. The confirmation is drawn
         ONLY after the server says the row was written — never optimistically,
         and never on a network error.
       - Without JS, or when the cross-origin fetch is blocked: the native form
         POST runs and the browser lands on the app's /apply/received page. CORS
         does not govern a form navigation, so a mis-set MARKETING_ORIGINS costs
         the in-place confirmation, never the submission.                     */

  var PHARITY_API_BASE = window.PHARITY_API_BASE || 'https://app.pharity.com';

  function leadEndpoint() {
    return String(PHARITY_API_BASE).replace(/\/+$/, '') + '/api/leads';
  }

  function setStatus(form, message, kind) {
    var box = form.querySelector('.ph-form__status');
    if (!box) return;
    box.textContent = message || '';
    box.setAttribute('data-kind', kind || 'error');
    box.hidden = !message;
  }

  /* Replace the form with a confirmation. Replacing rather than hiding means
     the submitted values cannot be edited-and-resubmitted from a page that
     already says "received". */
  function showConfirmation(form) {
    var panel = d.createElement('div');
    panel.className = 'ph-form__done';
    panel.setAttribute('role', 'status');
    panel.innerHTML =
      '<p class="ph-eyebrow">Received</p>' +
      '<h2 class="ph-h3" style="margin-top:12px">Thank you, we have it.</h2>' +
      '<p class="ph-body ph-body--sm" style="margin-top:12px">' +
      (form.getAttribute('data-done') ||
        'Someone on the team reads every enquiry and comes back to you by email.') +
      '</p>';
    form.parentNode.replaceChild(panel, form);
    if (panel.scrollIntoView) panel.scrollIntoView({ block: 'center' });
  }

  function collect(form) {
    var out = {};
    var els = form.elements;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.name || el.disabled) continue;
      if (el.type === 'checkbox') { out[el.name] = el.checked; continue; }
      if (el.type === 'radio') { if (el.checked) out[el.name] = el.value; continue; }
      out[el.name] = el.value;
    }
    out.sourcePath = location.pathname + location.search;
    return out;
  }

  function mountLeadForms() {
    var forms = d.querySelectorAll('form[data-lead-form]');
    for (var i = 0; i < forms.length; i++) {
      (function (form) {
        // Keep the no-JS action honest with the configured base.
        form.setAttribute('action', leadEndpoint());

        form.addEventListener('submit', function (e) {
          // Native validation has already run by the time submit fires, so the
          // required fields are still enforced.
          e.preventDefault();
          if (form.getAttribute('data-busy') === '1') return;
          form.setAttribute('data-busy', '1');
          setStatus(form, '', 'error');

          var btn = form.querySelector('button[type="submit"]');
          var btnText = btn ? btn.innerHTML : '';
          if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

          var restore = function () {
            form.removeAttribute('data-busy');
            if (btn) { btn.disabled = false; btn.innerHTML = btnText; }
          };

          fetch(leadEndpoint(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collect(form))
          })
            .then(function (res) {
              return res.json().catch(function () { return {}; })
                .then(function (body) { return { status: res.status, body: body }; });
            })
            .then(function (r) {
              if (r.status >= 200 && r.status < 300 && r.body && r.body.ok) {
                showConfirmation(form);
                return;
              }
              restore();
              setStatus(
                form,
                (r.body && r.body.error) ||
                  'That did not send. Email hello@pharity.com and we will pick it up from there.',
                'error'
              );
            })
            .catch(function () {
              // Network down, or the cross-origin fetch was refused. Fall back
              // to the native POST, which CORS does not govern — the visitor
              // lands on the app's confirmation page instead of losing the
              // message. data-busy stays set so this cannot loop.
              form.submit();
            });
        });
      })(forms[i]);
    }
  }

  /* ── Boot ──────────────────────────────────────────────────────────────── */

  function boot() {
    initNav();
    mountHardware();
    mountFlow();
    mountLeadForms();
    revealScan();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.Pharity = {
    icon: icon,
    iconFill: iconFill,
    hardware: hardware,
    mountHardware: mountHardware,
    mountFlow: mountFlow,
    mountLeadForms: mountLeadForms,
    revealScan: revealScan
  };
})();
