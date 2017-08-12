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
        showModalWindow();
    });
    $('#newNote-modal').on('click', function (event) {
        if (event.target.id == 'newNote-modal') {
            hideModalWindow();
        }
    })

    $('#save-btn').on('click', function () {
        //take input from text fields -> run replaceHtmlTags() to get rid of html parsable content from user inputs and then, pass them to getNoteHtml() to get the html formatted text such that it can be appended to the .notes-container div of the document
        $('.notes-container').append(getNoteHtml(replaceHtmlTags($('#note-input').val()), replaceHtmlTags($('#title-input').val())));
        hideModalWindow();
    });
});

//helper functions:
function getNoteHtml(title, note) {
    return '<div class="note"><div class="note-title">' + title + '</div><div class="note-text">' + note + '</div></div>';
}

function hideModalWindow() {
    $('#newNote-modal').css('display', 'none');//hiding the modal window.
    $('#title-input').val('');
    $('#note-input').val('');
    $('body').css('overflow', 'auto');//making page scrollable again when modal window is closed.
}

function showModalWindow() {
    $('#newNote-modal').css('display', 'block');//showing the modal window.
    $('body').css('overflow', 'hidden');//making page un-scrollable when modal window is open.
}

function replaceHtmlTags(str) {
    str = str.replace(/&/g, '&amp');
    str = str.replace(/</g, '&lt');
    str = str.replace(/>/g, '&gt');
    return str;
}