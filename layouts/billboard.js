// Layout: billboard. One claim on a big purple panel, the reasons as cards underneath.
Layouts['billboard'] = {
  build(K) {
    const S = K.D.claim;
    const claim = document.createElement('section');
    claim.className = 'claim'; claim.id = 'hub';
    const words = s => s.replace(/<g>/g, '<span class="hl2">').replace(/<\/g>/g, '</span>');
    claim.innerHTML = `${S.kicker ? `<span class="kicker">${S.kicker}</span>` : ''}
      ${S.lines.map((l, i) => `<div class="line${i === 0 && S.lines.length > 1 ? ' quiet' : ''}">${words(l)}</div>`).join('')}
      ${S.icon ? `<span class="big-ic">${K.icon(S.icon, 60)}</span>` : ''}
      ${S.foot ? `<p class="foot">${S.foot}</p>` : ''}`;
    K.board.appendChild(claim);
    const row = document.createElement('div'); row.className = 'reasons';
    K.D.cards.forEach((c, i) => { const el = K.card(c, i); K.paint(el, i); row.appendChild(el); });
    K.board.appendChild(row);
  },
};
