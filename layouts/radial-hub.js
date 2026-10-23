// Layout: radial hub (skill L11). data: hub { label, title, sub, logo }, cards: 4 groups [{ tag, what, tools: [{ logo, name, role }] }]
// placed top, right, bottom, left around the engine.
Layouts['radial-hub'] = {
  build(K) {
    const { D, board } = K;
    const hub = document.createElement('section');
    hub.className = 'rh-hub'; hub.id = 'hub';
    hub.innerHTML = `${D.hub.logo ? K.logo(D.hub.logo, 92) : ''}<span class="lbl">${D.hub.label}</span><h2>${D.hub.title}</h2><p>${D.hub.sub}</p>`;
    board.appendChild(hub);
    const sides = ['top', 'right', 'bottom', 'left'];
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = `card ${sides[i]}`; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<div class="tag"><i>${K.pad(i)}</i>${c.tag}</div><p class="what">${c.what}</p>
        <div class="tools">${c.tools.map(t => `<div class="tool">${K.logo(t.logo, 54)}<span><b>${t.name}</b><small>${t.role}</small></span></div>`).join('')}</div>`;
      board.appendChild(el);
    });
  },
  connect(K) {
    // straight wires from each side of the engine to its group
    const svg = K.svgEl('links'), B = K.board.getBoundingClientRect(), H = K.$('hub').getBoundingClientRect();
    const r = R => ({ l: R.left - B.left, t: R.top - B.top, r: R.right - B.left, b: R.bottom - B.top, cx: R.left + R.width / 2 - B.left, cy: R.top + R.height / 2 - B.top });
    const h = r(H);
    [...K.board.querySelectorAll('.card')].forEach((el, i) => {
      const c = r(el.getBoundingClientRect());
      const side = ['top', 'right', 'bottom', 'left'].find(s => el.classList.contains(s));
      const p = { top: [h.cx, h.t, h.cx, c.b], bottom: [h.cx, h.b, h.cx, c.t], left: [h.l, h.cy, c.r, h.cy], right: [h.r, h.cy, c.l, h.cy] }[side];
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, `M${p[0]},${p[1]} L${p[2]},${p[3]}`, K.hueOf(el), { x: p[2], y: p[3] }));
    });
    K.board.prepend(svg);
  },
};
