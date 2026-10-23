// Layout: big number, one hero figure (skill BP-big-number). The number sits in a hero panel
// (id hub, so it glows with each card); supporting cards below explain it.
Layouts['big-number'] = {
  build(K) {
    const { D, board } = K;
    const H = D.hero;
    const hero = document.createElement('section');
    hero.className = 'hero'; hero.id = 'hub';
    hero.innerHTML = `
      <span class="eyebrow">${H.eyebrow}</span>
      <b class="num">${H.number}</b>
      <span class="bar"></span>
      <p class="what">${H.what}</p>
      ${D.example ? '<span class="example-chip">Example data</span>' : ''}`;
    board.appendChild(hero);
    const row = document.createElement('div');
    row.className = 'facts';
    D.cards.forEach((c, i) => { const el = K.card(c, i); K.paint(el, i); row.appendChild(el); });
    board.appendChild(row);
  },
};
