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
                                                                  <button style="margin: 1%;" class="btn open" onclick="change_album('` + artist +`',false)"><i class="fab fa-spotify"></i> Listen last album</button>
                                                                  <button style="margin: 1%;" class="btn open" onclick="open_on_spotify('` + url +`')"><i class="fab fa-spotify"></i> Open on Spotify</button>
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




