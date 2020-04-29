$(document).ready(function () {
    $("#navBtn").click(function () {
        console.log('cliccato');
        if($(this).attr("opened") === "true"){

        }
        else{

        }
    });

});

function closeNav() {
    $("#sideNav").css("width", "0");
    $("#main").css("margin-right", "0");
    $("#navBtn").attr("opened","false");
}

function openNav() {
    $("#sideNav").css("width","25%");
    $("#main").css("margin-right", "25%");
    $("#navBtn").attr("opened","true");
}

