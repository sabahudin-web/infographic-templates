# How a layout file works

A layout is two files: `layouts/<name>.css` and (for new layouts) `layouts/<name>.js`. The data file's `"layout": "<name>"` picks them.

`<name>.js` registers itself:

```js
Layouts['<name>'] = {
  build(K) { /* add elements to K.board from K.D */ },
  connect(K) { /* optional: draw connectors once fonts have settled */ },
  ownPayoff: false, // true if build() places the payoff strip itself (K.payoff())
};
```

The toolkit `K`:
- `K.D` the data, `K.board` the main area (it gets class `is-<name>`), `K.$(id)`.
- `K.card(c, i)` the standard card (tag, icon, title, chip, body, best); `K.paint(el, i)` gives element i its colour roles; `K.pad(i)` is `01`, `02`...
- `K.icon(name, size)` a line icon (names in `components/icons.js`), `K.logo(slug, size)` a real logo in the premium tile (slugs in `assets/logos/index.js`; add more with `scripts/fetch-logo.sh <domain or name>`).
- In `connect` only: `K.svgEl(cls)`, `K.hueOf(el)`, `K.link(id, d, hue, dot)` for connector paths.

The motion (`scripts/motion-walk.js`) works on any layout if you keep its hooks:
- The items it walks are the elements with class `card`, in DOM order. Give each `id="card-NN"`.
- A connector that should draw in as item NN lights up gets `id="link-NN"` (made with `K.link`).
- An optional centre element gets `id="hub"`; it glows in the colour of the active item.
- Numbered nodes that fill when reached get `id="node-NN"`.
- Keep every item fully visible in the still; the motion only dims and lifts.

Rules: 1080 x 1350, nothing smaller than 17px, no empty half-cards, no invented numbers (use real ones or "to be measured"), the look comes from `components/base.css` and the theme. Never edit `base.css`, the template, the theme or `motion-walk.js` from a layout; ask for a shared change instead.

## Two themes
- `b-warm` (light, default) and `purple-dark` (the brand purple is the page). A data file picks one with `"theme": "purple-dark"`; `THEME=... scripts/render.sh` overrides it.
- Every layout must work in both. Text drawn straight on the page (not inside a light card or panel) uses `var(--paper-ink)` and `var(--paper-ink-soft)`, never `var(--ink)`. Lines and shapes on the page use `K.hueOf(el)` (it returns a light line colour for purple items in the dark theme) or `var(--paper-ink)` with low opacity.
- Check both: `scripts/render.sh data/x.json` and `THEME=purple-dark scripts/render.sh data/x.json x-dark`.
