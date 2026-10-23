// Layout: routine board (static skill 07-routine-diagram). Stages stacked down the page; each stage is a
// card with a time, a line of what happens, and a row of tiles (tools with real logos, or metrics).
Layouts['routine-board'] = {
  build(K) {
    const { D, board } = K;
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card stage-row'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      const tiles = (c.tiles || []).map(t => t.metric
        ? `<div class="tile metric"><b>${t.metric}</b><span>${t.label}</span></div>`
        : `<div class="tile">${t.logo ? K.logo(t.logo, 46) : `<span class="ic">${K.icon(t.icon, 22)}</span>`}<span>${t.label}</span></div>`).join('');
      el.innerHTML = `
        <div class="tag"><i>${K.pad(i)}</i>${c.tag}</div>
        <div class="head"><span class="when">${c.when}</span><h3>${c.title}</h3><p class="body">${c.body}</p></div>
        <div class="tiles" style="--n:${(c.tiles || []).length}">${tiles}</div>`;
      board.appendChild(el);
    });
  },
};
