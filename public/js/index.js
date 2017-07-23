var socket;
if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x     or Firefox x.x (ignoring remaining digits);
    socket = new io.Socket({transports:['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
} else {
    socket = io();
}


function addNode(msg) {
    $("#notes-container").append("<div class='col-md-3 col-sm-6 col-xs-12 top-mar-20'><h1>Test</h1><p class='text-justify'>" + msg + "</p><a class='btn btn-success btn-lg btn-block' href='#'>Edit KEEP</a></div>");
}
$("#notes-container").load("notes.html");

$(window).load(function(){
    
    //socket.emit("join", 'msg');

    socket.on('reload', function (msg) {
        location.reload(true);//reload the index.html page
        //alert("reloaded  " + msg);
    });

    $(window).on('beforeunload', function(){
        socket.close();
    });

    
});

$(window).on('beforeunload', function(){
        socket.close();
});