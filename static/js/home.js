
$(document).ready(function () {
    $("#rec").click(function(){
        window.open("http://localhost:8000/recommender/", "self");
    });

    $("#visualization").click(function(){
        window.open("http://localhost:8000/graph/", "self");
    });
    $("#explore").click(function(){
        window.open("http://localhost:8000/explore/", "self");
    });

});