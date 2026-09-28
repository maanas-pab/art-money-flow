import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../data/breakdown.json", import.meta.url)));

const sum = data.streams.reduce((a, s) => a + s.share, 0);
console.log(`streams: ${data.streams.length}, sum: ${sum}`);

let failed = false;
if (data.streams.length !== 6) {
  console.error("expected 6 streams");
  failed = true;
}
if (Math.abs(sum - 1) > 1e-9) {
  console.error(`shares sum to ${sum}, expected 1.0`);
  failed = true;
}
for (const s of data.streams) {
  if (!s.id || !s.label || typeof s.share !== "number" || !s.color || !s.blurb) {
    console.error(`stream missing fields: ${JSON.stringify(s)}`);
    failed = true;
  }
}

if (failed) {
  console.error("dataset check FAILED");
  process.exit(1);
}
console.log("dataset check passed ✓");
