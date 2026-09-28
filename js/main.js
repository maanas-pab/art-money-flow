/* main.js — slider, cards, tooltip wiring. */
(function () {
  "use strict";

  const fmt$ = (n) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const priceInput = document.getElementById("price");
  const priceOutput = document.getElementById("price-output");
  const heroPrice = document.getElementById("hero-price");
  const cardsEl = document.getElementById("cards");
  const tooltip = document.getElementById("tooltip");
  const wrap = document.getElementById("river-wrap");
  const replayBtn = document.getElementById("replay");
  const motionBtn = document.getElementById("toggle-motion");

  let dataset = null;
  let driftOn = true;

  function paintCards(price) {
    cardsEl.innerHTML = "";
    for (const s of dataset.streams) {
      const amount = s.share * price;
      const el = document.createElement("article");
      el.className = "card";
      el.style.setProperty("--accent", s.color);
      el.style.borderTopColor = s.color;
      el.dataset.id = s.id;
      el.tabIndex = 0;
      el.innerHTML = `
        <h3>${s.label}</h3>
        <div class="amount">${fmt$(amount)}</div>
        <div class="share">${Math.round(s.share * 100)}% of sale</div>
        <p>${s.blurb}</p>
      `;
      el.addEventListener("pointerenter", () => isolate(s.id));
      el.addEventListener("pointerleave", clearIsolate);
      el.addEventListener("focus", () => isolate(s.id));
      el.addEventListener("blur", clearIsolate);
      cardsEl.appendChild(el);
    }
  }

  function isolate(id) {
    document
      .querySelectorAll("#river .link")
      .forEach((p) => p.classList.toggle("dim", p.dataset.id !== id));
  }

  function clearIsolate() {
    document
      .querySelectorAll("#river .link")
      .forEach((p) => p.classList.remove("dim"));
  }

  function showTooltip(stream, ev) {
    if (!stream || !ev) {
      tooltip.hidden = true;
      return;
    }
    const price = window.Rivers.getPrice();
    const amount = stream.share * price;
    tooltip.innerHTML = `
      <strong style="color:${stream.color}">${stream.label}</strong>
      <div>${fmt$(amount)} · ${Math.round(stream.share * 100)}%</div>
      <div style="color:#a9a49a;font-size:0.85rem">${stream.detail}</div>
    `;
    tooltip.hidden = false;
    const rect = wrap.getBoundingClientRect();
    const x = Math.min(ev.clientX - rect.left + 16, rect.width - 270);
    const y = Math.max(ev.clientY - rect.top - 20, 8);
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  function setPrice(p, animate = true) {
    priceOutput.textContent = fmt$(p);
    heroPrice.textContent = fmt$(p);
    window.Rivers.setPrice(p, animate);
    paintCards(p);
  }

  async function init() {
    try {
      dataset = await window.Rivers.load();
    } catch (err) {
      cardsEl.innerHTML = `<p>Could not load <code>data/breakdown.json</code>. Run a local server (e.g. <code>python3 -m http.server</code>) instead of opening the file directly.</p>`;
      console.error(err);
      return;
    }

    window.Rivers.onHover((stream, ev, visible) =>
      showTooltip(visible ? stream : null, ev)
    );

    setPrice(dataset.sale.amount, false);

    let t = null;
    priceInput.addEventListener("input", () => {
      const p = Number(priceInput.value);
      priceOutput.textContent = fmt$(p);
      heroPrice.textContent = fmt$(p);
      clearTimeout(t);
      t = setTimeout(() => setPrice(p, true), 90);
    });

    replayBtn.addEventListener("click", () => window.Rivers.replay());

    motionBtn.addEventListener("click", () => {
      driftOn = !driftOn;
      window.Rivers.setMotionOK(driftOn);
      if (window.Ambient) window.Ambient.setDrift(driftOn);
      motionBtn.textContent = driftOn ? "Pause drift" : "Resume drift";
      motionBtn.setAttribute("aria-pressed", String(!driftOn));
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      driftOn = false;
      window.Rivers.setMotionOK(false);
      motionBtn.textContent = "Resume drift";
    }
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
