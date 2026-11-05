(function () {
  var COLORS = ['#ffe680', '#b5efcf', '#b9defa', '#ffc7a1', '#e4d9ff'];
  var CITE_COLORS = ['#b8a4ff', '#ffa77a', '#8fe3b4', '#ffd21f', '#7fc4f2'];
  var css = document.createElement('style');
  css.textContent =
    '.bt-cap [data-bt-hide]{visibility:hidden!important}' +
    '.bt-dragging,.bt-dragging *{user-select:none!important;-webkit-user-select:none!important;cursor:grabbing!important}' +
    '.bt-bar{position:fixed;right:24px;bottom:24px;z-index:3000;display:flex;gap:12px;flex-wrap:wrap;justify-content:flex-end}' +
    '.bt-btn{white-space:nowrap;flex:none;cursor:pointer;display:flex;align-items:center;gap:8px;padding:12px 18px;border:3px solid #111;border-radius:16px;box-shadow:4px 4px 0 #111;font:700 14px "DM Sans",sans-serif;color:#111;transition:translate .2s cubic-bezier(.3,1.5,.5,1),box-shadow .2s ease,background .2s ease}' +
    '.bt-btn:hover{translate:-2px -3px;box-shadow:6px 7px 0 #111}.bt-btn:active{translate:2px 2px;box-shadow:0 0 0 #111}' +
    '.bt-btn i{font:800 18px/1 Syne,sans-serif;font-style:normal}' +
    '@keyframes btpop{from{scale:.5;opacity:0}60%{scale:1.08}to{scale:1;opacity:1}}@keyframes btout{to{scale:.4;opacity:0}}@keyframes btflash{from{opacity:.9}to{opacity:0}}@keyframes btrise{from{translate:0 16px;opacity:0}to{translate:0 0;opacity:1}}' +
    '.bt-note{position:absolute;width:224px;pointer-events:auto;background:#fffbea;border:3px solid #111;border-radius:22px;overflow:hidden;display:flex;flex-direction:column;animation:btpop .35s cubic-bezier(.3,1.5,.5,1) both;transition:scale .25s cubic-bezier(.3,1.5,.5,1),rotate .25s cubic-bezier(.3,1.5,.5,1),box-shadow .25s ease}' +
    '.bt-note.drag{scale:1.04;rotate:0deg!important}.bt-note.out{animation:btout .22s ease both}' +
    '.bt-head{position:relative;flex:none;display:flex;align-items:center;height:calc(42px*var(--u,1));padding:0 calc(10px*var(--u,1)) 0 calc(12px*var(--u,1));cursor:grab;touch-action:none;border-bottom:3px solid #111;background-image:radial-gradient(rgba(17,17,17,.2) 2px,transparent 2.5px);background-size:20px 20px}.bt-note.drag .bt-head{cursor:grabbing}' +
    '.bt-tag{padding:calc(3px*var(--u,1)) calc(10px*var(--u,1));background:#111;color:#fff;border-radius:99px;font:700 calc(10.5px*var(--u,1)) "JetBrains Mono",monospace;letter-spacing:.06em;pointer-events:none}' +
    '.bt-del{position:absolute;top:50%;right:calc(10px*var(--u,1));margin-top:-11px;cursor:pointer;width:22px;height:22px;border-radius:50%;border:2px solid #111;background:#fff;color:#111;font:800 11px/1 "DM Sans",sans-serif;padding:0;display:grid;place-items:center;opacity:0;scale:.7;transition:background .15s,scale .2s cubic-bezier(.3,1.5,.5,1),opacity .15s}.bt-note:hover .bt-del{opacity:1;scale:1}.bt-del:hover{background:#ffa77a;scale:1.15!important}' +
    '.bt-body{flex:1;min-height:calc(110px*var(--u,1));padding:calc(14px*var(--u,1)) calc(18px*var(--u,1)) calc(32px*var(--u,1));outline:none;font:500 calc(17px*var(--u,1))/1.5 "DM Sans",sans-serif;color:#111;white-space:pre-wrap;overflow-wrap:anywhere;cursor:text}' +
    '.bt-body:empty:before{content:attr(data-ph);opacity:.45}.bt-cap .bt-body:empty:before{content:""}' +
    '.bt-grip{position:absolute;right:5px;bottom:5px;width:20px;height:20px;cursor:nwse-resize;touch-action:none;background:repeating-linear-gradient(135deg,transparent 0 4px,rgba(17,17,17,.6) 4px 6px);clip-path:polygon(100% 0,100% 100%,0 100%);opacity:.55;transition:opacity .15s}.bt-note:hover .bt-grip,.bt-note.rs .bt-grip{opacity:1}' +
    '.bt-body:empty:before{content:attr(data-ph);opacity:.45}.bt-cap .bt-body:empty:before{content:""}' +
    '.bt-body b,.bt-body strong{font-weight:800}.bt-body i,.bt-body em{font-style:italic}.bt-body s,.bt-body strike,.bt-body del{opacity:.65}' +
    '.bt-body code{font:600 .86em "JetBrains Mono",monospace;background:rgba(17,17,17,.1);padding:1px 6px;border-radius:6px}' +
    '.bt-body mark{background:#ffe680;color:#111;padding:0 4px;border-radius:5px;box-shadow:inset 0 0 0 1.5px rgba(17,17,17,.3)}' +
    '.bt-body ul,.bt-body ol{margin:4px 0;padding-left:1.3em}.bt-body h3{margin:2px 0 4px;font:800 1.3em/1.1 Syne,sans-serif;letter-spacing:-.03em}' +
    '.bt-tb{position:fixed;z-index:3500;display:flex;gap:4px;padding:6px;background:#111;border-radius:14px;box-shadow:3px 4px 0 #ffe680;translate:-50% -100%;opacity:0;scale:.9;pointer-events:none;transition:opacity .15s,scale .2s cubic-bezier(.3,1.5,.5,1)}.bt-tb.on{opacity:1;scale:1;pointer-events:auto}' +
    '.bt-tb button{cursor:pointer;width:32px;height:32px;border:0;border-radius:10px;background:transparent;color:#fff;font:800 14px/1 "DM Sans",sans-serif;display:grid;place-items:center;transition:background .12s,color .12s,scale .15s cubic-bezier(.3,1.5,.5,1)}.bt-tb button:hover{background:rgba(255,255,255,.18);scale:1.08}.bt-tb button.a{background:#ffe680;color:#111}' +
    '.bt-body blockquote{position:relative;margin:0 0 8px;padding:10px 14px 10px;background:rgba(17,17,17,.06);border-radius:12px;font-style:italic;font-weight:500}' +
    '.bt-body blockquote:before{content:"\\201C";display:block;font:800 34px/.7 Syne,sans-serif;color:#6d3fd6;margin-bottom:2px}' +
    '.bt-body cite{display:block;margin-top:8px;font:700 .68em "JetBrains Mono",monospace;font-style:normal;letter-spacing:.04em;opacity:.65}' +
    '.bt-tb button.bt-q{width:auto;padding:0 12px;gap:6px;grid-auto-flow:column;background:#ffe680;color:#111;font:800 13px "DM Sans",sans-serif}.bt-tb button.bt-q:hover{background:#ffd21f;scale:1.04}' +
    'mark[data-bt-hl]{color:inherit;padding:.04em .22em;margin:0 -.22em;background-color:transparent;background-image:linear-gradient(100deg,rgba(143,227,180,0) 0%,rgba(143,227,180,.95) 2.5%,rgba(143,227,180,.78) 50%,rgba(143,227,180,.95) 97.5%,rgba(143,227,180,0) 100%);background-repeat:no-repeat;background-size:100% 82%;background-position:0 78%;border-radius:.9em .25em .7em .3em / .35em .6em .3em .5em;box-decoration-break:clone;-webkit-box-decoration-break:clone;cursor:pointer;transition:background-size .2s ease,filter .2s ease}mark[data-bt-hl]:hover{background-size:100% 100%;filter:saturate(1.3)}' +
    '.bt-rm{position:fixed;z-index:3500;translate:-50% -100%;padding:8px 14px;background:#111;color:#fff;border:0;border-radius:99px;box-shadow:3px 4px 0 #ffe680;font:700 13px "DM Sans",sans-serif;cursor:pointer;white-space:nowrap;opacity:0;scale:.9;pointer-events:none;transition:opacity .15s,scale .2s cubic-bezier(.3,1.5,.5,1),background .15s}.bt-rm.on{opacity:1;scale:1;pointer-events:auto}.bt-rm:hover{background:#c0392b}' +
    'sup[data-bt-cite]{display:inline-grid;place-items:center;min-width:1.45em;height:1.45em;padding:0 .25em;margin-left:.22em;background:#ffe680;color:#111;border:2px solid #111;box-sizing:border-box;border-radius:99px;font:800 .62em/1 "DM Sans",sans-serif;vertical-align:.6em;cursor:pointer;user-select:none;transition:scale .15s cubic-bezier(.3,1.5,.5,1),background .15s,color .15s}sup[data-bt-cite]:hover{scale:1.2}' +
    'sup[data-bt-cite].bt-out{animation:btout .22s ease both;pointer-events:none}' +
    '@keyframes btping{0%,100%{scale:1}35%{scale:1.09}65%{scale:.98}}' +
    '.bt-body blockquote{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}' +
    '.bt-toast{position:fixed;left:50%;bottom:28px;translate:-50% 0;z-index:3100;padding:12px 20px;background:#111;color:#fff;border-radius:99px;font:700 14px "DM Sans",sans-serif;animation:btrise .3s ease both}' +
    '.bt-flash{position:fixed;inset:0;z-index:3200;background:#fff;pointer-events:none;animation:btflash .5s ease both}';
  document.head.appendChild(css);

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function mdInline(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/~~([^~]+)~~/g, '<s>$1</s>').replace(/==([^=]+)==/g, '<mark>$1</mark>').replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<i>$2</i>');
  }
  function mdBlocks(text) {
    var out = '', list = false;
    String(text).split('\n').forEach(function (l) {
      var li = l.match(/^[-*] (.*)$/), h = l.match(/^# (.*)$/);
      if (li) { if (!list) { out += '<ul>'; list = true; } out += '<li>' + mdInline(li[1]) + '</li>'; return; }
      if (list) { out += '</ul>'; list = false; }
      out += h ? '<h3>' + mdInline(h[1]) + '</h3>' : '<div>' + (l ? mdInline(l) : '<br>') + '</div>';
    });
    return out + (list ? '</ul>' : '');
  }
  var OK = { BLOCKQUOTE: 1, CITE: 1, B: 1, STRONG: 1, I: 1, EM: 1, S: 1, STRIKE: 1, DEL: 1, CODE: 1, MARK: 1, UL: 1, OL: 1, LI: 1, H3: 1, DIV: 1, BR: 1, P: 1 };
  function sanitize(html) {
    var t = document.createElement('template'); t.innerHTML = html;
    (function walk(p) {
      [].slice.call(p.childNodes).forEach(function (c) {
        if (c.nodeType === 3) { c.textContent = c.textContent.replace(/\u200b/g, ''); return; }
        if (c.nodeType !== 1) { c.remove(); return; }
        walk(c);
        if (!OK[c.tagName]) { while (c.firstChild) p.insertBefore(c.firstChild, c); c.remove(); return; }
        while (c.attributes.length) c.removeAttribute(c.attributes[0].name);
      });
    })(t.content);
    return t.innerHTML;
  }
  function blocked(n) { var e = n && (n.nodeType === 1 ? n : n.parentNode); return !!(e && e.closest && e.closest('a,button,input,textarea,select,nav,[data-bt-hide],[data-bt-footer],sup[data-bt-cite]')); }
  function closestIn(node, tag, root) { while (node && node !== root) { if (node.nodeType === 1 && node.tagName === tag) return node; node = node.parentNode; } return null; }
  function bodyOf(node) { while (node) { if (node.nodeType === 1 && node.classList && node.classList.contains('bt-body')) return node; node = node.parentNode; } return null; }

  function liveMd(e) {
    if (e.inputType !== 'insertText' || !e.data) return;
    var sel = getSelection(); if (!sel.rangeCount || !sel.isCollapsed) return;
    var node = sel.anchorNode; if (!node || node.nodeType !== 3) return;
    var off = sel.anchorOffset, txt = node.textContent.slice(0, off);
    if (e.data === ' ') {
      if (txt === '- ' || txt === '* ') { node.textContent = node.textContent.slice(off); document.execCommand('insertUnorderedList'); return; }
      if (txt === '# ') { node.textContent = node.textContent.slice(off); document.execCommand('formatBlock', false, 'H3'); return; }
    }
    var rules = [[/\*\*([^*]+)\*\*$/, 'b'], [/~~([^~]+)~~$/, 's'], [/==([^=]+)==$/, 'mark'], [/`([^`]+)`$/, 'code'], [/\*([^*\s][^*]*)\*$/, 'i']];
    for (var k = 0; k < rules.length; k++) {
      var m = txt.match(rules[k][0]); if (!m) continue;
      var start = off - m[0].length;
      if (rules[k][1] === 'i' && txt.charAt(start - 1) === '*') continue;
      var r = document.createRange(); r.setStart(node, start); r.setEnd(node, off); r.deleteContents();
      var el = document.createElement(rules[k][1]); el.textContent = m[1]; r.insertNode(el);
      var zw = document.createTextNode('\u200b'); el.after(zw); sel.collapse(zw, 1); return;
    }
  }

  function selToolbar(paper, onQuote, onHl) {
    window._btQ = { paper: paper, fn: onQuote, hl: onHl };
    if (window._btTb) return; var tb = window._btTb = document.createElement('div'); tb.className = 'bt-tb';
    var cur = null;
    var defs = [
      ['B', 'Bold', function () { document.execCommand('bold'); }, function () { return document.queryCommandState('bold'); }, 'font-weight:900'],
      ['I', 'Italic', function () { document.execCommand('italic'); }, function () { return document.queryCommandState('italic'); }, 'font-style:italic;font-family:Georgia,serif;font-size:16px'],
      ['S', 'Strikethrough', function () { document.execCommand('strikeThrough'); }, function () { return document.queryCommandState('strikeThrough'); }, 'text-decoration:line-through'],
      ['</>', 'Code', function () { wrap('CODE'); }, function () { return !!closestIn(getSelection().anchorNode, 'CODE', cur); }, 'font:700 11px "JetBrains Mono",monospace'],
      ['H', 'Highlight', function () { wrap('MARK'); }, function () { return !!closestIn(getSelection().anchorNode, 'MARK', cur); }, 'background:#ffe680;color:#111;width:18px;height:18px;border-radius:4px;display:grid;place-items:center'],
      ['\u2022', 'List', function () { document.execCommand('insertUnorderedList'); }, function () { return document.queryCommandState('insertUnorderedList'); }, 'font-size:18px'],
      ['T', 'Heading', function () { document.execCommand('formatBlock', false, String(document.queryCommandValue('formatBlock')).toLowerCase() === 'h3' ? 'DIV' : 'H3'); }, function () { return String(document.queryCommandValue('formatBlock')).toLowerCase() === 'h3'; }, 'font-family:Syne,sans-serif;font-weight:800']
    ];
    function wrap(tag) {
      var s = getSelection(), r = s.getRangeAt(0), a = closestIn(s.anchorNode, tag, cur);
      if (a) { var t = document.createTextNode(a.textContent); a.replaceWith(t); r = document.createRange(); r.selectNodeContents(t); s.removeAllRanges(); s.addRange(r); return; }
      var el = document.createElement(tag.toLowerCase()); el.appendChild(r.extractContents()); r.insertNode(el);
      r = document.createRange(); r.selectNodeContents(el); s.removeAllRanges(); s.addRange(r);
    }
    var btns = defs.map(function (d) {
      var b = document.createElement('button'); b.title = d[1]; b.setAttribute('style', d[4]); b.textContent = d[0];
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });
      b.addEventListener('click', function () { if (!cur) return; d[2](); cur.dispatchEvent(new Event('input', { bubbles: true })); upd(); });
      tb.appendChild(b); return { b: b, on: d[3] };
    });
    var qb = document.createElement('button'); qb.className = 'bt-q'; qb.title = 'Cite with a note';
    qb.innerHTML = '<span style="font:800 20px/.8 Syne,sans-serif">\u201C</span>Cite';
    qb.addEventListener('mousedown', function (e) { e.preventDefault(); });
    qb.addEventListener('click', function () {
      var s = getSelection(); if (!s.rangeCount) return;
      var text = s.toString().trim().replace(/\s+/g, ' '); if (!text) return;
      var rg = s.getRangeAt(0), rect = rg.getBoundingClientRect(); window._btQ.fn(text, rect, rg); s.removeAllRanges(); upd();
    });
    var hb = document.createElement('button'); hb.className = 'bt-q'; hb.title = 'Highlight on the page';
    hb.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M4 20h16"/><path d="M14.5 4.5l5 5L10 19H5v-5z" fill="#b5efcf"/></svg>Highlight';
    hb.style.background = '#b5efcf';
    hb.addEventListener('mousedown', function (e) { e.preventDefault(); });
    hb.addEventListener('click', function () { var s = getSelection(); if (!s.rangeCount) return; window._btQ.hl(s.getRangeAt(0)); s.removeAllRanges(); upd(); });
    tb.appendChild(hb); tb.appendChild(qb);
    document.body.appendChild(tb);
    function inNote(n) { while (n) { if (n.nodeType === 1 && n.classList && n.classList.contains('bt-note')) return true; n = n.parentNode; } return false; }
    function upd() {
      var s = getSelection(), ok = s && s.rangeCount && !s.isCollapsed, b = ok ? bodyOf(s.anchorNode) : null;
      var P = window._btQ.paper, quoteMode = ok && !b && !inNote(s.anchorNode) && !blocked(s.anchorNode) && !blocked(s.focusNode) && P.contains(s.anchorNode) && s.toString().trim().length > 1;
      if (!b && !quoteMode) { tb.classList.remove('on'); cur = null; return; }
      cur = b; btns.forEach(function (x) { x.b.style.display = b ? '' : 'none'; }); qb.style.display = b ? 'none' : '';
      var art = P.querySelector('article'), inArt = !b && art && art.contains(s.anchorNode) && art.contains(s.focusNode); hb.style.display = inArt ? '' : 'none'; var rc = s.getRangeAt(0).getBoundingClientRect();
      tb.style.left = Math.max(120, Math.min(innerWidth - 120, rc.left + rc.width / 2)) + 'px';
      tb.style.top = Math.max(56, rc.top - 10) + 'px';
      if (b) btns.forEach(function (x) { var on = false; try { on = x.on(); } catch (e) {} x.b.classList.toggle('a', !!on); });
      tb.classList.add('on');
    }
    document.addEventListener('selectionchange', upd);
    document.addEventListener('scroll', function () { tb.classList.remove('on'); }, true);
  }

  var fontCSS = null;
  function blobToData(b) { return new Promise(function (res) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.readAsDataURL(b); }); }
  function buildFontCSS() {
    if (fontCSS) return Promise.resolve(fontCSS);
    var links = [].slice.call(document.querySelectorAll('link[href*="fonts.googleapis.com"]'));
    return Promise.all(links.map(function (l) { return fetch(l.href).then(function (r) { return r.text(); }); })).then(function (txts) {
      var blocks = [];
      txts.join('\n').replace(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g, function (m, sub, face) { if (sub === 'latin' || sub === 'latin-ext') blocks.push(face); return m; });
      return Promise.all(blocks.map(function (face) {
        var m = face.match(/url\((https:[^)]+)\)/); if (!m) return face;
        return fetch(m[1]).then(function (r) { return r.blob(); }).then(blobToData).then(function (d) { return face.replace(m[1], d); }).catch(function () { return face; });
      }));
    }).then(function (faces) { fontCSS = faces.join('\n'); return fontCSS; });
  }

  function toast(msg) {
    var t = document.createElement('div'); t.className = 'bt-toast'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }

  function init(paper) {
    if (paper._bt) return; paper._bt = 1;
    if (getComputedStyle(paper).position === 'static') paper.style.position = 'relative';
    var pid = new URLSearchParams(location.search).get('id');
    var KEY = 'blog-notes:' + decodeURIComponent(location.pathname.split('/').pop()) + (pid ? '#' + pid : '');
    var layer = document.createElement('div');
    layer.setAttribute('data-notes-layer', '');
    layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:50;overflow:hidden';
    paper.appendChild(layer);
    var notes = []; try { notes = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
    var save = function () { try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (e) {} };
    var timer;
    var saveSoon = function () { clearTimeout(timer); timer = setTimeout(save, 250); };

    var removeCite = null;
    function make(n, spawn) {
      var el = document.createElement('div'); el.className = 'bt-note';
      el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; el.style.rotate = n.r + 'deg';
      el.style.boxShadow = '6px 7px 0 #111';
      if (!spawn) el.style.animation = 'none';
      var tag = document.createElement('span'); tag.className = 'bt-tag'; tag.textContent = n.q ? 'CITE' : 'NOTE'; var reg = { n: n, tag: tag, el: el }; els.push(reg);
      var grip = document.createElement('i'); grip.className = 'bt-grip'; grip.setAttribute('data-bt-hide', '');
      var setSize = function () { el.style.width = (n.w || 224) + 'px'; el.style.setProperty('--u', ((n.w || 224) / 224).toFixed(3)); el.style.minHeight = n.h ? n.h + 'px' : ''; }; setSize();
      var rs = null;
      grip.addEventListener('pointerdown', function (e) { e.stopPropagation(); e.preventDefault(); rs = { x: e.clientX, y: e.clientY, w: n.w || 224, h: el.offsetHeight }; if (getSelection) getSelection().removeAllRanges(); document.documentElement.classList.add('bt-dragging'); grip.setPointerCapture(e.pointerId); el.classList.add('rs'); });
      grip.addEventListener('pointermove', function (e) {
        if (!rs) return;
        var w = Math.max(150, Math.min(460, rs.w + (e.clientX - rs.x)));
        n.w = Math.round(w); n.h = Math.max(Math.round(120 * w / 224), Math.round(rs.h + (e.clientY - rs.y)));
        n.x = Math.min(n.x, Math.max(0, paper.clientWidth - n.w)); el.style.left = n.x + 'px'; setSize();
      });
      var rsEnd = function () { if (!rs) return; rs = null; document.documentElement.classList.remove('bt-dragging'); el.classList.remove('rs'); save(); };
      grip.addEventListener('pointerup', rsEnd); grip.addEventListener('pointercancel', rsEnd);
      var head = document.createElement('div'); head.className = 'bt-head';
      var del = document.createElement('button'); del.className = 'bt-del'; del.textContent = '\u2715'; del.setAttribute('data-bt-hide', ''); del.title = 'Remove note';
      var body = document.createElement('div'); body.className = 'bt-body'; body.contentEditable = 'true'; body.setAttribute('data-ph', 'Write a note\u2026');
      body.innerHTML = sanitize(n.h || mdBlocks(n.t || ''));
      body.addEventListener('paste', function (e) { e.preventDefault(); var tx = (e.clipboardData || window.clipboardData).getData('text'); document.execCommand('insertHTML', false, mdBlocks(tx)); });
      body.addEventListener('input', function (e) { if (e && e.inputType) liveMd(e); n.h = sanitize(body.innerHTML); n.t = body.innerText; saveSoon(); });
      body.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      del.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      del.addEventListener('click', function () {
        el.classList.add('out'); el.style.animation = 'btout .28s cubic-bezier(.4,0,.6,1) both';
        if (n.cid && art) { var sp = art.querySelector('sup[data-bt-cite="' + n.cid + '"]'); if (sp) { sp.classList.add('bt-out'); sp.style.animation = 'btout .28s cubic-bezier(.4,0,.6,1) both'; } }
        setTimeout(function () { el.remove(); notes = notes.filter(function (x) { return x !== n; }); els = els.filter(function (x) { return x !== reg; }); if (n.cid && removeCite) removeCite(n.cid); save(); }, 290);
      });
      var d = null;
      el.addEventListener('animationend', function () { if (!el.classList.contains('out')) el.style.animation = 'none'; });
      el.addEventListener('pointerdown', function (e) {
        if (e.target === body || e.target === del || e.target === grip) return;
        e.preventDefault(); if (getSelection) getSelection().removeAllRanges(); document.documentElement.classList.add('bt-dragging');
        el.style.animation = 'none';
        if (layer.lastChild !== el) layer.appendChild(el);
        var r = paper.getBoundingClientRect();
        d = { px: r.left + scrollX, py: r.top + scrollY, ox: e.pageX - (r.left + scrollX) - n.x, oy: e.pageY - (r.top + scrollY) - n.y, mx: paper.clientWidth - el.offsetWidth, my: paper.scrollHeight - el.offsetHeight, raf: 0, ex: 0, ey: 0 };
        el.setPointerCapture(e.pointerId); el.classList.add('drag'); el.style.boxShadow = '11px 13px 0 #111';
      });
      el.addEventListener('pointermove', function (e) {
        if (!d) return;
        d.ex = e.pageX; d.ey = e.pageY;
        if (d.raf) return;
        d.raf = requestAnimationFrame(function () {
          if (!d) return; d.raf = 0;
          n.x = Math.max(0, Math.min(d.mx, d.ex - d.px - d.ox));
          n.y = Math.max(0, Math.min(d.my, d.ey - d.py - d.oy));
          el.style.left = n.x + 'px'; el.style.top = n.y + 'px';
        });
      });
      var drop = function () { if (!d) return; if (d.raf) cancelAnimationFrame(d.raf); d = null; document.documentElement.classList.remove('bt-dragging'); el.classList.remove('drag'); el.style.boxShadow = '6px 7px 0 #111'; el.style.zIndex = ''; save(); };
      el.addEventListener('click', function (e) { if (e.target === el) { body.focus(); var sel = getSelection(), r = document.createRange(); r.selectNodeContents(body); r.collapse(false); sel.removeAllRanges(); sel.addRange(r); } });
      el.addEventListener('pointerup', drop); el.addEventListener('pointercancel', drop);
      head.style.backgroundColor = n.c; head.appendChild(tag); head.appendChild(del); el.appendChild(head); el.appendChild(body); el.appendChild(grip); layer.appendChild(el);
      return body;
    }

    var art = paper.querySelector('article'), HKEY = KEY + '|hl', hls = [], els = [];
    try { hls = JSON.parse(localStorage.getItem(HKEY) || '[]'); } catch (e) {}
    var remapCites = function () { hls.filter(function (h) { return h.c; }).forEach(function (h, i) { h.col = CITE_COLORS[i % CITE_COLORS.length]; notes.forEach(function (n) { if (n.cid === h.id) n.c = h.col; }); }); };
    remapCites();
    var saveH = function () { try { localStorage.setItem(HKEY, JSON.stringify(hls)); } catch (e) {} };
    function textNodes() {
      var w = document.createTreeWalker(art, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.parentNode.closest && n.parentNode.closest('sup[data-bt-cite]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } }), a = [], x;
      while ((x = w.nextNode())) a.push(x); return a;
    }
    function offsetOf(container, off) {
      var r = document.createRange(); r.setStart(container, off); r.collapse(true);
      var pos = 0, ns = textNodes();
      for (var i = 0; i < ns.length; i++) { var n = ns[i]; if (n === container) { pos += off; break; } if (r.comparePoint(n, n.length) < 0) pos += n.length; else break; }
      return pos;
    }
    function applyHl(h) {
      var pos = 0, segs = [];
      textNodes().forEach(function (n) { var a = pos, b = pos + n.length; pos = b; var s = Math.max(h.s, a), e = Math.min(h.e, b); if (s < e) { var seg = n.data.slice(s - a, e - a), lead = seg.length - seg.replace(/^\s+/, '').length, trail = seg.length - seg.replace(/\s+$/, '').length; if (lead + trail >= seg.length) return; segs.push([n, s - a + lead, e - a - trail]); } });
      segs.forEach(function (g) {
        var t = g[0]; if (g[1] > 0) t = t.splitText(g[1]);
        if (g[2] - g[1] < t.length) t.splitText(g[2] - g[1]);
        var m = document.createElement('mark'); m.setAttribute('data-bt-hl', h.id); t.parentNode.insertBefore(m, t); m.appendChild(t);
      });
    }
    function insertCiteAt(id, p, col) {
      var pos = 0, ns = textNodes(), target = null, cut = 0;
      for (var i = 0; i < ns.length; i++) { var a = pos, b = pos + ns[i].length; pos = b; if (p <= b) { target = ns[i]; cut = p - a; break; } }
      if (!target) return;
      var sup = document.createElement('sup'); sup.setAttribute('data-bt-cite', id); sup.setAttribute('contenteditable', 'false'); sup.textContent = '1'; sup.style.background = col || '#ffe680';
      if (cut < target.length) target.splitText(cut);
      target.after(sup);
    }
    function renumber() {
      var nums = {}; [].slice.call(art.querySelectorAll('sup[data-bt-cite]')).forEach(function (s, i) { s.textContent = i + 1; nums[s.getAttribute('data-bt-cite')] = i + 1; });
      els.forEach(function (x) { if (x.n.q) x.tag.textContent = x.n.cid && nums[x.n.cid] ? 'CITE ' + nums[x.n.cid] : 'NOTE'; });
    }
    function addHl(range, cite) {
      if (!art || !art.contains(range.startContainer) || !art.contains(range.endContainer) || blocked(range.startContainer) || blocked(range.endContainer)) return null;
      var s = offsetOf(range.startContainer, range.startOffset), e = offsetOf(range.endContainer, range.endOffset); if (e <= s) return null;
      var h = { id: 'h' + Date.now().toString(36), s: s, e: e }; hls.push(h); applyHl(h); saveH(); return h.id;
    }
    function addCite(range) {
      if (!art || !art.contains(range.endContainer) || blocked(range.endContainer)) return null;
      var p = offsetOf(range.endContainer, range.endOffset), col = CITE_COLORS[hls.filter(function (h) { return h.c; }).length % CITE_COLORS.length];
      var h = { id: 'c' + Date.now().toString(36), p: p, col: col, c: true }; hls.push(h); insertCiteAt(h.id, p, col); saveH(); renumber(); return h;
    }
    function unHl(id) {
      [].slice.call(art.querySelectorAll('mark[data-bt-hl="' + id + '"]')).forEach(function (m) { while (m.firstChild) m.parentNode.insertBefore(m.firstChild, m); m.remove(); });
      [].slice.call(art.querySelectorAll('sup[data-bt-cite="' + id + '"]')).forEach(function (s) { s.remove(); });
      art.normalize(); hls = hls.filter(function (h) { return h.id !== id; }); saveH();
      notes.forEach(function (n) { if (n.cid === id) n.cid = null; }); save(); renumber();
    }
    removeCite = unHl;
    function ping(id) {
      var x = els.filter(function (q) { return q.n.cid === id; })[0]; if (!x) return;
      var top = x.el.getBoundingClientRect().top + scrollY - 140; window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      x.el.style.animation = 'btping .65s ease';
    }
    function addQuote(text, rect, range) {
      var pr = paper.getBoundingClientRect(), ct = range ? addCite(range) : null;
      var n = { x: Math.max(8, Math.min(paper.clientWidth - 248, rect.right - pr.left + 24)), y: Math.max(8, rect.top - pr.top - 10), c: ct ? ct.col : COLORS[notes.length % COLORS.length], r: +(Math.random() * 4 - 2).toFixed(1), t: '', q: true, cid: ct ? ct.id : null };
      notes.push(n); save();
      var body = make(n, true); renumber();
      setTimeout(function () { body.focus(); }, 80);
    }
    if (art) {
      hls.forEach(function (h) { if (h.c) insertCiteAt(h.id, h.p != null ? h.p : h.e, h.col); else applyHl(h); });
      renumber();
      var rm = document.createElement('button'); rm.className = 'bt-rm'; rm.textContent = 'Remove highlight \u2715'; document.body.appendChild(rm); var rmId = null;
      document.addEventListener('click', function (e) {
        var cs = e.target.closest && e.target.closest('sup[data-bt-cite]');
        if (cs) { ping(cs.getAttribute('data-bt-cite')); rm.classList.remove('on'); return; }
        var m = e.target.closest && e.target.closest('mark[data-bt-hl]');
        if (m && getSelection().isCollapsed) { rmId = m.getAttribute('data-bt-hl'); var r = m.getBoundingClientRect(); rm.style.left = Math.max(90, Math.min(innerWidth - 90, r.left + r.width / 2)) + 'px'; rm.style.top = Math.max(56, r.top - 8) + 'px'; rm.classList.add('on'); }
        else if (e.target !== rm) rm.classList.remove('on');
      });
      rm.addEventListener('click', function () { if (rmId) unHl(rmId); rm.classList.remove('on'); });
      document.addEventListener('scroll', function () { rm.classList.remove('on'); }, true);
    }
    selToolbar(paper, addQuote, function (r) { return addHl(r, false); });
    notes.forEach(function (n) { make(n, false); });
    if (typeof renumber === 'function' && art) renumber();

    function add() {
      var r = paper.getBoundingClientRect();
      var n = {
        x: Math.max(8, Math.min(paper.clientWidth - 220, innerWidth / 2 - r.left - 106 + (Math.random() * 120 - 60))),
        y: Math.max(8, innerHeight / 2 - r.top - 100 + (Math.random() * 80 - 40)),
        c: COLORS[notes.length % COLORS.length], r: +(Math.random() * 6 - 3).toFixed(1), t: ''
      };
      notes.push(n); save();
      var body = make(n, true); setTimeout(function () { body.focus(); }, 60);
    }

    function capture() {
      if (!window.htmlToImage) { toast('Export library is still loading, try again'); return; }
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      paper.classList.add('bt-cap');
      var brand = document.createElement('div');
      brand.style.cssText = 'position:relative;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;max-width:1180px;margin:8px auto 0;padding:26px clamp(18px,4vw,56px) 36px;box-sizing:border-box';
      brand.innerHTML = '<span style="padding:8px 18px;background:#fff;border:3px solid #111;border-radius:16px;box-shadow:4px 4px 0 #111;font:800 21px Syne,sans-serif;letter-spacing:-.03em;rotate:-3deg">umut<span style="color:#ffd21f">.</span></span><span style="font:700 14px \'JetBrains Mono\',monospace">Servers first. Chains too.</span><span style="padding:12px 24px;background:#111;color:#ffe680;border-radius:99px;font:800 21px Syne,sans-serif;letter-spacing:-.02em">umutsatir.dev</span>';
      var olds = [].slice.call(paper.querySelectorAll('[data-bt-footer]')); olds.forEach(function (f) { f.style.display = 'none'; });
      paper.appendChild(brand);
      var w = paper.scrollWidth, h = paper.scrollHeight;
      (document.fonts && document.fonts.ready || Promise.resolve()).then(buildFontCSS).catch(function () { return ''; }).then(function (fc) {
        return htmlToImage.toPng(paper, { pixelRatio: 2, cacheBust: true, width: w, height: h, fontEmbedCSS: fc || undefined });
      }).then(function (url) {
        var f = document.createElement('div'); f.className = 'bt-flash'; document.body.appendChild(f); setTimeout(function () { f.remove(); }, 520);
        var a = document.createElement('a'); a.href = url; a.download = 'umutsatir-blog-' + new Date().toISOString().slice(0, 10) + '.png'; document.body.appendChild(a); a.click(); a.remove();
        toast('Saved as PNG');
      }).catch(function () { toast('Capture failed, try again'); }).then(function () { paper.classList.remove('bt-cap'); brand.remove(); olds.forEach(function (f) { f.style.display = ''; }); });
    }

    var bar = document.createElement('div'); bar.className = 'bt-bar';
    var b1 = document.createElement('button'); b1.className = 'bt-btn'; b1.style.background = '#ffe680'; b1.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M5 3h14v11l-6 7H5z" fill="#fff"/><path d="M19 14h-6v7"/><path d="M8.5 8h7M8.5 12h4"/></svg>Sticky note'; b1.onclick = add;
    var b2 = document.createElement('button'); b2.className = 'bt-btn'; b2.style.background = '#fff'; b2.innerHTML = '<svg width="24" height="22" viewBox="0 0 24 22" fill="none" stroke="#111" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M8.5 3h7l1.5 2.5H21a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 21 19.5H3A1.5 1.5 0 0 1 1.5 18V7A1.5 1.5 0 0 1 3 5.5h4z" fill="#fff"/><circle cx="12" cy="12" r="3.8" fill="#fff"/></svg>Capture'; b2.onclick = capture;
    bar.appendChild(b1); bar.appendChild(b2); document.body.appendChild(bar);
  }
  window.BlogTools = { init: init };
})();
