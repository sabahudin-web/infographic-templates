// Layout: untangle. The tools sit scattered and tangled at the top; below, one system with every tool wired to it.
// Walking item NN lights that tool in the mess and draws its clean line (link-NN) from the system.
Layouts['untangle'] = {
  build(K) {
    const D = K.D;
    // fixed spots for up to 7 tools, so the mess looks the same every render
    const spots = [[18, 8], [392, 0], [766, 22], [60, 168], [470, 126], [766, 176], [560, 278]];
    K.board.insertAdjacentHTML('beforeend', `<p class="zone-label mess">${D.messLabel || 'Your setup now'}</p>`);
    const mess = document.createElement('div'); mess.className = 'mess-area';
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.style.left = spots[i][0] + 'px'; el.style.top = spots[i][1] + 'px';
      el.innerHTML = `${K.logo(c.logo, 52)}<span class="what"><b>${c.title}</b><small>${c.body}</small></span>`;
      mess.appendChild(el);
    });
    K.board.appendChild(mess);
    K.board.insertAdjacentHTML('beforeend', `<div class="down"><svg width="40" height="58" viewBox="0 0 40 58" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 2 V54 M8 42 L20 54 L32 42"/></svg></div>
      <p class="zone-label calm">${D.calmLabel || 'With one system'}</p>`);
    const sys = document.createElement('section');
    sys.className = 'sys'; sys.id = 'hub';
    sys.innerHTML = `<img src="../assets/logo/mark-dark.svg" alt=""><div><h2>${D.system.title}</h2><p>${D.system.sub}</p></div>`;
    K.board.appendChild(sys);
    const tidy = document.createElement('div'); tidy.className = 'tidy';
    tidy.innerHTML = D.cards.map((c, i) => `<div class="t" id="tidy-${K.pad(i)}">${K.logo(c.logo, 64)}<span>${c.title}</span></div>`).join('');
    K.board.appendChild(tidy);
  },
  connect(K) {
    const B = K.board.getBoundingClientRect();
    const svg = K.svgEl('links');
    const cards = [...K.board.querySelectorAll('.card')];
    const mid = el => { const R = el.getBoundingClientRect(); return { x: R.left - B.left + R.width / 2, y: R.top - B.top + R.height / 2 }; };
    // the tangle: every tool wired to two others, curves that cross
    const pts = cards.map(mid);
    let t = '<g class="tangle">';
    pts.forEach((a, i) => [2, 3].forEach(step => {
      const b = pts[(i + step) % pts.length];
      const bend = (i % 2 ? 1 : -1) * (60 + step * 25);
      t += `<path d="M${a.x},${a.y} C${a.x + bend},${a.y - bend * .6} ${b.x - bend},${b.y + bend * .6} ${b.x},${b.y}"/>`;
    }));
    svg.insertAdjacentHTML('beforeend', t + '</g>');
    // the clean wiring: from the system down to a bus, then to each tool
    const S = K.$('hub').getBoundingClientRect();
    const x0 = S.left - B.left + S.width / 2, y0 = S.bottom - B.top;
    cards.forEach((el, i) => {
      const T = K.$('tidy-' + K.pad(i)).querySelector('.logo').getBoundingClientRect();
      const x = T.left - B.left + T.width / 2, y = T.top - B.top - 6, bus = y0 + (y - y0) * .45, k = 12, s = Math.sign(x - x0);
      const d = Math.abs(x - x0) < 2 ? `M${x0},${y0} L${x},${y}`
        : `M${x0},${y0} L${x0},${bus - k} Q${x0},${bus} ${x0 + s * k},${bus} L${x - s * k},${bus} Q${x},${bus} ${x},${bus + k} L${x},${y}`;
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, d, K.hueOf(el), { x, y }));
    });
    K.board.prepend(svg);
  },
};
