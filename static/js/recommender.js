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
    let array = artists.trim().split(",");

    $("#pane").append(`<hr><div id='resultsDiv' class='row'>`);
    //for i in results
    $("#resultsDiv").append(`<div class='col-lg-3'>   
                                <div class='card'>       
                                    <div class='card-header'>
                                        <img src='...' alt='Artist image'>
                                    </div>
                                    <div class='card-body'>
                                        <a href='#'>Nome: Tizio</a>
                                    </div>
                                    <div class='card-footer'><p>Somiglianza: 45%</p></div> </div>`).append(
                                    `<div class='col-lg-3'>
                                        <div class='card'>
                                            <div class='card-header'>
                                                <img src='...' alt='Artist image'>
                                            </div>" 
                                            <div class='card-body'>
                                                <a href='#'>Nome: Tizio</a>
                                            </div>
                                            <div class='card-footer'>
                                                <p>Somiglianza: 45%</p>
                                            </div> 
                                        </div>`);
    //chiamata ajax
}

function recommend_by_recently_played () {

}

function tags_rec() {
    $("#pane").html(`<h1 class="display-4">Inserisci una lista di tag separati da virgole</h1>
                            <input type="text" id="art" class="form-control">
                            <div class="row" style="margin: 1%;">
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio1">
                                    <input type="radio" class="form-check-input" id="radio1" name="optradio" value="1">Somiglianza scarsa
                                  </label>
                                </div>
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio2">
                                    <input type="radio" class="form-check-input" id="radio2" name="optradio" value="2" checked>Somiglianza media
                                  </label>
                                </div>
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio3">
                                    <input type="radio" class="form-check-input" id="radio3" name="optradio" value="3">Somiglianza forte
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
                            <div class="row" style="margin: 1%;">
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio1">
                                    <input type="radio" class="form-check-input" id="radio1" name="optradio" value="1">Somiglianza scarsa
                                  </label>
                                </div>
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio2">
                                    <input type="radio" class="form-check-input" id="radio2" name="optradio" value="2" checked>Somiglianza media
                                  </label>
                                </div>
                                <div class="form-check col-lg-4">
                                  <label class="form-check-label" for="radio3">
                                    <input type="radio" class="form-check-input" id="radio3" name="optradio" value="3">Somiglianza forte
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
        $("#pane").html(`<h1 class='display-4'>Login with your spotify account</h1>                       
                                <button class='btn' id='loginBtn'><i class="fab fa-spotify"></i> Login with spotify</button>`);
    }
    else {
        $("#pane").html( `<div class='spinner-grow'  style='color: #1DB954;' role='status'>  <span class='sr-only'>Retrieving data...</span></div>
                                 <p>Looking for recommendations...</p>`);
        /*ajax call to server with Token
        * display_recommendation(result);*/
        console.log(token);
         //$("#pane").html("<h1 class='display-4'>Recommendations based on your latest played tracks</h1>");
    }


    $("#loginBtn").click(function () {
        login();
    });
}

function recommend_by_tags() {

}

function display_recommendations(recommendations) {

}