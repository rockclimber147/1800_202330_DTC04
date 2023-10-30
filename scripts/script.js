$(document).ready(function (){
    $.get("./reusable html/bottom_nav.html", function (data) {
        $('#footer').html(data);
    });
})