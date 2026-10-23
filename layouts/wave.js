// Layout: wave (static skill 27-wave-chart / T07). The up-and-down way most people do it, drawn as a wave
// with labelled moments; a steady line shows the other way. Each moment is a card on the chart.
Layouts['wave'] = {
  build(K) {
    const { D, board } = K;
    const C = D.chart;
    const panel = document.createElement('section');
    panel.className = 'chart'; panel.id = 'hub';
    const W = 960, H = 560, pad = 40;
    // the wave: a damped up and down that ends low; the steady line climbs gently
    const pts = [], steady = [];
    for (let k = 0; k <= 120; k++) {
      const t = k / 120, x = pad + t * (W - 2 * pad);
      pts.push(`${x.toFixed(1)},${(H * 0.52 - Math.sin(t * Math.PI * 3.2) * H * 0.33 * (1 - t * 0.35)).toFixed(1)}`);
      steady.push(`${x.toFixed(1)},${(H * 0.86 - t * H * 0.5).toFixed(1)}`);
    }
    panel.innerHTML = `
      <div class="legend"><span class="l wave">${C.waveLabel}</span><span class="l steady">${C.steadyLabel}</span></div>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="plot">
        <line x1="${pad}" y1="${H - 6}" x2="${W - pad}" y2="${H - 6}" class="axis"/>
        <polyline points="${pts.join(' ')}" class="wave-line"/>
        <polyline points="${steady.join(' ')}" class="steady-line"/>
      </svg>
      <span class="ylab">${C.yLabel}</span><span class="xlab">${C.xLabel}</span>`;
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card moment'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.style.left = c.at[0] + '%'; el.style.top = c.at[1] + '%';
      el.innerHTML = `<div class="tag"><i>${K.pad(i)}</i>${c.tag}</div><p class="quote">${c.quote}</p>`;
      panel.appendChild(el);
    });
    board.appendChild(panel);
  },
};
