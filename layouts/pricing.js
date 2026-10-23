// Layout: pricing tiers (static skill 26-pricing-tiers / T19). Main offers as columns, one featured;
// smaller offers in a strip below. Every column is a card the motion walks.
Layouts['pricing'] = {
  build(K) {
    const { D, board } = K;
    const row = document.createElement('div');
    row.className = 'tiers';
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card tier' + (c.featured ? ' featured' : ''); el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `
        ${c.featured ? `<span class="flag">${c.featured}</span>` : ''}
        <div class="tag"><i>${K.pad(i)}</i>${c.tag}</div>
        <span class="ic">${K.icon(c.icon, 24)}</span>
        <h3>${c.title}</h3>
        <p class="price"><b>${c.price}</b><span>${c.per}</span></p>
        <p class="for">${c.for}</p>
        <ul>${c.features.map(f => `<li>${K.icon('circle-check', 20)}<span>${f}</span></li>`).join('')}</ul>
        ${c.facts ? `<dl class="facts">${c.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
        ${c.best ? `<p class="best"><span>${D.bestLabel || 'BEST FOR'}</span>${c.best}</p>` : ''}
        <span class="cta">${c.cta}</span>`;
      row.appendChild(el);
    });
    board.appendChild(row);
    if (D.extras) {
      const ex = document.createElement('div');
      ex.className = 'extras';
      ex.innerHTML = D.extras.map(x => `<div class="extra"><span class="ic">${K.icon(x.icon, 22)}</span><b>${x.name}</b><span class="amt">${x.price}</span></div>`).join('');
      board.appendChild(ex);
    }
    if (D.note) board.insertAdjacentHTML('beforeend', `<p class="note">${D.note}</p>`);
  },
  ownPayoff: false,
};
