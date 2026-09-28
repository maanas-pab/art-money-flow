/* rivers.js — D3 sankey flow-painting.
 * Renders one dataset (data/breakdown.json) as abstract rivers.
 * Exposes window.Rivers = { load, setPrice, replay, onHover }.
 */
(function () {
  "use strict";

  const SVG_ID = "#river";
  const W = 1000;
  const H = 540;

  let dataset = null;
  let price = 1000;
  let svg, linkG, nodeG, labelG;
  let sankeyGen;
  let currentGraph = null;
  let hoverCb = null;
  let motionOK = true;

  const fmt$ = (n) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  function buildSankey() {
    sankeyGen = d3
      .sankey()
      .nodeWidth(16)
      .nodePadding(16)
      .extent([
        [140, 24],
        [W - 220, H - 24],
      ])
      .nodeAlign(d3.sankeyCenter);
  }

  function toGraph() {
    const nodes = [
      { id: "sale", label: "Sale", color: "#f4f1ea", fixed: true },
      ...dataset.streams.map((s) => ({ id: s.id, label: s.label, color: s.color })),
    ];
    const links = dataset.streams.map((s, i) => ({
      source: 0,
      target: i + 1,
      value: Math.max(1, s.share * price),
      stream: s,
    }));
    return { nodes, links };
  }

  function ensureSvg() {
    svg = d3.select(SVG_ID).attr("viewBox", `0 0 ${W} ${H}`);
    svg.selectAll("*").remove();
    linkG = svg.append("g").attr("class", "links");
    nodeG = svg.append("g").attr("class", "nodes");
    labelG = svg.append("g").attr("class", "labels");
  }

  function pathOf(link) {
    return d3.sankeyLinkHorizontal()(link);
  }

  function render(animate = true) {
    const graph = toGraph();
    sankeyGen(graph);
    currentGraph = graph;

    // --- links (rivers) ---
    const links = linkG
      .selectAll("path")
      .data(graph.links, (d) => d.stream.id);

    links.join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "link")
          .attr("d", pathOf)
          .attr("stroke", (d) => d.stream.color)
          .attr("stroke-width", (d) => Math.max(1, d.width))
          .attr("data-id", (d) => d.stream.id)
          .style("opacity", 0)
          .call((sel) => {
            if (animate && motionOK) {
              sel
                .transition()
                .duration(900)
                .ease(d3.easeCubicOut)
                .style("opacity", 0.78);
            } else {
              sel.style("opacity", 0.78);
            }
          }),
      (update) =>
        update.call((sel) => {
          if (animate && motionOK) {
            sel
              .transition()
              .duration(700)
              .ease(d3.easeCubicInOut)
              .attr("d", pathOf)
              .attr("stroke-width", (d) => Math.max(1, d.width));
          } else {
            sel.attr("d", pathOf).attr("stroke-width", (d) => Math.max(1, d.width));
          }
        }),
      (exit) => exit.remove()
    );

    linkG
      .selectAll("path")
      .on("pointerenter", (ev, d) => highlight(d.stream.id, ev))
      .on("pointermove", (ev, d) => hoverMove(ev, d))
      .on("pointerleave", () => clearHighlight());

    // --- nodes ---
    const nodes = nodeG.selectAll("g").data(graph.nodes, (d) => d.id);
    const entered = nodes.join((enter) => {
      const g = enter.append("g").attr("class", "node");
      g.append("rect");
      return g;
    });

    nodeG
      .selectAll("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    nodeG
      .selectAll("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => Math.max(2, d.y1 - d.y0))
      .attr("fill", (d) => d.color || "#888");

    // --- labels ---
    const labels = labelG.selectAll("g").data(graph.nodes, (d) => d.id);
    const lg = labels.join((enter) => {
      const g = enter.append("g").attr("class", "label");
      g.append("text").attr("class", "name");
      g.append("text").attr("class", "value");
      return g;
    });

    lg.attr("transform", (d) => {
      const x = d.id === "sale" ? d.x0 - 12 : d.x1 + 10;
      const y = (d.y0 + d.y1) / 2;
      return `translate(${x},${y})`;
    });

    lg.select(".name")
      .text((d) => (d.id === "sale" ? `Sale · ${fmt$(price)}` : d.label))
      .attr("text-anchor", (d) => (d.id === "sale" ? "end" : "start"))
      .attr("dy", "-0.35em")
      .style("font-weight", 600);

    lg.select(".value")
      .text((d) => {
        if (d.id === "sale") return "the whole river";
        const s = dataset.streams.find((x) => x.id === d.id);
        return `${fmt$(s.share * price)} · ${Math.round(s.share * 100)}%`;
      })
      .attr("text-anchor", (d) => (d.id === "sale" ? "end" : "start"))
      .attr("dy", "1.1em")
      .style("fill", "#a9a49a")
      .style("font-size", "12px");

    // source node glow
    nodeG
      .selectAll("g")
      .filter((d) => d.id === "sale")
      .select("rect")
      .attr("fill", "#f4f1ea");
  }

  function highlight(id, ev) {
    linkG.selectAll("path").classed("dim", (d) => d.stream.id !== id);
    if (hoverCb) {
      const link = currentGraph.links.find((l) => l.stream.id === id);
      hoverCb(link ? link.stream : null, ev, true);
    }
  }

  function hoverMove(ev, d) {
    if (hoverCb) hoverCb(d.stream, ev, true);
  }

  function clearHighlight() {
    linkG.selectAll("path").classed("dim", false);
    if (hoverCb) hoverCb(null, null, false);
  }

  async function load(url = "data/breakdown.json") {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`could not load ${url}`);
    dataset = await res.json();
    price = dataset.sale.amount;
    buildSankey();
    ensureSvg();
    render(true);
    return dataset;
  }

  window.Rivers = {
    load,
    setPrice(p, animate = true) {
      price = p;
      if (dataset) render(animate);
    },
    replay() {
      render(true);
    },
    onHover(cb) {
      hoverCb = cb;
    },
    getData: () => dataset,
    getPrice: () => price,
    setMotionOK(v) {
      motionOK = v;
    },
  };
})();
