// Content matrix (static skill 24, T17): column heads, a side label for who it is for,
// then one card per pillar holding its angles and a ready post idea for each.
Layouts['content-matrix'] = {
  build(K) {
    const { D, board } = K;
    const head = document.createElement('div');
    head.className = 'cm-head';
    head.innerHTML = `<span></span>${D.columns.map(c => `<b>${c}</b>`).join('')}`;
    board.appendChild(head);
    const body = document.createElement('div');
    body.className = 'cm-body';
    body.innerHTML = `<div class="cm-side"><span>${D.side}</span></div><div class="cm-pillars"></div>`;
    board.appendChild(body);
    const list = body.querySelector('.cm-pillars');
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<div class="cm-pillar"><span class="ic">${K.icon(c.icon, 24)}</span><b>${c.tag}</b><small>${c.sub}</small></div>
        <div class="cm-rows">${c.rows.map(r => `<div class="cm-row"><span class="cm-angle">${r.angle}</span><p class="cm-idea">${r.idea}</p></div>`).join('')}</div>`;
      list.appendChild(el);
    });
  },
};
