// Layout: case study (static skill 05-case-study-stat / T02). A hero panel with the result, before and after
// to scale and the tools used; three cards below tell stuck, built, result.
Layouts['case-study'] = {
  build(K) {
    const { D, board } = K;
    const H = D.hero;
    const max = Math.max(H.before.value, H.after.value);
    const hero = document.createElement('section');
    hero.className = 'hero'; hero.id = 'hub';
    hero.innerHTML = `
      ${D.example ? '<span class="example-chip">Example data</span>' : ''}
      <div class="who"><span class="eyebrow">${H.eyebrow}</span><p class="client">${H.client}</p></div>
      <div class="result"><b class="num">${H.number}</b><p class="what">${H.what}</p></div>
      <div class="ba">
        ${[['before', H.before], ['after', H.after]].map(([k, x]) => `
          <div class="row ${k}"><span class="k">${k === 'before' ? 'Before' : 'After'}</span>
            <span class="track"><span class="fill" style="width:${(x.value / max) * 100}%"></span></span>
            <b>${x.label}</b></div>`).join('')}
      </div>
      <div class="tools"><span class="k">Built with</span>${(H.tools || []).map(t => K.logo(t, 50)).join('')}</div>`;
    board.appendChild(hero);
    const row = document.createElement('div'); row.className = 'story';
    D.cards.forEach((c, i) => { const el = K.card(c, i); K.paint(el, i); row.appendChild(el); });
    board.appendChild(row);
  },
};
