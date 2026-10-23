// Layout: numbered checklist (static 01). data: cards [{ title, body }]
Layouts['checklist'] = {
  build(K) {
    K.D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<span class="tick">${K.icon(c.icon || 'circle-check', 30)}</span>
        <div class="what"><span class="num">${K.pad(i)}</span><h3>${c.title}</h3></div>
        <p class="body">${c.body}</p>
        <span class="done">${K.icon('circle-check', 22)}</span>`;
      K.board.appendChild(el);
    });
  },
};
