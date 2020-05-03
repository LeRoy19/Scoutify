$(document).ready(function () {

    $("#findArtist").click(function () {
        closeNav();
        renderSearcher();
    });

    $("#recommender2").click(function () {
            showRecommenerOptions();
    })
    
});


function render_top_artists(client, country){
    dict = {
        'United Kingdom' : '37i9dQZEVXbLnolsZ8PSNw',
        'USA' :'37i9dQZEVXbLRQDuF5jeBp',
        'Italy' : '37i9dQZEVXbIQnj7RRhdSX',
        'Global' : '37i9dQZEVXbMDoHDwVN2tF',
        'Spain' : '37i9dQZEVXbNFJfN1Vw8d9',
        'Japan' : '37i9dQZEVXbKXQ4mDTEBXq',
        'Germany' : '37i9dQZEVXbJiZcmkrIHGU',
        'Australia' : '37i9dQZEVXbJPcfkRz0wJ0',
        'France' : '37i9dQZEVXbIPWwFssbupI',
        'Ireland' : '37i9dQZEVXbKM896FDX8L1',
        'Belgium' : '37i9dQZEVXbJNSeeHswcKB',
        'Canada' : '37i9dQZEVXbKj23U1GF4IR',
        'Portugal' : '37i9dQZEVXbKyJS56d1pgi',
        'Mexico' : '37i9dQZEVXbO3qyFxbkOE1'
    };
    let access_token = client['access_token'];
    let id = dict[country];
    $.ajax({
        type: 'GET',
        url: 'https://api.spotify.com/v1/playlists/'+ id,
        headers: { 'Authorization' : 'Bearer ' + access_token },
        success: function (result) {
            let artists = {}

            for (var i=0; i < result['tracks']['items'].length; i++){
                var name = result['tracks']['items'][i]['track']['artists'][0]['id'];
                if(name in artists){
                    artists[name] = artists[name] + 1
                }
                else {
                    artists[name] = 1
                }
            }
            var ret_val = []
            for (i=0; i < 12; i++){
                var keys   = Object.keys(artists);
                var highest = Math.max.apply(null, keys.map(function(x) { return artists[x]} ));
                var match  = keys.filter(function(y) { return artists[y] === highest });
                match.forEach(function (artist) {
                    ret_val.push(artist);
                    delete artists[artist];
                });
            }

            artists = ret_val.slice(0,12);
            $("#artistsDiv").html("");
            $("#TopArtists").text("Top Artists "+country);
            artists.forEach(function (artist) {
                $.ajax({
                    type: 'GET',
                    url: 'https://api.spotify.com/v1/artists/' + artist,
                    headers: {'Authorization': 'Bearer ' + access_token},
                    success: function (result) {
                        var name = result['name'];
                        var url = "https://open.spotify.com/artist/" + artist;
                        var image = result['images'][0]['url'];
                        var genres = '';
                        result['genres'].forEach(function (genre) {
                            genres += genre+', ';
                        });
                        genres = genres.substring(0, genres.length - 2);
                        var followers = result['followers']['total'];
                        var popularity = result['popularity'];
                        $("#artistsDiv").append(`<div class='col-lg-3'>
                                                    <div class="flip-card card" data-aos="zoom-in-up" data-aos-duration="1800">
                                                        <div class='flip-card-inner'>
                                                            <div class="flip-card-front">
                                                                <img class='card-img-top img-fluid' src='`+image+`' alt='Card image' artistId='`+artist+`'>
                                                                <div class='card-footer'>
                                                                    <h4 class='card-title'>`+name+`</h4>
                                                                </div>
                                                            </div>
                                                            <div class="flip-card-back">
                                                                  <h3 class='card-title' style="margin-top: 6%;">`+name+`</h3>
                                                                  <p>Followers: `+followers+`</p>
                                                                  <p>Popularity: `+popularity+`</p>
                                                                  <p>Genres: `+genres+`</p>
                                                                  <button style="margin-bottom: 6%;" class="btn open" onclick="change_album('` + artist +`',false)"><i class="fab fa-spotify"></i> Listen last album</button>
                                                                  <button class="btn open" onclick="open_on_spotify('` + url +`')"><i class="fab fa-spotify"></i> Open on Spotify</button>
                                                            </div>
                                                        
                                                        </div>
                                                    </div>
                                                    
                                                 </div>`);

                        $(".card-img-top").click(function () {
                            change_album($(this).attr('artistId'),false);
                        })
                    }, error: function (jqXHR) {
                        showError(jqXHR);
                    }
                });
                change_album(artists[0],true);

            });
        }, error: function (jqXHR) {
            location.reload();
        }
    });

}

function open_on_spotify(url) {
    window.open(url,"_blank");
}

function change_album(artist_id, first_time) {
        $.ajax({
            type: 'GET',
            data: {'id' : artist_id},
            url: '/get_last_album/',
            success: function (result) {
                $("#player").attr('src', result['url']);
                if(first_time === false){
                    window.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
                }
            },
            error: function (jqXHR) {
                showError(jqXHR);
            }
        });
}

function update_charts(country){

}

function showRecommenerOptions() {
    sidenav = $("#sideNav");
    let rec = $("#recommender2");
    if(rec.attr("opened") === "false"){
       sidenav.html(
        "<a id=\"findArtist\">Render graph</a>\n" +
        "<a id=\"recommender2\" opened='true'>Recommeder</a>\n" +
            "<a  id='tracksRec' style='text-indent: 1em; font-size: 1.5vw;'>Tracks based recommender</a>\n" +
            "<a  id='tagRec' style='text-indent: 1em; font-size: 1.5vw;'>Tags based recommender</a> \n" +
        "<a>Clients</a>\n" +
        "<a>Contact</a>");
    }
    else {
        sidenav.html(
            "<a id=\"findArtist\">Render graph</a>\n" +
            "<a id=\"recommender2\" opened='false'>Recommeder</a>\n" +
            "<a>Clients</a>\n" +
            "<a>Contact</a>");
    }


    $("#recommender2").click(function () {
        showRecommenerOptions();
    })

    $("#findArtist").click(function () {
        closeNav();
        d3.select("#artistsGraph").remove();
        renderSearcher();
    });

    $("#tracksRec").click(function () {
        closeNav();
        d3.select("#artistsGraph").remove();
        renderTrackRecommender();
    })

}

function renderTrackRecommender() {
    token = getToken();
    if(token != null){
        $("#pane").html(
            "<div class='card' style='width: 100%;'>" +
            "   <div class='card-header'>Tracks based Recommender</div>" +
            "   <div class='card-body' style='text-align: center;'>" +
                "<div class='spinner-grow' role='status' style='color: #1DB954'>"+
                "  <span class='sr-only'>Retrieving data...</span>"+
                "</div>" +
                "<p>Retrieving data...</p>"+
            "   </div> " +
            "   <div class='card-footer'> Leave a review</div> " +
            "</div>");
        recommend(token);
    }else{
        $("#pane").html(
            "<div class='card' style='width: 100%;'>" +
            "   <div class='card-header'>Tracks based Recommender</div>" +
            "   <div class='card-body' style='text-align: center;'>" +
            "    <h1>Not Logged!!!</h1>" +
            "    <h4>Please login with your Spotify account</h4>" +
            "    <button class='btn' id='login' style='background-color: #1DB954; color: #191414;' onclick='login();'>Login</button>" +
            "   </div> " +
            "   <div class='card-footer'> Leave a review </div> " +
            "</div>");
    }
}


function getToken() {
    const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
        window.location.hash = '';
    let _token = hash.access_token;
    if(_token){
        return _token;
    }
    else {
        return null;
    }
}

function recommend(token) {
    $.ajax({
        type: 'GET',
        url: '/track_recommender/',
        data : { 'token' : token },
        dataType: 'json',
        success: function (result) {
            $(".card-body").empty();
            if(result.suggested.length > 0){
                $(".card-body").append("<h4>Here is a list of suggested artists based on your latest plays</h4>")
                .append("<ul class='list-group' id='suggestedList'>").css("textAlign", "left");
                result.suggested.forEach(artist => $("#suggestedList").append("<li class=\"list-group-item\">"+artist['name']+"</li>"));
            }
            else {
                $(".card-body").append("<h4>Ops!! I haven't found any artists...</h4>").css("textAlign", "left");
            }
            }
            ,
        error: function (jqXHR) {
            showError(jqXHR);
        }
    });

}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function renderSearcher() {
    $("#pane").html("" +
        "<div class=\"input-group mb-3\">" +
        "  <div>" +
        "  <select class=\"custom-select\" id=\"type\">\n" +
        "    <option selected>Chose distance...</option>\n" +
        "    <option value='1'>1</option>\n" +
        "    <option value='2'>2</option>\n" +
        "    <option value='3'>3</option>\n" +
        "    <option value='4'>4</option>\n" +
        "    <option value='5'>5</option>\n" +
        "  </select>\n" +
        " </div>"+
        "  <input type='text' id='artist' class=\"form-control\" placeholder=\"Enter the artist's name\">" +
        "  <div class=\"input-group-append\">\n" +
        "    <button class=\"btn btn-outline-secondary\" id='render' type=\"button\"><i class=\"fas fa-search\"></i></i></button>\n" +
        "  </div>\n" +
        "</div>" +
        "<div id='container1' style='width: 100%; margin: 0; padding: 0;'>" +
        "   <div class='row' style='margin: 0'>" +
                "<div id='graphDiv'  class='col-lg-9' style='padding: 0;'></div>" +
                "<div id='ArtistSideContainer' class='col-lg-3' style='padding: 0; margin: 0;'></div>" +
            "</div> " +
        "</div>");

        $("#render").click(function () {
            name = $("#artist").val();
            diameter = $("#type").val();
            if(parseInt(diameter)){
                renderArtistsGraph(name,parseInt(diameter));
            } else
                console.log("error");
        })
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
    var mainW = $("#main").width();
    var width = mainW-(mainW*0.033);
    var height = 300;

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
        .attr("style", "border:1px solid black; margin: 1%; border-radius:10px; border-color: #666666; background-color: #F2F3F4;");

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


function renderArtistsGraph(name, diameter) {
    $("#graphDiv").css("height","500px").css("text-align", "center").css("padding-top", "15%").html(
        "<div class='spinner-grow'  style='color: #1DB954;' role='status'>" +
        "  <span class='sr-only'>Retrieving data...</span>" +
        "</div>" +
        "<p style='color: #1DB954'>Retrieving data..</p>" +
        "<h4>Please wait... It can take longer!</h4>")
    var csrftoken = getCookie('csrftoken');
    drawArtistSideBar();

    $.ajax({
        type: 'POST',
        url: '/graph/',
        data: {
            "name": name,
            "diameter" : diameter,
            "csrfmiddlewaretoken" : csrftoken,
        },
        dataType: 'json',
        success: function (result) {
            $("#graphDiv").html("").css("padding", "0");
            drawArtistsGraph(result["links"], result["nodes"], name);
        },
        error: function (jqXHR) {
            showError(jqXHR);
        }
    });
}

function showError(jqXHR) {
    $("#pane").html("");
    $("#pane").append("<div id='error'>");
    $("#error").append("<i class=\"far fa-7x fa-sad-tear\"></i>").css("text-align", "center").css("margin-top", "5%")
        .append("<h1>Error "+jqXHR.status+"...").append("<h1>Ops something goes wrong, please retry!");
}


function drawArtistSideBar() {
    $("#ArtistSideContainer").append("<div id='ArtistSideBar' class='card'>");
    $("#ArtistSideBar").css("background-color", "#191414").css("margin-left","3%").css("border-radius", "10px")
        .css("height", "100%").css("text-align","center").css("padding-top","10%");
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


        if ($("#ArtistSideBar").html() != " "){
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



