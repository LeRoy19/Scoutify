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

    $("#search").hover(function () {
        $("#searchIcon").css("color", "#1DB954");
        }, function(){
        $("#searchIcon").css("color", "white");
    }).click(function () {
        recommend_by_artists();
    });


});

function recommend_by_artists() {
    let artists = $("#art").val();
    let type = $("input[name='optradio']:checked").val();
    let array = artists.trim().split(",");

    $("#pane").append("<hr><div id='resultsDiv' class='row'>");
    //for i in results
    $("#resultsDiv").append("<div class='col-lg-3'>" +
                            "   <div class='card'>" +
                            "       <div class='card-header'>" +
        "                               <img src='...' alt='Artist image'>" +
                            "       </div>" +
                            "       <div class='card-body'>" +
        "                               <a href='#'>Nome: Tizio</a>" +
                            "       </div>" +
        "                           <div class='card-footer'><p>Somiglianza: 45%</p></div> " +
                            "</div>").append("<div class='col-lg-3'>" +
                            "   <div class='card'>" +
                            "       <div class='card-header'>" +
        "                               <img src='...' alt='Artist image'>" +
                            "       </div>" +
                            "       <div class='card-body'>" +
        "                               <a href='#'>Nome: Tizio</a>" +
                            "       </div>" +
        "                           <div class='card-footer'><p>Somiglianza: 45%</p></div> " +
                            "</div>");
    //chiamata ajax
}

function tags_rec() {

}

function artists_rec() {

}

function played_rec() {

}