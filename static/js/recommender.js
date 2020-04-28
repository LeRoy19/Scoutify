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




});

function tags_rec() {

}

function artists_rec() {

}

function played_rec() {

}