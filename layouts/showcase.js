// Layout: showcase. A grid of every template (D.items, built by scripts/make-showcase-thumbs.py),
// an info card in the spare cells, and one hidden pop-up per template for scripts/motion-showcase.js.
Layouts['showcase'] = {
  build(K) {
    const items = K.D.items || [];
    items.forEach((it, i) => {
      const t = document.createElement('div');
      t.className = 'thumb'; t.id = `thumb-${K.pad(i)}`;
      K.paint(t, i % 3);
      t.innerHTML = `<img src="../assets/showcase/${it.name}-sm.jpg" alt="${it.layout}"><b>${i + 1}</b>`;
      K.board.appendChild(t);
    });
    const info = K.D.info;
    if (info) {
      const el = document.createElement('div');
      el.className = 'sc-info';
      el.innerHTML = `<span class="big">${info.big}</span><div class="txt"><strong>${info.label}</strong>${
        info.lines.map(l => `<span>${K.icon('circle-check', 18)}${l}</span>`).join('')}</div>`;
      K.board.appendChild(el);
    }
    // Instagram: a comment call to action under the grid
    const cta = K.D.cta;
    if (cta) {
      const el = document.createElement('div');
      el.className = 'sc-cta';
      el.innerHTML = `${K.icon('message-circle', 30)}<span>${cta.before} <b>${cta.word}</b> ${cta.after}</span>`;
      K.board.after(el);
    }
  },
  connect(K) {
    // the pop-ups live on the page itself, centred over the grid; each remembers where its thumbnail is.
    // With D.tour only the toured templates get a pop-up, showing the first frame of their animation;
    // scripts/make-showcase-tour.sh then plays the real animation inside it.
    const all = K.D.items || [];
    const tour = K.D.tour;
    const items = tour ? tour.items.map(n => all.findIndex(it => it.name === n)) : all.map((_, i) => i);
    const scrim = document.createElement('div');
    scrim.id = 'sc-scrim';
    if (tour) scrim.dataset.tour = JSON.stringify(tour);
    document.body.appendChild(scrim);
    // the pop-ups cover the grid on purpose
    K.board.querySelectorAll('*').forEach(el => el.setAttribute('data-layout-allow-occlusion', ''));
    const B = K.board.getBoundingClientRect();
    // the veil covers the grid only, so the title stays clean
    Object.assign(scrim.style, { inset: 'auto', left: `${B.left - 14}px`, top: `${B.top - 14}px`, width: `${B.width + 28}px`, height: `${B.height + 28}px`, borderRadius: '20px' });
    const W = 620, H = 56 + 775;
    const left = Math.round((1080 - W) / 2), top = Math.round(B.top + (B.height - H) / 2);
    items.forEach(i => {
      const it = all[i];
      const T = K.$(`thumb-${K.pad(i)}`).getBoundingClientRect();
      const p = document.createElement('div');
      p.className = `pop s${i % 3}`; p.id = `pop-${K.pad(i)}`;
      p.style.left = `${left}px`; p.style.top = `${top}px`;
      // offset and scale that put the pop-up exactly over its thumbnail (its image area matches the thumb)
      const s = T.width / W;
      p.dataset.fx = (T.left + T.width / 2 - (left + W / 2)).toFixed(1);
      p.dataset.fy = (T.top - 56 * s + H * s / 2 - (top + H / 2)).toFixed(1);
      p.dataset.fs = s.toFixed(4);
      p.innerHTML = `<header><i>${i + 1}/${all.length}</i><b>${it.layout}</b><span>${it.title}</span></header><img src="../assets/showcase/${it.name}${tour ? '-f0' : ''}.jpg" alt="">`;
      document.body.appendChild(p);
    });
  },
};
