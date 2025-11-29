let section = document.querySelector('section');
let secwid = section.clientWidth;
let sechei = section.clientHeight;
function drawtree(name, html, orient, translate, width, height) {
  var i = 0,
      duration = 750,
      root;

  var diagonal = d3.svg.diagonal()
      .projection(function(d) {
          return orient == 'horiz' ? [d.y, d.x] : [d.x, d.y];
      });

  var tree = d3.layout.tree()
      .size([width, height]);

  var svg = d3.select(html).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", translate);

  d3.json(name, function(error, flare) {
      if (error) throw error;

      root = flare;

      function collapse(d) {
          if (d.children) {
              d._children = d.children;
              d._children.forEach(collapse);
              d.children = null;
          }
      }
      root.children.forEach(collapse);
      update(root);
  });

  function update(source) {
      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

      // Adjust branch length
      nodes.forEach(function(d) { d.y = d.depth * 220; });

      // Dynamically adjust the SVG height for 'vert' trees
      if (orient === "vert") {
          let maxHeight = d3.max(nodes, d => d.y);
          d3.select(html).select("svg").attr("height", maxHeight + 100); // Add padding
      }

      // Update the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter new nodes
      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
              return orient === 'horiz' 
                  ? "translate(" + source.y0 + "," + source.x0 + ")" 
                  : "translate(" + source.x0 + "," + source.y0 + ")";
          })
          .on("click", click);

      nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);

      // Transition nodes to their new position
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) {
              return orient === 'horiz'
                  ? "translate(" + d.y + "," + d.x + ")"
                  : "translate(" + d.x + "," + d.y + ")";
          });

      nodeUpdate.select("circle")
          .attr("r", 6)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {
              return orient === 'horiz'
                  ? "translate(" + source.y + "," + source.x + ")"
                  : "translate(" + source.x + "," + source.y + ")";
          })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-1);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
              var o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
          });

      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition
      nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
      });
  }

  // Toggle children on click
  function click(d) {
      if (d.children) {
          d._children = d.children;
          d.children = null;
      } else {
          d.children = d._children;
          d._children = null;
      }
      update(d);
  }
}

