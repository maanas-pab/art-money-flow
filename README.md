# art-money-flow

**$1,000 Painting — Where Does the Money Go?**

An interactive flow-painting that traces a single $1,000 artwork sale as abstract
rivers — from the buyer's wall back to the artist, gallery, and everyone in
between.

Built with **D3.js + d3-sankey** (the rivers) and **p5.js** (ambient canvas
grain), driven by **one dataset** in [`data/breakdown.json`](data/breakdown.json).

![concept](https://img.shields.io/badge/concept-data%20as%20painting-informational)
![stack](https://img.shields.io/badge/stack-d3%20%E2%80%A2%20p5%20%E2%80%A2%20vanilla-blue)
![license](https://img.shields.io/badge/license-MIT-green)

## The split (default $1,000 sale)

| Stream | Share | Amount |
| --- | --- | --- |
| Gallery (space, staff, shows) | 50% | $500 |
| Artist | 15% | $150 |
| Sales tax / VAT | 12% | $120 |
| Payment + insurance | 10% | $100 |
| Shipping + handling | 8% | $80 |
| Materials (paint, canvas) | 5% | $50 |

> The 50/15 gallery/artist split is the classic commercial-gallery model this
> piece is critiquing — half the river goes to the room the painting hung in.
> Adjust the sale price with the slider and watch every river re-scale.

## Run it

No build step. Any static server works:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open http://localhost:8000 (or `:3000` for `serve`).

## Validate the data

```bash
node scripts/validate.mjs
```

Checks six streams that sum to exactly 1.0. CI runs this before every
Pages deploy.

## Make it yours

Edit [`data/breakdown.json`](data/breakdown.json) — shares, colors, blurbs —
and the sankey, cards, and tooltips repaint automatically. See
[`docs/METHODOLOGY.md`](docs/METHODOLOGY.md) for the model's assumptions.

## Structure

```
index.html          — page skeleton, hero, controls, sections
css/style.css       — gallery theme, river palette, layout
js/rivers.js        — D3 sankey flow-painting
js/ambient.js       — p5 drifting-grain canvas
js/main.js          — slider, cards, tooltip wiring
data/breakdown.json — the one dataset everything renders from
```

## Data

`data/breakdown.json` holds the sale price and six streams (label, share,
color, blurb). The sankey nodes/links, the cards, and the tooltip all render
from this file — edit it and the painting repaints itself.

See [docs/METHODOLOGY](docs/METHODOLOGY.md) for sources and caveats.
