// Layout: timeline schedule (static 04, T16). data: cards [{ time, every, icon|logo, title, body, chip }]
Layouts['schedule'] = {
  build(K) {
    K.D.cards.forEach((c, i) => {
      const n = K.pad(i);
      const slot = document.createElement('div');
      slot.className = 'slot'; K.paint(slot, i);
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${n}`; K.paint(el, i);
      const mark = c.logo ? K.logo(c.logo, 56) : `<span class="ic">${K.icon(c.icon, 28)}</span>`;
      el.innerHTML = `${mark}<div><h3>${c.title}</h3><p class="body">${c.body}</p></div>
        ${c.chip ? `<div class="chip"><span class="chip-text" id="chip-${n}">${c.chip}</span><span class="caret" id="caret-${n}"></span></div>` : ''}`;
      slot.innerHTML = `<div class="when"><b>${c.time}</b><small>${c.every}</small></div>`;
      slot.appendChild(el);
      K.board.appendChild(slot);
    });
  },
  connect(K) {
    // a quiet rail between the times and the blocks, a dot and a short arm per slot
    const svg = K.svgEl('links'), B = K.board.getBoundingClientRect();
    const cards = [...K.board.querySelectorAll('.card')];
    const x = cards[0].getBoundingClientRect().left - B.left - 17;
    const top = cards[0].getBoundingClientRect().top - B.top + 10, bot = cards[cards.length - 1].getBoundingClientRect().bottom - B.top - 10;
    svg.insertAdjacentHTML('beforeend', `<line x1="${x}" y1="${top}" x2="${x}" y2="${bot}" stroke="var(--paper-ink)" stroke-opacity=".25" stroke-width="3" stroke-linecap="round"/>`);
    cards.forEach((el, i) => {
      const C = el.getBoundingClientRect(), y = C.top - B.top + C.height / 2;
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, `M${x},${y} L${C.left - B.left},${y}`, K.hueOf(el), { x, y }));
    });
    K.board.prepend(svg);
  },
};
