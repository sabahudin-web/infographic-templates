// Funnel with notes (static skill 22, T12/T13): a side label for who it is for, stages that narrow
// as bands, a note beside each stage, a payoff, then the channels it runs on.
Layouts['funnel-notes'] = {
  ownPayoff: true,
  build(K) {
    const { D, board } = K;
    const wrap = document.createElement('div');
    wrap.className = 'fn-wrap';
    wrap.innerHTML = `<div class="fn-side"><span>${D.side}</span></div><div class="fn-rows" id="fn-rows"></div>`;
    board.appendChild(wrap);
    const rows = wrap.querySelector('.fn-rows');
    const n = D.cards.length;
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      const mark = c.logo ? K.logo(c.logo, 46) : `<span class="ic">${K.icon(c.icon || 'sparkles', 22)}</span>`;
      el.innerHTML = `<div class="tag"><i>${K.pad(i)}</i>${c.tag}</div>
        <div class="fn-band" style="--inset:${i * (14 / Math.max(1, n - 1))}%">${mark}<div><b>${c.stage}</b><span>${c.sub}</span></div></div>
        <div class="fn-note">${K.icon('message-circle', 20)}<p>${c.note}</p></div>`;
      rows.appendChild(el);
    });
    K.payoff();
    rows.appendChild(K.$('payoff'));
    if (D.channels) {
      const ch = document.createElement('div');
      ch.className = 'fn-channels';
      ch.innerHTML = `<span class="fn-ch-label">${D.channelsLabel || 'Runs on'}</span>` + D.channels.map(x =>
        `<span class="fn-ch">${x.logo ? K.logo(x.logo, 34) : `<span class="ic">${K.icon(x.icon, 18)}</span>`}${x.name}</span>`).join('');
      board.appendChild(ch);
    }
  },
};
