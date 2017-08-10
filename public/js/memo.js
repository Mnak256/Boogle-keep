var socket;
if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x     or Firefox x.x (ignoring remaining digits);
    socket = new io.Socket({transports:['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
} else {
    socket = io();
}

$(window).load(function() {
    var button = document.getElementById("save-button");
    button.addEventListener("click", function () {
    sendMsg();
    //alert('ff');
    });
    
    $(window).on('beforeunload', function(){
        socket.close();
    });
});

$(window).on('beforeunload', function(){
        socket.close();
});

function sendMsg() {
    var title = document.getElementById("title-text").value;
    var note = document.getElementById("note-text").value;
    //var noteQuery = "?title=" + title.value + "&note=" + note.value;
    var noteQuery = {
        _title: title,
        _note: note
    };
    //alert(noteQuery._note);

    //socket.emit('message', noteQuery);
    //socket.on('connect', function () {
        //alert(noteQuery);
        socket.emit('message', noteQuery);
    //});
    //alert("outside" + noteQuery);
}