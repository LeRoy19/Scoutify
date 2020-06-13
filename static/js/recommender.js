$(document).ready(function () {

    $(".boxes-img").click(function () {
        if($(this).attr("active") !== "true"){
            $(".img-active").removeClass('img-active').attr("active", "false");
            $(this).attr("active", "true");
            $(this).addClass("img-active")
        }
    });

    $("#artists").click(function () {
        $("#p1").css("font-weight", "normal");
        $("#p2").css("font-weight", "bold");
        $("#p3").css("font-weight", "normal");
        artists_rec()

    });

    $("#played").click(function () {
        $("#p1").css("font-weight", "bold");
        $("#p2").css("font-weight", "normal");
        $("#p3").css("font-weight", "normal");
        played_rec()
    });

    $("#tags").click(function () {
        $("#p1").css("font-weight", "normal");
        $("#p2").css("font-weight", "normal");
        $("#p3").css("font-weight", "bold");
        tags_rec()
    });

    $("#loginBtn").click(function () {
        login();
    });


});

function recommend_by_artists() {
    let artists = $("#art").val();
    let type = $("input[name='optradio']:checked").val();


    $("#pane").html( `<div class='spinner-grow'  style='color: #1DB954; margin-top: 5%;' role='status'>  <span class='sr-only'>Sto cercando...</span></div>
                                 <p>Sto cercando...</p>`);

    $.ajax({
        type: 'GET',
        url: "../art_recommender/",
        data: ({'artists' : artists,
                'accuracy' : type}),
        success : function (result) {
            display_recommendations(result, result['searched']);

        }, error: function (jqXHR) {
            showError(jqXHR);
        }
    })
}

function recommend_by_recently_played (token) {
    $.ajax({
        type: 'GET',
        url: '../track_recommender/',
        data: {'token' : token},
        success: function (result) {
            display_recommendations(result, "last played");
        }, error: function (jqXhr) {
            showError(jqXHR);
        }
    })

}

function recommend_by_tags() {
    let tags = $("#in_tags").val();
    console.log(tags);
    let type = $("input[name='optradio']:checked").val();


    $("#pane").html( `<div class='spinner-grow'  style='color: #1DB954; margin-top: 5%;' role='status'>  <span class='sr-only'>Sto cercando...</span></div>
                                 <p>Sto cercando...</p>`);

    $.ajax({
        type: 'GET',
        url: "../tags_recommender/",
        data: ({'tags' : tags,
                'accuracy' : type}),
        success : function (result) {
            console.log(result['recommendations']);
            display_recommendations(result, result['searched']);

        }, error: function (jqXHR) {
            showError(jqXHR);
        }
    })
}

function tags_rec() {
    $("#pane").html(`<h1 class="display-4">Inserisci una lista di tag separati da virgole</h1>
                            <input type="text" id="in_tags" class="form-control">
                            <small id="Help" class="form-text" style="color: white; text-align: left;">Es: Hip-Hop, Pop, Rap &nbsp;&nbsp;&nbsp;  Suggeriamo di inserire almeno 10-15 tags!</small>
                            <div class="row" style="margin: 1%;">
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio1">
                                    <input type="radio" class="form-check-input" id="radio1" name="optradio" value="0.1">Somiglianza scarsa
                                  </label>
                                </div>
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio2">
                                    <input type="radio" class="form-check-input" id="radio2" name="optradio" value="0.2" checked>Somiglianza media
                                  </label>
                                </div>
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio3">
                                    <input type="radio" class="form-check-input" id="radio3" name="optradio" value="0.3">Somiglianza forte
                                  </label>
                                </div>
                            </div>
                            <button id="search" class="btn btn-lg" ><i id="searchIcon" class="fas fa-2x fa-search"></i></button>`);

    $("#search").hover(function () {
        $("#searchIcon").css("color", "#1DB954");
        }, function(){
        $("#searchIcon").css("color", "white");
    }).click(function () {
        recommend_by_tags();
    });
}

function artists_rec() {
    $("#pane").html(`<h1 class="display-4">Inserisci una lista di artisti separati da virgole</h1>
                            
                            <input type="text" id="art" class="form-control">
                            <small id="Help" class="form-text" style="color: white; text-align: left;">Es: Ed Sheeran, Rihanna, Shakira</small>
                            <div class="row" style="margin: 1%;">
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio1">
                                    <input type="radio" class="form-check-input" id="radio1" name="optradio" value="0.1">Somiglianza scarsa
                                  </label>
                                </div>
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio2">
                                    <input type="radio" class="form-check-input" id="radio2" name="optradio" value="0.2" checked>Somiglianza media
                                  </label>
                                </div>
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio3">
                                    <input type="radio" class="form-check-input" id="radio3" name="optradio" value="0.3">Somiglianza forte
                                  </label>
                                </div>
                            </div>
                            <button id="search" class="btn btn-lg" ><i id="searchIcon" class="fas fa-2x fa-search"></i></button>`);

    $("#search").hover(function () {
        $("#searchIcon").css("color", "#1DB954");
        }, function(){
        $("#searchIcon").css("color", "white");
    }).click(function () {
        recommend_by_artists();
    });
}

function login() {
    if(getToken() == null){
        const authEndpoint = 'https://accounts.spotify.com/authorize';
        const clientId = '8dceec3b5bec4d618979142ee304feb9';
        const redirectUri = 'http://localhost:8000/recommender';
        const scopes = ['user-read-recently-played'];

        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    }
}

function getToken() {
    const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
          if (item) {
            let parts = item.split('=');
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

function played_rec() {
    let token = getToken();
    if(token == null){
        $("#pane").html(`<h1 class='display-4'>Effettua il login con il tuo account Spotify!</h1>                       
                                <button class='btn' id='loginBtn'><i class="fab fa-spotify"></i> Login with spotify</button>`);
    }
    else {
        $("#pane").html( `<div class='spinner-grow'  style='color: #1DB954; margin-top: 2%;' role='status'>  <span class='sr-only'>Sto cercando...</span></div>
                                 <p>Sto cercando...</p>`);
        recommend_by_recently_played(token);
    }


    $("#loginBtn").click(function () {
        login();
    });
}


function display_recommendations(result, searched) {

    let artists = "";
    if (searched === "last played"){
        artists = "your last played tracks";
    }
    else {
        searched.forEach(function (artist) {
            artists += artist + ", "
        });
        artists = artists.substr(0, artists.length - 2);
    }


    if(result['recommendations'][0]['similarity'] !== -1){
                $("#pane").html("").append(`<hr><h4 class="display-4" style="color: white; font-size: 3rem">Raccomandazioni basate su `
                +artists +`</h4><div id='resultsDiv' class='row'></div>`);

                result['recommendations'].forEach(function (artist) {
                    if(artist['similarity'] !== -1){
                        $("#resultsDiv").append(`<div class='col-lg-2'>
                                                    <div class="flip-card card">
                                                        <div class='flip-card-inner'>
                                                            <div class="flip-card-front">
                                                                <img class='card-img-top img-fluid' src='`+artist['image']+`' alt='Image not found!' 
                                                                    artistId='`+artist['_id']+`'>
                                                                <div class='card-footer'>
                                                                    <h5 class='card-title'>`+artist['name']+`</h5>
                                                                </div>
                                                            </div>
                                                            <div class="flip-card-back">
                                                                  <h3 class='card-title' style="margin-top: 6%;">`+artist['name']+`</h3>
                                                                  <button style="margin: 3%; " class="btn open" onclick="see_graph('`+artist['name'] +`')"><i class="fab fa-spotify"></i> Genera il suo grafo</button>
                                                                  <button style="margin: 3% 1% 1%;" class="btn open" onclick="open_on_spotify('` + artist['url'] +`')"><i class="fab fa-spotify"></i> Apri su Spotify</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`);
                    }
                });
            }
            else{
                $("#pane").html("").append(`<hr><div id='resultsDiv' class='row' style="margin: 2% 0 0;">
                                                            <h4 class="display-4">Non ho trovato nulla che fa al caso tuo, prova a dimunure il grado di 
                                                            somiglianza o a cambiare lista di artisti</h4>`);
            }
}

function open_on_spotify(url) {
    window.open(url,"_blank");
}

function see_graph(artist) {
    window.open("/graph/?artist=" + artist);
}