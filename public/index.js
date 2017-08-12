var socket;

if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x     or Firefox x.x (ignoring remaining digits);
    socket = new io.Socket({transports:['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
} else {
    socket = io();//for all browsers, other than Firefox.
}

$(window).load(function(){
    socket.on('reload', function (msg) {
        location.reload(true);//reload the index.html page
    });

    $('#addNewNote-btn').on('click', function () {
        $('#newNote-modal').css('display', 'block');//showing the modal window.
        $('body').css('overflow', 'hidden');//making page un-scrollable when modal window is open.
    });
    $('#newNote-modal').on('click', function (event) {
        if (event.target.id == 'newNote-modal') {
            $('#newNote-modal').css('display', 'none');//hiding the modal window.
            $('body').css('overflow', 'auto');//making page scrollable again when modal window is closed.
        }
    })
});
