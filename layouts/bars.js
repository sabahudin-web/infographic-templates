// Layout: bars, compare values on one scale (skill BP-bars). Each row is a card: name, a bar
// drawn to scale, the value. Bars are true to scale; very small values keep a visible stub.
Layouts['bars'] = {
  build(K) {
    const { D, board } = K;
    const max = Math.max(...D.cards.map(c => c.value));
    if (D.example) board.insertAdjacentHTML('beforeend', `<span class="example-chip">Example data</span>`);
    D.cards.forEach((c, i) => {
      const n = K.pad(i);
      const el = document.createElement('section');
      el.className = 'card' + (c.pick ? ' pick' : ''); el.id = `card-${n}`;
      K.paint(el, i);
      const w = Math.max(1.5, (c.value / max) * 100);
      el.innerHTML = `
        <div class="row-head">
          ${c.icon ? `<span class="ic">${K.icon(c.icon, 24)}</span>` : ''}
          <div class="names"><h3>${c.title}</h3><p class="body">${c.body}</p></div>
          <div class="val"><b>${c.label}</b><small>${c.unit || ''}</small></div>
        </div>
        <div class="track"><span class="fill" style="width:${w}%"></span>${c.pick ? `<span class="pick-tag">${c.pick}</span>` : ''}</div>`;
      board.appendChild(el);
    });
    if (D.note) board.insertAdjacentHTML('beforeend', `<p class="bars-note">${D.note}</p>`);
  },
};
