/* LVOF Banner Builder — everything runs in the browser; photos never leave the computer. */
(() => {
  'use strict';

  const MAX_SRC = 1600;           // longest side we keep for each photo (plenty for a 10 ft banner)
  const BASE_W = 2000, BASE_H = 1016; // design reference (matches the existing banner)

  const $ = (id) => document.getElementById(id);
  let uid = 1;
  const state = {
    people: [],   // {id, name, age, file, src(dataURL), img(HTMLImageElement), zoom, ox, oy}
    logo: null,   // {src, img}
    selected: null,
  };
  let tiles = []; // hit-test rects from the last preview render (preview canvas px)

  // ---------- helpers ----------
  const opts = () => ({
    title: $('title').value,
    labelTpl: $('labelTpl').value,
    font: $('font').value,
    accent: /^#[0-9a-f]{3,8}$/i.test($('accent').value.trim()) ? $('accent').value.trim() : '#7d3fc4',
    footLeft: $('footLeft').value.split('\n').slice(0, 3),
    footRight: $('footRight').value,
    showCount: $('showCount').checked,
    cols: +$('cols').value,
    shape: $('shape').value,
  });

  function sizePx() {
    const v = $('size').value;
    if (v === 'custom') return [Math.round(+$('cw').value * 100), Math.round(+$('ch').value * 100)];
    return v.split('x').map(Number);
  }

  function parseFilename(fn) {
    let base = fn.replace(/\.[^.]+$/, '').replace(/[_]+/g, ' ').replace(/\s*-\s*/g, ' ').trim();
    let age = '';
    const m = base.match(/^(.*?)[\s(]*(\d{1,3})\)?$/);
    if (m && m[1].trim()) { base = m[1].trim(); age = m[2]; }
    // Title-case only if the whole thing is lower/upper case
    if (base === base.toLowerCase() || base === base.toUpperCase()) {
      base = base.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return { name: base, age };
  }

  function loadImage(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }

  // Downscale + bake EXIF orientation (browsers apply it when drawing <img>) into a JPEG data URL.
  async function fileToSrc(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      const k = Math.min(1, MAX_SRC / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
      x.drawImage(img, 0, 0, c.width, c.height);
      const isPng = /png|webp|gif/i.test(file.type);
      return c.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.92);
    } finally { URL.revokeObjectURL(url); }
  }

  function setStatus(t, warn) { const s = $('status'); s.textContent = t; s.className = 'status' + (warn ? ' warn' : ''); }

  // ---------- people list ----------
  async function addFiles(files) {
    const list = [...files].filter((f) => f.type.startsWith('image/'));
    if (!list.length) return;
    setStatus(`Loading ${list.length} photo(s)…`);
    let n = 0;
    for (const f of list) {
      try {
        const src = await fileToSrc(f);
        const img = await loadImage(src);
        // If a CSV entry already waits for this filename, fill it instead of adding a new one
        const waiting = state.people.find((p) => !p.src && p.file && p.file.toLowerCase() === f.name.toLowerCase());
        if (waiting) Object.assign(waiting, { src, img });
        else state.people.push({ id: uid++, ...parseFilename(f.name), file: f.name, src, img, zoom: 1, ox: 0, oy: -0.25 });
      } catch (e) { console.warn('Could not read', f.name, e); }
      setStatus(`Loading photos… ${++n}/${list.length}`);
    }
    setStatus(`Added ${n} photo(s). Check the names below, then click any photo in the preview to adjust its crop.`);
    refresh();
  }

  function renderList() {
    const box = $('people');
    box.innerHTML = '';
    state.people.forEach((p) => {
      const row = document.createElement('div');
      row.className = 'person' + (state.selected === p.id ? ' sel' : '');
      row.innerHTML = `
        ${p.src ? `<img src="${p.src}" alt="">` : '<div class="noimg">+ photo</div>'}
        <input type="text" value="" placeholder="Name">
        <input type="text" value="" placeholder="Age">
        <button class="x" title="Remove">✕</button>`;
      const [nm, ag] = row.querySelectorAll('input');
      nm.value = p.name; ag.value = p.age;
      nm.oninput = () => { p.name = nm.value; draw(); };
      ag.oninput = () => { p.age = ag.value; draw(); };
      row.querySelector('.x').onclick = () => { state.people = state.people.filter((q) => q !== p); refresh(); };
      row.firstElementChild.onclick = () => select(p.id);
      box.appendChild(row);
    });
    $('count').textContent = `${state.people.length} ${state.people.length === 1 ? 'person' : 'people'}`;
    const missing = state.people.filter((p) => !p.src).length;
    if (missing) setStatus(`${missing} entr${missing === 1 ? 'y needs a photo' : 'ies need photos'} — click "+ photo" in the list.`, true);
  }

  function updateColsSelect() {
    const sel = $('cols'), cur = sel.value, n = Math.max(1, state.people.length);
    sel.innerHTML = '<option value="0">Auto</option>';
    for (let c = 1; c <= Math.min(n, 40); c++) sel.add(new Option(String(c), String(c)));
    sel.value = [...sel.options].some((o) => o.value === cur) ? cur : '0';
  }

  function refresh() { updateColsSelect(); renderList(); syncTileCtl(); draw(); }

  // ---------- layout ----------
  const NAME_H = 0.24, LABEL_H = 0.22, GAP_X = 0.13, GAP_Y = 0.08; // in units of photo size s

  function layout(n, gx, gy, gw, gh, forcedCols) {
    const cellW = (s) => s * (1 + GAP_X);
    const cellH = (s) => s * (1 + NAME_H + LABEL_H + GAP_Y);
    let best = null;
    const tryCols = forcedCols ? [forcedCols] : Array.from({ length: n }, (_, i) => i + 1);
    for (const c of tryCols) {
      const r = Math.ceil(n / c);
      const s = Math.min(gw / (c * (1 + GAP_X)), gh / (r * (1 + NAME_H + LABEL_H + GAP_Y)));
      if (!best || s > best.s + 1e-9) best = { c, r, s };
    }
    const { c, r, s } = best;
    const out = [];
    const totalH = r * cellH(s);
    const y0 = gy + (gh - totalH) / 2;
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / c), col = i % c;
      const inRow = row === r - 1 ? n - row * c : c;
      const x0 = gx + (gw - inRow * cellW(s)) / 2;
      const cx = x0 + col * cellW(s) + cellW(s) / 2;
      const top = y0 + row * cellH(s) + cellH(s) * GAP_Y / (1 + NAME_H + LABEL_H + GAP_Y) / 2;
      out.push({ cx, nameY: top + s * NAME_H * 0.55, px: cx - s / 2, py: top + s * NAME_H, s, labelY: top + s * (NAME_H + 1 + LABEL_H * 0.5) });
    }
    return { cells: out, cols: c, rows: r, s };
  }

  // ---------- rendering ----------
  function fitFont(ctx, text, family, weight, size, maxW) {
    let fs = size;
    ctx.font = `${weight} ${fs}px "${family}"`;
    const w = ctx.measureText(text).width;
    if (w > maxW) { fs = size * maxW / w; ctx.font = `${weight} ${fs}px "${family}"`; }
    return fs;
  }

  function pathShape(ctx, x, y, s, shape) {
    ctx.beginPath();
    if (shape === 'circle') ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
    else if (shape === 'square') ctx.rect(x, y, s, s);
    else ctx.roundRect(x, y, s, s, s * 0.12);
  }

  function drawHeart(ctx, cx, cy, w, color) {
    const h = w * 0.92;
    ctx.save(); ctx.translate(cx, cy - h * 0.5); ctx.beginPath();
    ctx.moveTo(0, h * 0.28);
    ctx.bezierCurveTo(0, 0, -w * 0.5, 0, -w * 0.5, h * 0.3);
    ctx.bezierCurveTo(-w * 0.5, h * 0.62, -w * 0.12, h * 0.8, 0, h);
    ctx.bezierCurveTo(w * 0.12, h * 0.8, w * 0.5, h * 0.62, w * 0.5, h * 0.3);
    ctx.bezierCurveTo(w * 0.5, 0, 0, 0, 0, h * 0.28);
    ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }

  function label(tpl, p) {
    return tpl.replace(/\{age\}/g, p.age || '').replace(/\{name\}/g, p.name || '').replace(/\{years\}/g, p.years || '');
  }

  function render(ctx, W, H, o, people, forPreview) {
    const u = Math.min(W / BASE_W, H / BASE_H);
    ctx.save();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    // background
    ctx.fillStyle = '#0a090c'; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.7);
    g.addColorStop(0, '#1a1720'); g.addColorStop(1, '#060508');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // title
    const titleY = 68 * u;
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${4 * u}px`;
    const tfs = fitFont(ctx, o.title, 'Montserrat', 400, 92 * u, W - 420 * u);
    ctx.fillText(o.title, W / 2, titleY);
    const tw = ctx.measureText(o.title).width;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    if (state.logo) {
      const L = state.logo.img, lh = Math.max(tfs * 1.3, 60 * u), lw = lh * L.naturalWidth / L.naturalHeight;
      ctx.drawImage(L, W / 2 - tw / 2 - lw - 16 * u, titleY - lh / 2, lw, lh);
      ctx.save(); ctx.translate(W / 2 + tw / 2 + 16 * u + lw, titleY - lh / 2); ctx.scale(-1, 1);
      ctx.drawImage(L, 0, 0, lw, lh); ctx.restore();
    }

    // footer
    const footTop = H - 92 * u;
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = '#e8e6ee';
    ctx.font = `400 ${16 * u}px Montserrat`;
    o.footLeft.forEach((line, i) => ctx.fillText(line, 80 * u, footTop + 40 * u + i * 21 * u));
    const heartW = 78 * u, heartCx = W - 75 * u, heartCy = footTop + 46 * u;
    let rightEdge = W - 80 * u;
    if (o.showCount) {
      drawHeart(ctx, heartCx, heartCy, heartW, o.accent);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      fitFont(ctx, String(people.length), 'Montserrat', 500, 34 * u, heartW * 0.62);
      ctx.fillText(String(people.length), heartCx, heartCy - 2 * u);
      rightEdge = heartCx - heartW / 2 - 40 * u;
    }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
    fitFont(ctx, o.footRight, 'Montserrat', 400, 30 * u, W * 0.45);
    ctx.fillText(o.footRight, rightEdge, heartCy);

    // grid
    const gx = 50 * u, gy = 125 * u, gw = W - 100 * u, gh = footTop - gy - 6 * u;
    const lay = people.length ? layout(people.length, gx, gy, gw, gh, o.cols) : null;
    const rects = [];
    if (lay) {
      const bw = Math.max(2, lay.s * 0.035);
      people.forEach((p, i) => {
        const c = lay.cells[i], s = c.s;
        // name
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        fitFont(ctx, p.name || '', o.font, o.font === 'Montserrat' ? 400 : 500, s * 0.2, s * 1.1);
        ctx.fillText(p.name || '', c.cx, c.nameY);
        // photo
        ctx.save();
        ctx.shadowColor = o.accent; ctx.shadowBlur = s * 0.06;
        pathShape(ctx, c.px, c.py, s, o.shape); ctx.fillStyle = '#000'; ctx.fill();
        ctx.restore();
        ctx.save(); pathShape(ctx, c.px, c.py, s, o.shape); ctx.clip();
        if (p.img) {
          const iw = p.img.naturalWidth, ih = p.img.naturalHeight;
          const k = Math.max(s / iw, s / ih) * p.zoom, dw = iw * k, dh = ih * k;
          const ex = dw - s, ey = dh - s;
          ctx.drawImage(p.img, c.px - ex * (p.ox + 1) / 2, c.py - ey * (p.oy + 1) / 2, dw, dh);
        } else {
          ctx.fillStyle = '#26222e'; ctx.fillRect(c.px, c.py, s, s);
          ctx.fillStyle = '#8d88a0'; ctx.textBaseline = 'middle';
          ctx.font = `400 ${s * 0.1}px Montserrat`; ctx.fillText('photo needed', c.cx, c.py + s / 2);
        }
        ctx.restore();
        pathShape(ctx, c.px, c.py, s, o.shape);
        ctx.lineWidth = bw; ctx.strokeStyle = o.accent; ctx.stroke();
        if (forPreview && state.selected === p.id) {
          ctx.save(); ctx.setLineDash([s * 0.06, s * 0.04]); ctx.lineWidth = bw * 0.8; ctx.strokeStyle = '#fff';
          pathShape(ctx, c.px - bw * 1.5, c.py - bw * 1.5, s + bw * 3, o.shape); ctx.stroke(); ctx.restore();
        }
        // label
        const lt = label(o.labelTpl, p).trim();
        if (lt) {
          ctx.fillStyle = '#fff';
          fitFont(ctx, lt, o.font, o.font === 'Montserrat' ? 400 : 500, s * 0.155, s * 1.1);
          ctx.fillText(lt, c.cx, c.labelY);
        }
        rects.push({ id: p.id, x: c.px, y: c.py, s });
      });
    }
    ctx.restore();
    return { rects, lay };
  }

  // ---------- preview ----------
  const cv = $('preview');
  let pending = false;
  function draw() {
    if (pending) return; pending = true;
    requestAnimationFrame(() => {
      pending = false;
      const [W, H] = sizePx();
      const dpr = window.devicePixelRatio || 1;
      const cssW = cv.parentElement.clientWidth;
      const pw = Math.round(cssW * dpr), ph = Math.round(pw * H / W);
      cv.width = pw; cv.height = ph; cv.style.height = `${ph / dpr}px`;
      const ctx = cv.getContext('2d');
      const r = render(ctx, pw, ph, opts(), state.people, true);
      tiles = r.rects;
      if (r.lay && !$('status').classList.contains('warn')) {
        const [W2] = sizePx(); const tilePx = Math.round(r.lay.s * W2 / pw);
        const low = state.people.filter((p) => p.img && Math.min(p.img.naturalWidth, p.img.naturalHeight) * p.zoom < tilePx * 0.5);
        if (low.length) setStatus(`Heads-up: ${low.length} photo(s) are low-resolution for this print size and may look soft (${low.slice(0, 5).map((p) => p.name).join(', ')}${low.length > 5 ? '…' : ''}).`);
      }
    });
  }

  function hit(e) {
    const r = cv.getBoundingClientRect(), k = cv.width / r.width;
    const x = (e.clientX - r.left) * k, y = (e.clientY - r.top) * k;
    return { x, y, t: tiles.find((t) => x >= t.x && x <= t.x + t.s && y >= t.y && y <= t.y + t.s) };
  }

  let drag = null;
  cv.addEventListener('pointerdown', (e) => {
    const { x, y, t } = hit(e);
    if (!t) { select(null); return; }
    select(t.id);
    const p = byId(t.id);
    if (!p.img) { pickPhotoFor(p); return; }
    drag = { p, x, y, ox: p.ox, oy: p.oy, s: t.s };
    cv.setPointerCapture(e.pointerId); cv.classList.add('dragging');
  });
  cv.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const { x, y } = hit(e), p = drag.p;
    const iw = p.img.naturalWidth, ih = p.img.naturalHeight, s = drag.s;
    const k = Math.max(s / iw, s / ih) * p.zoom, ex = iw * k - s, ey = ih * k - s;
    if (ex > 0.5) p.ox = Math.max(-1, Math.min(1, drag.ox - 2 * (x - drag.x) / ex));
    if (ey > 0.5) p.oy = Math.max(-1, Math.min(1, drag.oy - 2 * (y - drag.y) / ey));
    draw();
  });
  const endDrag = () => { drag = null; cv.classList.remove('dragging'); };
  cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);
  cv.addEventListener('wheel', (e) => {
    const { t } = hit(e); if (!t) return;
    e.preventDefault(); select(t.id);
    const p = byId(t.id); p.zoom = Math.max(1, Math.min(4, p.zoom * (e.deltaY < 0 ? 1.06 : 1 / 1.06)));
    syncTileCtl(); draw();
  }, { passive: false });

  const byId = (id) => state.people.find((p) => p.id === id);
  function select(id) { state.selected = id; renderList(); syncTileCtl(); draw(); }
  function syncTileCtl() {
    const p = byId(state.selected);
    $('tilectl').classList.toggle('show', !!p);
    if (p) { $('tileName').textContent = p.name || '(no name)'; $('zoom').value = p.zoom; }
  }
  $('zoom').oninput = () => { const p = byId(state.selected); if (p) { p.zoom = +$('zoom').value; draw(); } };
  $('resetCrop').onclick = () => { const p = byId(state.selected); if (p) { Object.assign(p, { zoom: 1, ox: 0, oy: -0.25 }); syncTileCtl(); draw(); } };
  $('deselect').onclick = () => select(null);
  $('replace').onchange = async (e) => {
    const p = byId(state.selected), f = e.target.files[0]; e.target.value = '';
    if (p && f) await setPhoto(p, f);
  };

  async function setPhoto(p, f) {
    p.src = await fileToSrc(f); p.img = await loadImage(p.src); p.file = f.name;
    Object.assign(p, { zoom: 1, ox: 0, oy: -0.25 });
    if (!p.name) Object.assign(p, parseFilename(f.name));
    refresh();
  }
  function pickPhotoFor(p) {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = () => inp.files[0] && setPhoto(p, inp.files[0]);
    inp.click();
  }
  $('people').addEventListener('click', (e) => {
    if (e.target.classList.contains('noimg')) {
      const idx = [...$('people').children].indexOf(e.target.parentElement);
      pickPhotoFor(state.people[idx]);
    }
  });

  // ---------- inputs ----------
  const drop = $('drop');
  drop.onclick = () => $('files').click();
  $('files').onchange = (e) => { addFiles(e.target.files); e.target.value = ''; };
  ['dragenter', 'dragover'].forEach((ev) => document.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => document.addEventListener(ev, (e) => { e.preventDefault(); if (ev === 'drop' || e.target === document.documentElement) drop.classList.remove('over'); }));
  document.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));

  $('applyCsv').onclick = () => {
    let added = 0, matched = 0;
    $('csv').value.split(/\r?\n/).forEach((line) => {
      const cols = line.split(/\t|,/).map((s) => s.trim().replace(/^"|"$/g, ''));
      if (!cols[0] || /^name$/i.test(cols[0])) return;
      const [name, age = '', file = ''] = cols;
      const hit = file && state.people.find((p) => p.file && p.file.toLowerCase() === file.toLowerCase());
      if (hit) { hit.name = name; hit.age = age; matched++; }
      else { state.people.push({ id: uid++, name, age, file: file || null, src: null, img: null, zoom: 1, ox: 0, oy: -0.25 }); added++; }
    });
    setStatus(`List applied: ${matched} matched to photos, ${added} new entr${added === 1 ? 'y' : 'ies'}.`);
    refresh();
  };

  $('sortAlpha').onclick = () => { state.people.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })); refresh(); };
  $('addBlank').onclick = () => { state.people.push({ id: uid++, name: '', age: '', file: null, src: null, img: null, zoom: 1, ox: 0, oy: -0.25 }); refresh(); };
  $('clearAll').onclick = () => { if (confirm('Remove everyone from this banner?')) { state.people = []; state.selected = null; refresh(); } };
  $('size').onchange = () => { $('customSize').style.display = $('size').value === 'custom' ? 'grid' : 'none'; draw(); };
  ['title', 'labelTpl', 'font', 'accent', 'footLeft', 'footRight', 'showCount', 'cols', 'shape', 'cw', 'ch']
    .forEach((id) => $(id).addEventListener('input', draw));
  $('font').addEventListener('change', () => document.fonts.load(`500 40px "${$('font').value}"`).then(draw));
  $('logo').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) { state.logo = null; draw(); return; }
    const src = await fileToSrc(f); state.logo = { src, img: await loadImage(src) }; draw();
  };
  window.addEventListener('resize', draw);

  // ---------- export ----------
  $('exportBtn').onclick = async () => {
    if (!state.people.length) { setStatus('Add some photos first.', true); return; }
    const [W, H] = sizePx();
    setStatus(`Rendering ${W} × ${H} px…`);
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 30));
    try {
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      render(c.getContext('2d'), W, H, opts(), state.people, false);
      const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
      if (!blob) throw new Error('Browser could not create an image this large');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `LVOF-banner-${state.people.length}-${W}x${H}.png`;
      a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      setStatus(`Exported ${a.download} (${(blob.size / 1e6).toFixed(1)} MB). Send this file to the printer.`);
    } catch (err) {
      setStatus(`Export failed: ${err.message}. Try a smaller size or use Chrome/Edge.`, true);
    }
  };

  // ---------- save / open project ----------
  $('saveProject').onclick = () => {
    const data = {
      v: 1, settings: Object.fromEntries(['title', 'labelTpl', 'font', 'accent', 'footLeft', 'footRight', 'cols', 'shape', 'size', 'cw', 'ch']
        .map((k) => [k, $(k).value]).concat([['showCount', $('showCount').checked]])),
      logo: state.logo && state.logo.src,
      people: state.people.map(({ name, age, file, src, zoom, ox, oy }) => ({ name, age, file, src, zoom, ox, oy })),
    };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
    a.download = `LVOF-banner-project-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };
  $('loadProject').onchange = async (e) => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      for (const [k, v] of Object.entries(data.settings || {})) {
        if (k === 'showCount') $(k).checked = v; else if ($(k)) $(k).value = v;
      }
      $('customSize').style.display = $('size').value === 'custom' ? 'grid' : 'none';
      state.logo = data.logo ? { src: data.logo, img: await loadImage(data.logo) } : null;
      state.people = await Promise.all((data.people || []).map(async (p) => ({ id: uid++, ...p, img: p.src ? await loadImage(p.src) : null })));
      state.selected = null;
      updateColsSelect(); if (data.settings && data.settings.cols) $('cols').value = data.settings.cols;
      setStatus(`Opened project with ${state.people.length} people.`);
      refresh();
    } catch (err) { setStatus('Could not open that project file.', true); }
  };

  // test/automation hook
  window.lvofBanner = { state, addFiles, refresh, render };

  document.fonts.ready.then(refresh);
  refresh();
})();
