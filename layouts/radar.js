// Layout: radar (skill L3). data: hub { title, sub }, cards [{ tag, logo|icon, title, body }] (5 to 6 sources).
Layouts['radar'] = {
  build(K) {
    const { D, board } = K;
    const hub = document.createElement('section');
    hub.className = 'rd-hub'; hub.id = 'hub';
    hub.innerHTML = `<img src="../assets/logo/mark-dark.svg" alt=""><h2>${D.hub.title}</h2><p>${D.hub.sub}</p>`;
    board.appendChild(hub);
    const n = D.cards.length;
    D.cards.forEach((c, i) => {
      // clockwise from the top, on an ellipse that fits the board
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.style.left = `${50 + Math.cos(a) * 33}%`; el.style.top = `${50 + Math.sin(a) * 42}%`;
      el.innerHTML = `<div class="tag"><i>${K.pad(i)}</i>${c.tag}</div>${c.logo ? K.logo(c.logo, 64) : `<span class="ic" style="width:64px;height:64px;border-radius:18px">${K.icon(c.icon, 30)}</span>`}
        <div class="txt"><h3>${c.title}</h3><p class="body">${c.body}</p></div>`;
      board.appendChild(el);
    });
  },
  connect(K) {
    const B = K.board.getBoundingClientRect(), H = K.$('hub').getBoundingClientRect();
    const cx = H.left + H.width / 2 - B.left, cy = H.top + H.height / 2 - B.top;
    // the radar: two quiet rings and a soft sweep wedge pointing at the first source
    const ring = K.svgEl('rd-ring');
    const rx = B.width * 0.33, ry = B.height * 0.42;
    ring.innerHTML = `<defs><radialGradient id="sw" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${cx} ${cy}) scale(${ry})">
        <stop offset="0" stop-color="#FF6719" stop-opacity=".22"/><stop offset="1" stop-color="#FF6719" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--purple)" stroke-opacity=".16" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * .62}" ry="${ry * .62}" fill="none" stroke="var(--purple)" stroke-opacity=".10" stroke-width="2"/>
      <path d="M${cx},${cy} L${cx - ry * .42},${cy - ry * .9} A${ry} ${ry} 0 0 1 ${cx + ry * .12},${cy - ry * .99} Z" fill="url(#sw)"/>`;
    K.board.prepend(ring);
    // a spoke from the hub edge to each source
    const svg = K.svgEl('links');
    [...K.board.querySelectorAll('.card')].forEach((el, i) => {
      const C = el.getBoundingClientRect(), x = C.left + C.width / 2 - B.left, y = C.top + C.height / 2 - B.top;
      const d = Math.hypot(x - cx, y - cy), r0 = H.width / 2 + 8;
      const sx = cx + (x - cx) / d * r0, sy = cy + (y - cy) / d * r0;
      // stop at the card's edge (ellipse approx of the box)
      const ex = x - (x - cx) / d * Math.min(C.width / 2, Math.abs((C.height / 2) * d / ((y - cy) || 1e-6))) , ey = y - (y - cy) / d * Math.min(C.height / 2, Math.abs((C.width / 2) * d / ((x - cx) || 1e-6)));
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, `M${sx},${sy} L${ex},${ey}`, K.hueOf(el), { x: ex, y: ey }));
    });
    K.board.prepend(svg);
  },
};
