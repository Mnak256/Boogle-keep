var socket;

if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x     or Firefox x.x (ignoring remaining digits);
    socket = new io.Socket({transports:['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
} else {
    socket = io();//for all browsers, other than Firefox.
}

function addNode(msg) {//never used.
    $("#notes-container").append("<div class='col-md-3 col-sm-6 col-xs-12 top-mar-20'><h1>Test</h1><p class='text-justify'>" + msg + "</p><a class='btn btn-success btn-lg btn-block' href='#'>Edit KEEP</a></div>");
}



$(window).load(function(){
    $("#notes-container").load("notes.html");//always show content of public/notes.html file when this (public/index.html) page reloads.

    socket.on('reload', function (msg) {
        location.reload(true);//reload the index.html page
    });

    $(window).on('beforeunload', function(){//trying to fix on Firefox, not fixed as of now.
        socket.close();
    });
});
