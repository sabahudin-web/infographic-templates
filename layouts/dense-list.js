// Layout: dense list (static 03). data: cards [{ title, body, pill }], payoff
Layouts['dense-list'] = {
  build(K) {
    K.D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<span class="n">${K.pad(i)}</span><h3>${c.title}</h3><p class="body">${c.body}</p>${c.pill ? `<span class="pill">${c.pill}</span>` : ''}`;
      K.board.appendChild(el);
    });
  },
};
