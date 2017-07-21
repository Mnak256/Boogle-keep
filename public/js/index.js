function addNode(msg) {
    $("#notes-container").append("<div class='col-md-3 col-sm-6 col-xs-12 top-mar-20'><h1>Test</h1><p class='text-justify'>" + msg + "</p><a class='btn btn-success btn-lg btn-block' href='#'>Edit KEEP</a></div>");
}
$("#notes-container").load("notes.html");

$(document).ready(function(){
    var socket = io("http://192.168.0.103:8256");
    socket.on('reload', function (msg) {
        location.reload(true);
        //alert("reloaded.");
        console.log("reloaded");
    });

    $(window).on('beforeunload', function(){
        socket.close();
    });
});

