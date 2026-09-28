# Methodology

This is an **illustrative model**, not an invoice. It compresses a messy,
contract-dependent reality into six legible rivers so the imbalance is felt
in one glance.

## The model

For a single $1,000 primary-market gallery sale (USD):

- **Gallery 50%** — the textbook commercial split. Real contracts run
  40–60% (sometimes 30% for high-volume artists, 60%+ for unrepresented ones).
- **Artist 15%** — deliberately *less* than the naive $500 remainder, to show
  the costs that eat the artist's half: studio rent, self-employment tax,
  framing, unsold inventory. Think of it as take-home, not gross.
- **Sales tax / VAT 12%** — a blended stand-in. US combined rates are ~0–10%,
  EU VAT on art ~5–20%. Picked 12% so the river is visible but not dominant.
- **Payment + insurance 10%** — ~3% card processing plus transit/exhibition
  insurance and handler coverage.
- **Shipping + handling 8%** — domestic crated courier for a mid-size canvas.
  International or oversized work can double this.
- **Materials 5%** — paint, linen, stretchers, varnish. The thinnest river
  on purpose: the object costs less than moving and selling it.

Sums to 100%. Drag the price slider and every share re-scales linearly —
a simplification (shipping is actually stepwise), disclosed here.

## Sources & spirit

- Industry norms: gallery 50/50 splits (Artnet, Artsy gallery guides),
  credit-card ~2.9% + $0.30, US sales-tax ranges (Tax Foundation).
- The *feeling* comes from artists' anecdotes: "I sold for $1,000 and kept
  $150." This piece visualizes that sentence.

## Reuse

Edit `data/breakdown.json` — shares, colors, blurbs — and the sankey, cards,
and tooltips repaint. Keep `sumsTo: 1.0` or the rivers will lie.
