$(document).ready(function (){
    $.get("./reusable html/bottom_nav.html", function (data) {
        $('#footer').html(data);
    });
    $.get("./reusable html/top_nav.html", function (data) {
        $('#header').html(data);
    });
})