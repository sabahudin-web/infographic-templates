// Layout: personas dialogue (static 16, T08). data: them { name, role, icon }, cards [{ who: "them"|"me", text }]
Layouts['dialogue'] = {
  build(K) {
    const { D } = K;
    const myFace = D.author.photo ? `<img src="../assets/${D.author.photo}" alt="">` : D.author.initials;
    const theirFace = K.icon(D.them.icon || 'user-check', 28);
    const row = document.createElement('div');
    row.className = 'who-row';
    row.innerHTML = `<span class="persona"><span class="face them">${theirFace}</span><span>${D.them.name}<small>${D.them.role}</small></span></span>
      <span class="persona" style="flex-direction: row-reverse; text-align: right"><span class="face">${myFace}</span><span>${D.author.name}<small>${D.author.role}</small></span></span>`;
    K.board.appendChild(row);
    D.cards.forEach((c, i) => {
      const line = document.createElement('div');
      line.className = `line ${c.who}`;
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`;
      K.paint(el, c.who === 'me' ? 0 : 1);   // my lines warm orange, theirs soft purple
      el.innerHTML = `<p>${c.text}</p>`;
      line.innerHTML = `<span class="face ${c.who === 'me' ? '' : 'them'}">${c.who === 'me' ? myFace : theirFace}</span>`;
      line.appendChild(el);
      K.board.appendChild(line);
    });
  },
};
