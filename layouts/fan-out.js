// Layout: fan-out (skill L1). data: source { title, sub, logo }, cards [{ tag, logo|icon, title, body, tool }], payoff.
Layouts['fan-out'] = {
  ownPayoff: true,
  build(K) {
    const { D, board } = K;
    const s = document.createElement('section');
    s.className = 'fo-source'; s.id = 'hub';
    s.innerHTML = `${D.source.logo ? K.logo(D.source.logo, 84) : `<img src="../assets/logo/mark-dark.svg" alt="" style="width:84px">`}<div><h2>${D.source.title}</h2><p>${D.source.sub}</p></div>`;
    board.appendChild(s);
    const outs = document.createElement('div'); outs.className = 'fo-outs';
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<div class="tag"><i>${K.pad(i)}</i>${c.tag}</div>${c.logo ? K.logo(c.logo, 76) : `<span class="ic" style="width:76px;height:76px;border-radius:21px">${K.icon(c.icon, 36)}</span>`}
        <h3>${c.title}</h3><p class="body">${c.body}</p>
        <div class="doc"><i></i><i></i><i></i><i></i><i></i><i></i><b>${K.icon('circle-check', 16)}${c.status || 'Draft'}</b></div>${c.tool ? `<span class="tool">${c.tool}</span>` : ''}`;
      outs.appendChild(el);
    });
    board.appendChild(outs);
    K.payoff();
  },
  connect(K) {
    // curves fan from the bottom of the source to the top of each output
    const svg = K.svgEl('links'), B = K.board.getBoundingClientRect(), S = K.$('hub').getBoundingClientRect();
    const x0 = S.left + S.width / 2 - B.left, y0 = S.bottom - B.top;
    [...K.board.querySelectorAll('.card')].forEach((el, i) => {
      const C = el.getBoundingClientRect(), x = C.left + C.width / 2 - B.left, y = C.top - B.top - 20;
      const my = (y0 + y) / 2;
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, `M${x0},${y0} C${x0},${my} ${x},${my} ${x},${y}`, K.hueOf(el), { x, y }));
    });
    K.board.prepend(svg);
  },
};
