// Layout: folder structure (static 19). data: root, cards [{ name, body, subs[] }]
Layouts['folder-tree'] = {
  build(K) {
    const folder = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>';
    const root = document.createElement('div');
    root.className = 'root'; root.id = 'hub';
    root.innerHTML = `<img src="../assets/logo/mark-dark.svg" alt="">${K.D.root}`;
    K.board.appendChild(root);
    K.D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<span class="fold">${c.icon ? K.icon(c.icon, 26) : folder}</span><span class="name">${c.name}</span>
        <div class="txt"><p class="body">${c.body}</p>${c.subs ? `<div class="subs">${c.subs.map(s => `<span>${s}</span>`).join('')}</div>` : ''}</div>`;
      K.board.appendChild(el);
    });
  },
  connect(K) {
    // the trunk runs down from the root; a rounded branch reaches each folder
    const svg = K.svgEl('links'), B = K.board.getBoundingClientRect(), R = K.$('hub').getBoundingClientRect();
    const x = R.left - B.left + 34, y0 = R.bottom - B.top, k = 12;
    [...K.board.querySelectorAll('.card')].forEach((el, i) => {
      const C = el.getBoundingClientRect(), y = C.top - B.top + C.height / 2, x2 = C.left - B.left;
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, `M${x},${y0} L${x},${y - k} Q${x},${y} ${x + k},${y} L${x2},${y}`, K.hueOf(el)));
    });
    K.board.prepend(svg);
  },
};
