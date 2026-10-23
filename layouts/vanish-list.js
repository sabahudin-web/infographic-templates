// Layout: vanish list. One card per habit you drop: an icon, the habit crossed out, and what does it now.
Layouts['vanish-list'] = {
  build(K) {
    K.D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<span class="ic">${K.icon(c.icon || 'x', 26)}</span>
        <p class="gone">${c.title}</p>
        ${c.now ? `<span class="now">${K.icon('circle-check', 22)}<span><small>${K.D.nowLabel || 'NOW'}</small>${c.now}</span></span>` : ''}`;
      K.board.appendChild(el);
    });
  },
};
