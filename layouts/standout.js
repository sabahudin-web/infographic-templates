// Layout: stand-out grid (static skill 23-standout-grid). A field of identical people icons with one that
// stands out in orange and a label; the cards below say what makes the difference.
Layouts['standout'] = {
  build(K) {
    const { D, board } = K;
    const F = D.field, cols = F.cols || 12, rows = F.rows || 6, pick = F.pick || [2, 7];
    const field = document.createElement('section');
    field.className = 'field'; field.id = 'hub';
    let dots = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const on = r === pick[0] && c === pick[1];
      dots += `<span class="person${on ? ' on' : ''}">${K.icon(on ? 'user-check' : 'users', on ? 44 : 38)}</span>`;
    }
    field.innerHTML = `<div class="people" style="--cols:${cols}">${dots}</div>
      <div class="callout" style="--r:${pick[0]};--c:${pick[1]};--cols:${cols};--rows:${rows}"><b>${F.label}</b><span>${F.sub}</span></div>
      <p class="caption">${F.caption}</p>`;
    board.appendChild(field);
    const row = document.createElement('div'); row.className = 'why';
    D.cards.forEach((c, i) => { const el = K.card(c, i); K.paint(el, i); row.appendChild(el); });
    board.appendChild(row);
  },
};
