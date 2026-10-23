// Post compare (static skill 14): sections, each a weaker post next to a better one on the same idea,
// written as real post previews, with one line on why the better one works.
Layouts['post-compare'] = {
  build(K) {
    const { D, board } = K;
    let i = 0;
    D.sections.forEach((s, si) => {
      const sec = document.createElement('div');
      sec.className = 'pc-section';
      sec.innerHTML = `<div class="pc-label"><span>${String.fromCharCode(65 + si)}</span>${s.label}</div><div class="pc-pair"></div>`;
      const pair = sec.querySelector('.pc-pair');
      [['weak', s.weak], ['strong', s.strong]].forEach(([kind, p]) => {
        const el = document.createElement('section');
        el.className = `card pc-post ${kind}`; el.id = `card-${K.pad(i)}`; K.paint(el, kind === 'strong' ? 2 : 1);
        const who = kind === 'strong'
          ? `<span class="avatar"><img src="../assets/${D.author.photo}" alt=""></span><span class="pc-who"><b>${D.author.name}</b><small>${D.author.role}</small></span>`
          : `<span class="avatar ghost"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20c.8-4 3.9-6 7.5-6s6.7 2 7.5 6z"/></svg></span><span class="pc-who"><b>${D.weakName || 'A typical post'}</b><small>Seen every day</small></span>`;
        el.innerHTML = `<div class="pc-flag ${kind}">${K.icon(kind === 'strong' ? 'circle-check' : 'x', 16)}${kind === 'strong' ? (D.strongLabel || 'Better') : (D.weakLabel || 'Weak')}</div>
          <div class="pc-top">${who}${K.logo(D.platform || 'linkedin', 30)}</div>
          <p class="pc-text">${p.text}</p>
          <div class="pc-actions">${['heart', 'message-circle', 'repeat', 'send'].map(n => `<span>${K.icon(n, 18)}</span>`).join('')}</div>
          <p class="pc-why">${p.why}</p>`;
        pair.appendChild(el);
        i++;
      });
      board.appendChild(sec);
    });
  },
};
