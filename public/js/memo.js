var socket;

if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x     or Firefox x.x (ignoring remaining digits);
    socket = new io.Socket({transports:['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
} else {
    socket = io();//for all browsers, other than Firefox.
}

$(window).load(function() {
    $("#save-btn").on("click", function () {//get the title and note text and send it off via socket, when this save-btn is clicked.
        var noteQuery = {//a wrapper to store the title and the note text.
            title: document.getElementById("title-text").value,
            note: document.getElementById("note-text").value
        };
        socket.emit('message', noteQuery);
    });

    $(window).on('beforeunload', function(){//trying to fix on Firefox, not fixed as of now.
        socket.close();
    });
});
