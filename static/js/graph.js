function drawPresentation() {
    var nodes = {};
    var links = [
        {source: 1, target: 2},
        {source: 1, target: 3},
        {source: 1, target: 4},
        {source: 2, target: 4},
        {source: 2, target: 3},
        {source: 4, target: 3},
        {source: 4, target: 5},
        {source: 5, target: 6},
        {source: 7, target: 8},
        {source: 6, target: 7}];

    links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, color: getRandomColor()});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, color: getRandomColor()});
    });
    var mainW = $("#main").width();
    var width = mainW-(mainW*0.033);
    var height = 700;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(70)
        .charge(-600)
        .on("tick", tick)
        .start();

    var svg = d3.select("#main").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "border:3px solid #1DB954; margin: 1%; border-radius:10px; background-color: #d0d0d0;");

    var link = svg.selectAll(".link")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "#666");


    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .style("fill", function (d) {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
                return color; })
        .call(force.drag);

    node.append("circle")
        .attr("r", 7);


    function tick() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }

}

function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
}