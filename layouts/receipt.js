// Layout: receipt. Each line is a card (logo, item, note, price) on a paper receipt with a torn edge.
Layouts['receipt'] = {
  build(K) {
    const R = K.D.receipt;
    const paper = document.createElement('section');
    paper.className = 'paper';
    // torn bottom edge: a zigzag of equal teeth, the same every render
    const teeth = 24, w = 760, h = 18;
    let d = `M0,0 `;
    for (let i = 0; i < teeth; i++) d += `L${(i + .5) * w / teeth},${h} L${(i + 1) * w / teeth},0 `;
    paper.innerHTML = `
      ${K.D.example ? '<span class="example">Example data</span>' : ''}
      <div class="head"><b>${R.label}</b><span>${R.period || ''}</span></div>
      <div class="rows" id="rows"></div>
      <div class="total"><b>${R.totalLabel || 'Total'}</b><span class="sum">${R.total}</span></div>
      ${R.note ? `<p class="total-note">${R.note}</p>` : ''}
      <svg class="edge" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${d}Z" fill="#fff"/></svg>`;
    K.board.appendChild(paper);
    const rows = paper.querySelector('#rows');
    K.D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `${c.logo ? K.logo(c.logo, 48) : `<span class="ic">${K.icon(c.icon || 'file-text', 24)}</span>`}
        <span class="what"><b>${c.title}</b>${c.body ? `<small>${c.body}</small>` : ''}</span>
        <span class="price">${c.price}</span>`;
      rows.appendChild(el);
    });
  },
};
