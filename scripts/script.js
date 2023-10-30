$(document).ready(function (){
    // Load bottom navbar to page
    $.get("./reusable html/bottom_nav.html", function (data) {
        $('#footer').html(data);
    });
    // load top navbar to page
    $.get("./reusable html/top_nav.html", function (data) {
        $('#header').html(data);
    });
})