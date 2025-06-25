const svg = d3.select("svg");
const width = window.innerWidth;
const height = window.innerHeight;

const graph = {
  nodes: [
    { id: "Concept A" },
    { id: "Concept B" },
    { id: "Concept C" },
    { id: "Concept D" }
  ],
  links: [
    { source: "Concept A", target: "Concept B" },
    { source: "Concept A", target: "Concept C" },
    { source: "Concept B", target: "Concept D" }
  ]
};

// Setup zoom and pan
const zoom = d3.zoom()
  .scaleExtent([0.1, 2])
  .on("zoom", (event) => {
    container.attr("transform", event.transform);
  });

svg.call(zoom);

// Main container
const container = svg.append("g");

// Initialize simulation
const simulation = d3.forceSimulation(graph.nodes)
  .force("link", d3.forceLink(graph.links).id(d => d.id).distance(150))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));

// Add links
const link = container.append("g")
  .attr("stroke", "#aaa")
  .attr("stroke-width", 1.5)
  .selectAll("line")
  .data(graph.links)
  .join("line");

// Add nodes
const node = container.append("g")
  .selectAll("circle")
  .data(graph.nodes)
  .join("circle")
  .attr("r", 60)
  .attr("fill", "#69b3a2")
  .call(drag(simulation));

// Add labels
const label = container.append("g")
  .selectAll("text")
  .data(graph.nodes)
  .join("text")
  .text(d => d.id)
  .attr("text-anchor", "middle")
  .attr("dy", ".35em");

// Ticker
simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  label
    .attr("x", d => d.x)
    .attr("y", d => d.y);
});

// Dragging behavior
function drag(simulation) {
  let isDragging = false;
  return d3.drag()
    .on("start", (event, d) => {
      isDragging = true;
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      // Calculate delta movement
      const dx = event.dx;
      const dy = event.dy;

      // Move all nodes
      graph.nodes.forEach(n => {
        n.x += dx;
        n.y += dy;
      });

      // Manually update fixed node (so it doesn’t snap back)
      d.fx += dx;
      d.fy += dy;
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      isDragging = false;
    });
}
