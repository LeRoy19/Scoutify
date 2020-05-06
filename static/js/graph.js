$(document).ready(function () {
    $("#render").click(function () {
        var name = $("#art").val();
        var diameter = 3;
        $.ajax({
            type: 'GET',
            url: '/get_graph/',
            data: {
                "name": name,
                "diameter" : diameter,
            },
            dataType: 'json',
            success: function (result) {
                $("#graphDiv").html("").css("padding", "0");
                drawArtistsGraph(result["links"], result["nodes"], name);
            },
            error: function (jqXHR) {
                console.log("error");
            }
        });

    });


});


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

function drawArtistsGraph(links, Nodes, name){
    let nodes = {};

    $("#artistsGraph").remove();

    links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, color: getRandomColor()});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, color: getRandomColor()});
    });

    let width = $("#graphDiv").width()-3;
    let height = 500;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(20)
        .charge(-350)
        .on("tick", tick)
        .start();



    var svg = d3.select("#graphDiv").append("svg")
        .attr("id", "artistsGraph")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "border:1px solid black; border-radius:10px; border-color: #666666; background-color: #F2F3F4;");

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
        .on("mouseover.tooltip", mouseover)
        .on("mouseover.fade", fade(0.1))
        .on("mouseout", mouseout)
        .on("mouseout.fade", fade(1))
        .on("dblclick", redirect)
        .on("click", playTrack)
        .style("fill", getRandomColor)
        .call(force.drag);

    node.append("circle")
        .attr("r", 5);


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

    const linkedByIndex = {};
    links.forEach(d => {
        linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
    });

    function isConnected(a, b) {
        return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
    }


    function mouseover(d) {
        d3.select(this).select("circle").transition()
            .duration(100)
            .attr("r", 10);
        d3.select(this).style("show", "true");
        tooltip.transition()
        	.duration(100)
        	.style("opacity", 1);

        var img = Nodes[d.name].image;
        var name = Nodes[d.name].name
        var gen = ""
        Nodes[d.name].genres.forEach(element => gen += element + ", ");
        gen = gen.slice(0, -2);


        if ($("#ArtistSideBar").html() !== " "){
            $("#ArtistSideBar").html(
            "<img src= '"+ img +" ' class='rounded-circle mx-auto d-block' alt='"+d.name+"' width='70' id='image'>" +
                    "<h5 style='color: #1DB954; margin-top: 3%;'>Name:&nbsp;</h5>" +
                    "<h5 style='color: lightgrey' id='name'>"+name+"</h5>" +
                    "<h5 style='color: #1DB954;'>Genres:&nbsp;</h5>" +
                    "<h5 style='color: lightgrey' id='name'>"+gen+"</h5>");

        }else{
            $("#image").attr("src",img);;
            $("#name").text(name);
            $("#genres").text(gen);
        }


    }


    function mouseout() {
        tooltip.transition()
            .duration(100)
            .style("opacity", 0);
        d3.select(this).select("text").style("opacity", 0);
        d3.select(this).select("circle").transition()
            .duration(100)
            .attr("r", 5);
        link.style('stroke', '#666');
    }

    function fade(opacity) {
        return d => {
            node.style('stroke-opacity', function (o) {
                const thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

        };
    }

    function redirect(d) {
        window.open(Nodes[d.name].url);
        return false
    }

    function playTrack(d) {
        artId = d.name;
        console.log(artId);
        $.ajax({
            type: 'GET',
            data: {'id' : artId},
            url: '/get_last_album/',
            success: function (result) {
                $("#player").attr('src', result['url']);
            },
            error: function (jqXHR) {
                showError(jqXHR);
            }
        });

    }

}