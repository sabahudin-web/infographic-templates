// Layout: big-number list (static 02). data: cards [{ title, body, icon? }]
Layouts['number-list'] = {
  build(K) {
    K.D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<span class="big">${K.pad(i)}</span>
        <div class="txt"><h3>${c.title}</h3><p class="body">${c.body}</p></div>
        <span class="no">${K.icon(c.icon || 'x', 26)}</span>`;
      K.board.appendChild(el);
    });
  },
};
