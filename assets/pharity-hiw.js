/* ============================================================================
   PHARITY: Why Pharity: the stage rail

   Replaces a scroll-driven walkthrough that spent seven screenfuls of scroll
   naming seven states. The client's note was that it "takes so much time and
   it's literally just showing drafted, awaiting signature, signed, routed", so
   the states were cut to five that each write something different, and the
   reader now drives instead of the scroll wheel.

   WHY A TABLIST RATHER THAN SCROLL-PROGRESS
   A horizontal stepper tied to scroll still puts the reader on someone else's
   clock: they have to scroll at the right speed to read, and cannot go back
   without re-scrubbing. An auto-advancing timeline has the same problem plus a
   scrubber to design and keyboard-support. Tabs are instant, reversible, and
   the whole shape of the workflow (drafted, signed, routed, settled,
   delivered) is legible in about two seconds WITHOUT any interaction at all,
   because all five labels are on screen at once, in order, joined by a rule.
   It also costs zero scroll.

   WHAT THIS BUILDS
     .hiw-rail      the five stages: dot, connector, label, outcome
     .hiw-exhibit   the stage's heading, its sentence, then the record card

   THE OUTCOME LINE UNDER EACH LABEL
   The rail used to name five states and nothing else, so the sequence only
   told you where you were, never what each state DID. Every stage now carries
   a two or three word outcome under its label, read from data-hint in the
   markup, which is what makes the whole workflow legible without a single
   click: "not charged, card charged, pharmacy matched, payees named, tracking
   written". Nothing in it is new copy. Each phrase restates that stage's own
   audit footer, so the rail and the record cannot say different things.

   The record card carries its own audit footer ([data-wrote] lives INSIDE
   [data-rec] in the markup), so this file clones exactly one node per pane and
   there is no second column to leave stranded. That is deliberate: the earlier
   two-column pane measured 246px of empty white under the caption on every
   stage, because a short caption cannot hold up a tall card.

   Progressive enhancement, strictly. The five stages are written out as real
   HTML in why-pharity.html (.hiw-stack). That stack is:
     • what you read with JavaScript disabled,
     • what you read under 820px,
     • and what is left in the page if anything here throws.

   When the screen is wide, this file builds a tablist FROM that markup and
   hides the stack. It never invents copy: every string on screen is cloned or
   read from the markup, so the two cannot drift.

   Reduced motion is NOT a reason to fall back to the stack: tabs are
   navigation, not motion. The pane cross-fade and the connector fill are
   turned off in CSS instead.

   Teardown is real: cross the breakpoint and the rail is removed and the
   static stack comes back.
   ========================================================================== */
(function () {
  'use strict';

  var d = document;
  var sec = d.querySelector('[data-hiw]');
  if (!sec) return;

  var stack = sec.querySelector('.hiw-stack');
  if (!stack) return;

  var blocks = Array.prototype.slice.call(stack.querySelectorAll('[data-stage]'));
  if (blocks.length < 2) return;

  var mqWide = window.matchMedia('(min-width: 820px)');

  var wrap = null;          // the built rail + exhibit
  var tabs = [], panes = [];
  var active = 0;

  /* ── Build ─────────────────────────────────────────────────────────────── */

  function build() {
    if (wrap) return;

    wrap = d.createElement('div');
    wrap.className = 'hiw-tabs';

    var rail = d.createElement('div');
    rail.className = 'hiw-rail';
    rail.setAttribute('role', 'tablist');
    rail.setAttribute('aria-label', 'Prescription stages');
    // The rail is a grid of N equal columns and the connector maths is written
    // against that column width, so the count has to reach CSS.
    rail.style.setProperty('--n', String(blocks.length));
    rail.setAttribute('data-reveal', '');

    var exhibit = d.createElement('div');
    exhibit.className = 'hiw-exhibit';
    exhibit.setAttribute('data-reveal', '');

    var paneWrap = d.createElement('div');
    paneWrap.className = 'hiw-panes';
    exhibit.appendChild(paneWrap);

    tabs = [];
    panes = [];

    blocks.forEach(function (b, i) {
      var n = String(i + 1).padStart(2, '0');
      var label = b.getAttribute('data-label') || n;
      var hint = b.getAttribute('data-hint') || '';

      /* Tab */
      var tab = d.createElement('button');
      tab.type = 'button';
      tab.className = 'hiw-step';
      tab.id = 'hiw-tab-' + i;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'hiw-pane-' + i);
      tab.setAttribute('aria-selected', 'false');
      // Roving tabindex: exactly one tab is in the tab order, arrows move
      // between them. Tabbing again leaves the whole tablist, which is the
      // behavior the pattern is for.
      tab.tabIndex = -1;
      // Position in the row, so the entrance cascades left to right on the
      // site's own 60ms step. Set here rather than in CSS because :nth-child
      // would have to be written out once per stage and would silently stop
      // cascading the day a sixth state is added.
      tab.style.setProperty('--i', String(i));
      tab.innerHTML =
        '<span class="hiw-step__d" aria-hidden="true">' + n + '</span>' +
        '<span class="hiw-step__t"></span>' +
        (hint ? '<span class="hiw-step__s"></span>' : '');
      tab.querySelector('.hiw-step__t').textContent = label;
      // The outcome repeats what the open pane states in full, so it is
      // decoration for a screen reader on a control whose accessible name is
      // already the stage. textContent, never innerHTML: it comes from an
      // attribute in the markup and is never parsed as HTML.
      if (hint) {
        var s = tab.querySelector('.hiw-step__s');
        s.textContent = hint;
        s.setAttribute('aria-hidden', 'true');
      }

      tab.addEventListener('click', function () { select(i, true); });
      tab.addEventListener('keydown', onKey);
      rail.appendChild(tab);
      tabs.push(tab);

      /* Pane: the stage's sentence, then the record (which carries its own
         audit footer). One column, so there is nothing to leave stranded. */
      var pane = d.createElement('div');
      pane.className = 'hiw-pane';
      pane.id = 'hiw-pane-' + i;
      pane.setAttribute('role', 'tabpanel');
      pane.setAttribute('aria-labelledby', 'hiw-tab-' + i);

      var srcCap = b.querySelector('[data-cap]');
      if (srcCap) {
        var lead = d.createElement('div');
        lead.className = 'hiw-pane__lead';

        // The stage gets a REAL heading, not an eyebrow.
        //
        // This used to read "STAGE 02 OF 05 · Signed" in 11px uppercase mono,
        // as a separate line above the sentence. Two objects, and the first of
        // them repeated what the rail 30px higher already showed twice over:
        // the open dot IS the position and the lit label IS the word. So the
        // pane opened with a line that carried no fact the reader did not have.
        //
        // One object now: a counter set as a fraction, then the stage name at
        // heading size, then the site's fading gold rule out to the margin.
        // The name is what gives the sentence something to hang from, and
        // promoting it to h3 is also the honest markup, since it heads the
        // panel's content. Both halves are still BUILT, never authored, so
        // they cannot drift from the rail: the number is the loop index and
        // the word is the same data-label the tab uses.
        var head = d.createElement('div');
        head.className = 'hiw-pane__h';

        var cnt = d.createElement('span');
        cnt.className = 'hiw-pane__c';
        cnt.textContent = n + ' / ' + String(blocks.length).padStart(2, '0');
        // "03 / 05" beside a word reads as an ordinal to anyone looking at it
        // and as a date, a ratio or two loose numbers to anyone listening.
        cnt.setAttribute('aria-hidden', 'true');
        head.appendChild(cnt);

        // h2, matching the static stack this pane is cloned from. The section
        // carries no heading of its own, so the stage IS the top-level heading
        // here: an h3 would have skipped a level straight from the page h1,
        // and it would have meant the same stage was an h2 on a phone and an
        // h3 on a laptop.
        var h = d.createElement('h2');
        h.className = 'hiw-pane__t';
        h.textContent = label;
        head.appendChild(h);

        lead.appendChild(head);

        var cap = d.createElement('p');
        cap.className = 'hiw-pane__cap';
        cap.textContent = srcCap.textContent;
        lead.appendChild(cap);
        pane.appendChild(lead);
      }

      var srcRec = b.querySelector('[data-rec]');
      if (srcRec) {
        var rec = srcRec.cloneNode(true);
        // Number the fields this stage writes, in document order, so their
        // entrance cascades in reading order. A selector cannot do this: the
        // marked fields are not adjacent and do not share a parent, and
        // :nth-of-type counts every sibling of the same tag rather than only
        // the matching ones. If this ever fails the CSS falls back to --i: 0
        // and they simply land together.
        var written = rec.querySelectorAll('[data-state="new"]');
        Array.prototype.forEach.call(written, function (el, k) {
          el.style.setProperty('--i', String(k));
        });
        pane.appendChild(rec);
      }

      paneWrap.appendChild(pane);
      panes.push(pane);
    });

    wrap.appendChild(rail);
    wrap.appendChild(exhibit);

    stack.parentNode.insertBefore(wrap, stack);
    sec.classList.add('is-tabs');

    // The rail and the exhibit are created after the shell's reveal pass has
    // already run, so they have to be handed to it explicitly or they would
    // simply appear with no entrance while everything around them fades in.
    // revealScan is a no-op under reduced motion (it marks them shown at once)
    // and skips anything already bound, so calling it again is safe.
    if (window.Pharity && window.Pharity.revealScan) {
      window.Pharity.revealScan(wrap);
    }

    // Re-assert whatever was open before a teardown, so crossing the
    // breakpoint back and forth does not silently reset the reader to 01.
    var want = active;
    active = -1;
    select(Math.max(0, Math.min(blocks.length - 1, want)), false);
  }

  /* ── Teardown ──────────────────────────────────────────────────────────── */

  function destroy() {
    if (!wrap) return;
    wrap.parentNode.removeChild(wrap);
    wrap = null; tabs = []; panes = [];
    sec.classList.remove('is-tabs');
  }

  /* ── Selection ─────────────────────────────────────────────────────────── */

  function select(i, focus) {
    if (i === active || i < 0 || i >= tabs.length) return;
    active = i;

    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      // "Done" is every stage before the open one. It lights that stage's dot
      // AND its forward connector, so the rail reads as a path travelled
      // rather than only as which button happens to be lit.
      t.classList.toggle('is-done', k < i);
    });

    panes.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });

    if (focus) tabs[i].focus();
  }

  function onKey(e) {
    var i = tabs.indexOf(e.currentTarget);
    if (i < 0) return;
    var to = -1;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': to = (i + 1) % tabs.length; break;
      case 'ArrowLeft':  case 'ArrowUp':   to = (i - 1 + tabs.length) % tabs.length; break;
      case 'Home': to = 0; break;
      case 'End':  to = tabs.length - 1; break;
      default: return;
    }
    e.preventDefault();
    select(to, true);
  }

  /* ── Mode ──────────────────────────────────────────────────────────────── */

  function sync() { if (mqWide.matches) build(); else destroy(); }

  if (mqWide.addEventListener) mqWide.addEventListener('change', sync);
  else if (mqWide.addListener) mqWide.addListener(sync);

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', sync);
  else sync();
})();
