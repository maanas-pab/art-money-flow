/* ambient.js — p5 drifting-grain canvas behind the painting.
 * Pure atmosphere: slow pigment specks on #grain. Respects pause + reduced motion.
 */
(function () {
  "use strict";

  let drift = true;
  let specks = [];
  const N = 140;

  function makeSpeck(p, w, h) {
    const palette = ["#7c5cbf", "#e4572e", "#2e86ab", "#f3a712", "#4caf7d", "#f4f1ea"];
    return {
      x: p.random(w),
      y: p.random(h),
      r: p.random(0.6, 2.2),
      vx: p.random(-0.15, 0.15),
      vy: p.random(-0.1, 0.1),
      c: p.random(palette),
      a: p.random(24, 70),
    };
  }

  function sketch(p) {
    p.setup = () => {
      const c = p.createCanvas(p.windowWidth, p.windowHeight);
      c.elt.id = "grain";
      // keep the canvas fixed behind content
      c.elt.style.position = "fixed";
      c.elt.style.inset = "0";
      c.elt.style.zIndex = "0";
      c.elt.style.pointerEvents = "none";
      for (let i = 0; i < N; i++) specks.push(makeSpeck(p, p.width, p.height));
      p.noStroke();
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
      p.clear();
      for (const s of specks) {
        const col = p.color(s.c);
        col.setAlpha(s.a);
        p.fill(col);
        p.circle(s.x, s.y, s.r * 2);
        if (drift) {
          s.x += s.vx + Math.sin((p.frameCount + s.y) * 0.005) * 0.1;
          s.y += s.vy;
          if (s.x < -5) s.x = p.width + 5;
          if (s.x > p.width + 5) s.x = -5;
          if (s.y < -5) s.y = p.height + 5;
          if (s.y > p.height + 5) s.y = -5;
        }
      }
    };
  }

  function boot() {
    if (typeof window.p5 === "undefined") return; // CDN offline → skip gracefully
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) drift = false;
    new window.p5(sketch, document.body);
  }

  window.Ambient = {
    setDrift(v) {
      drift = v;
    },
  };

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", boot)
    : boot();
})();
