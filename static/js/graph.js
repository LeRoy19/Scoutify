
function render_graph(name) {
    $("#graphDiv").html(`<div class='spinner-grow'  style='color: #1DB954; margin-top: 40%;' role='status'>  <span class='sr-only'>Retrieving data...</span></div>
                                 <p>Please wait...</p>`);
    let diameter = 3;
    if(name===null){
        name = $("#art").val();
        diameter = $("#type").val();
    }
    $.ajax({
            type: 'GET',
            url: '/get_graph/',
            data: {
                "name": name,
                "diameter" : diameter,
            },
            dataType: 'json',
            success: function (result) {
                $("#artistCard").css("height", "60%");
                $("#player").attr("height", "80");

                $("#graphDiv").html("");
                drawArtistsGraph(result["links"], result["nodes"], name, result["id"]);
            },
            error: function (jqXHR) {
                showError(jqXHR);
            }
        });
}


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
    var width = $("#graphDiv").width();
    var height = $("#pane").height();


    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(70)
        .charge(-600)
        .on("tick", tick)
        .start();

    var svg = d3.select("#graphDiv").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "white");


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

function drawArtistsGraph(links, Nodes, name, id){
    let nodes = {};

    $("#artistsGraph").remove();

    links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, color: getRandomColor()});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, color: getRandomColor()});
    });

    var width = $("#graphDiv").width();
    var height = $("#pane").height();

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
        .attr("height", height);

    svg.append("text").attr("x", 10).attr("y", 10).text("Distances:")
        .style("font-size", "15px").style("fill", "white").attr("alignment-baseline","middle");
    svg.append("circle").attr("cx",20).attr("cy",30).attr("r", 6).style("fill", "red");
    svg.append("circle").attr("cx",20).attr("cy",60).attr("r", 6).style("fill", '#7CFC00');
    svg.append("circle").attr("cx",20).attr("cy",90).attr("r", 6).style("fill", '#32CD32');
    svg.append("circle").attr("cx",20).attr("cy",120).attr("r", 6).style("fill", '#228B22');
    svg.append("circle").attr("cx",20).attr("cy",150).attr("r", 6).style("fill", '#006400');
    svg.append("circle").attr("cx",20).attr("cy",180).attr("r", 6).style("fill", '#003319');
    svg.append("text").attr("x", 30).attr("y", 30).text("0").style("font-size", "15px")
        .style("fill", "white").attr("alignment-baseline","middle");
    svg.append("text").attr("x", 30).attr("y", 60).text("1").style("font-size", "15px")
        .style("fill", "white").attr("alignment-baseline","middle");
    svg.append("text").attr("x", 30).attr("y", 90).text("2").style("font-size", "15px")
        .style("fill", "white").attr("alignment-baseline","middle");
    svg.append("text").attr("x", 30).attr("y", 120).text("3").style("font-size", "15px")
        .style("fill", "white").attr("alignment-baseline","middle");
    svg.append("text").attr("x", 30).attr("y", 150).text("4").style("font-size", "15px")
        .style("fill", "white").attr("alignment-baseline","middle");
    svg.append("text").attr("x", 30).attr("y", 180).text("5").style("font-size", "15px")
        .style("fill", "white").attr("alignment-baseline","middle");

    var link = svg.selectAll(".link")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "white");

    /*var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);*/

    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .on("mouseover.tooltip", mouseover)
        .on("mouseover.fade", fade(0.1))
        .on("mouseout", mouseout)
        .on("mouseout.fade", fade(1))
        .on("mouseover", show_info)
        .style("fill", get_color)
        .call(force.drag);

    node.append("circle")
        .attr("r", 5);


    first_info(id);

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
    }


    function mouseout(d) {
        d3.select(this).select("text").style("opacity", 0);
        d3.select(this).select("circle").transition()
            .duration(100)
            .attr("r", 5);
        link.style('stroke', 'white');
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

    function get_color(d) {
        var path = Nodes[d.name].path;
        var color = ['#FF0000', '#7CFC00', '#32CD32', '#228B22', '#006400' , '#003319'];
        return color[path]
    }



    function show_info(d) {
        var img = Nodes[d.name].image;
        var name = Nodes[d.name].name
        var gen = ""
        var url = "open_on_spotify('https://open.spotify.com/artist/" + d.name + "');";
        Nodes[d.name].genres.forEach(element => gen += element + ", ");
        gen = gen.slice(0, -2);

        $("#image").attr("src",img);;
        $("#name").text(name);
        $("#genres").text(gen);
        $("#open").attr("onclick", url);

        artId = d.name;

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


    function first_info(id) {
        var img = Nodes[id].image;
        var name = Nodes[id].name
        var gen = ""
        var url = "https://open.spotify.com/artist/" + id;
        Nodes[id].genres.forEach(element => gen += element + ", ");
        gen = gen.slice(0, -2);

        $("#artistCard").html(
        `<img src= '`+ img +` ' class='rounded mx-auto d-block' alt='`+id+`' width='45%' id='image' style='margin-top: 3%;'>
                 <h5 style='color: #1DB954; margin-top: 3%;'>Name:&nbsp;</h5>
                 <h5 style='color: lightgrey' id='name'>`+name+`</h5>
                 <h5 style='color: #1DB954;'>Genres:&nbsp;</h5>
                 <h5 style='color: lightgrey' id='name'>`+gen+`</h5>
                 <button style="margin: 1%;" class="btn open" id='open' onclick="open_on_spotify('` + url +`')"><i class="fab fa-spotify"></i> Open on Spotify</button>`);


        $.ajax({
            type: 'GET',
            data: {'id' : id},
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



function open_on_spotify(url) {
    window.open(url,"_blank");
}

function showError(jqXHR) {
    $("#graphDiv").html("");
    $("#graphDiv").append("<div id='error'>");
    $("#error").append("<i class=\"far fa-7x fa-sad-tear\"></i>").css("text-align", "center").css("margin-top", "5%")
        .append("<h1>Error "+jqXHR.status+"...").append("<h1>Ops something goes wrong, please retry!");
}


