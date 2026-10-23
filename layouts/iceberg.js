// Iceberg: what people see above the waterline, and the bigger part that runs underneath
// (static skill 13, T06). Card 1 is the tip; the rest sit underwater either side of the berg.
Layouts['iceberg'] = {
  build(K) {
    const { D, board } = K;
    board.insertAdjacentHTML('beforeend', `<div class="ib-water" id="ib-water"></div><svg class="ib-berg" id="ib-berg"></svg>
      <span class="ib-label above">${D.above || 'What people see'}</span><span class="ib-label below">${D.below || 'What runs underneath'}</span>`);
    D.cards.forEach((c, i) => {
      const el = K.card(c, i); K.paint(el, i);
      if (i === 0) { el.classList.add('ib-tip'); el.style.gridRow = 1; el.style.gridColumn = 3; }
      else { const k = i - 1; el.style.gridRow = 2 + Math.floor(k / 2); el.style.gridColumn = k % 2 ? 3 : 1; }
      board.appendChild(el);
    });
  },
  connect(K) {
    const { board } = K, B = board.getBoundingClientRect();
    const tip = board.querySelector('.ib-tip').getBoundingClientRect();
    const under = [...board.querySelectorAll('.card')].slice(1).map(c => c.getBoundingClientRect());
    const wl = (tip.bottom + Math.min(...under.map(r => r.top))) / 2 - B.top;
    const water = K.$('ib-water'); water.style.top = wl + 'px';
    const lb = board.querySelector('.ib-label.below');
    Object.assign(lb.style, { top: (wl + 26) + 'px', left: (B.width / 2) + 'px' }); lb.classList.add('centre');
    const la = board.querySelector('.ib-label.above');
    la.style.top = ((tip.top + tip.bottom) / 2 - B.top - 12) + 'px';
    // the berg: a small peak above the line, a wide mass below
    const W = B.width, H = B.height, cx = W / 2, svg = K.$('ib-berg');
    const peak = tip.top - B.top + 6;
    const pts = [[cx - 10, peak], [cx + 30, peak + 46], [cx + 70, wl - 34], [cx + 112, wl],
      [cx + 168, wl + 80], [cx + 178, H * 0.62], [cx + 150, H - 50], [cx + 40, H - 4], [cx - 80, H - 22],
      [cx - 168, H * 0.72], [cx - 176, wl + 110], [cx - 118, wl], [cx - 64, wl - 50], [cx - 34, peak + 34]];
    const d = 'M' + pts.map(p => p.join(',')).join(' L') + ' Z';
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = `<defs><clipPath id="ib-above"><rect x="0" y="0" width="${W}" height="${wl}"/></clipPath>
        <clipPath id="ib-under"><rect x="0" y="${wl}" width="${W}" height="${H - wl}"/></clipPath></defs>
      <path d="${d}" class="ib-ice-under" clip-path="url(#ib-under)"/>
      <path d="${d}" class="ib-ice-above" clip-path="url(#ib-above)"/>
      <line x1="-30" y1="${wl}" x2="${W + 30}" y2="${wl}" class="ib-line"/>`;
    // short ties from each underwater card to the berg
    const links = K.svgEl('links');
    [...board.querySelectorAll('.card')].forEach((el, i) => {
      if (i === 0) return;
      const C = el.getBoundingClientRect(), y = C.top + C.height / 2 - B.top, left = C.right - B.left < cx;
      const x1 = left ? C.right - B.left + 4 : C.left - B.left - 4, x2 = cx + (left ? -150 : 150);
      links.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, `M${x1},${y} L${x2},${y}`, K.hueOf(el), { x: x2, y }));
    });
    board.appendChild(links);
  },
};
