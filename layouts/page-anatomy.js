// Page anatomy (static skill 25, T18): a mock web page with numbered pins on its parts,
// and one card per part underneath, numbered the same.
Layouts['page-anatomy'] = {
  build(K) {
    const { D, board } = K;
    const m = D.mock;
    // pins are nodes: the motion fills and pops each one as its card lights up
    const pin = n => `<span class="pa-pin node" id="node-${K.pad(n - 1)}">${n}</span>`;
    const page = document.createElement('div');
    page.className = 'pa-browser';
    page.innerHTML = `
      <div class="pa-bar"><i></i><i></i><i></i><span>${m.url}</span></div>
      <div class="pa-page">
        <nav><img src="../assets/logo/lockup-horizontal.svg" alt=""><span class="pa-links">${m.links.map(l => `<em>${l}</em>`).join('')}</span><b class="pa-btn small">${m.button}</b></nav>
        <div class="pa-hero">
          <h4 data-part="1">${m.headline}${pin(1)}</h4>
          <p data-part="2">${m.sub}${pin(2)}</p>
          <div class="pa-cta" data-part="3"><b class="pa-btn">${m.button}</b><small>${m.note}</small>${pin(3)}</div>
        </div>
        <div class="pa-proof" data-part="4">${pin(4)}
          <div class="pa-proof-head">${K.icon('inbox', 18)}<b>${m.proofTitle}</b></div>
          ${m.proof.map((p, i) => `<div class="pa-proof-row"><span class="dot d${i % 3}"></span><span>${p}</span><em>${K.icon('circle-check', 16)} Approve</em></div>`).join('')}
        </div>
      </div>`;
    board.appendChild(page);
    const row = document.createElement('div');
    row.className = 'pa-cards';
    D.cards.forEach((c, i) => { const el = K.card(c, i); K.paint(el, i); row.appendChild(el); });
    board.appendChild(row);
    // pins take their card's colour
    D.cards.forEach((c, i) => K.paint(page.querySelector('#node-' + K.pad(i)), i));
  },
};
