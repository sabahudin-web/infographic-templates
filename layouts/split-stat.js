// Layout: split stat (static skill 06-big-stat-split / T01). One big share and its small remainder, each a
// panel with the number, what it means and a note; a bar under them shows the split to scale.
Layouts['split-stat'] = {
  build(K) {
    const { D, board } = K;
    const wrap = document.createElement('div'); wrap.className = 'splits';
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card split' + (i === 0 ? ' big' : ''); el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.style.flexGrow = c.weight || c.share; // panel size can be eased; the bar below stays true to scale
      el.innerHTML = `
        <div class="tag"><i>${K.pad(i)}</i>${c.tag}</div>
        <span class="ic">${K.icon(c.icon, 24)}</span>
        <b class="num">${c.number}</b>
        <div class="txt"><h3>${c.title}</h3><p class="body">${c.body}</p>${c.chips ? `<div class="chips">${c.chips.map(x => `<span>${x}</span>`).join('')}</div>` : ''}</div>`;
      wrap.appendChild(el);
    });
    board.appendChild(wrap);
    const bar = document.createElement('div'); bar.className = 'split-bar';
    bar.innerHTML = D.cards.map((c, i) => `<span style="flex:${c.share};background:var(--hue-${i + 1})"></span>`).join('');
    board.appendChild(bar);
    if (D.example) board.insertAdjacentHTML('beforeend', '<span class="example-chip">Example data</span>');
  },
};
