var socket;
if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x     or Firefox x.x (ignoring remaining digits);
    socket = new io.Socket({transports:['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
} else {
    socket = io();
}


$(window).load(function() {
    socket.on('edit', function(editObj) {
        $('#title-text').attr('value', editObj.title);
        alert(editObj.title);
    });
});

$(window).on('beforeunload', function(){
        socket.close();
});
