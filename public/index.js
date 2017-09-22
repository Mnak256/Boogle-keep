var socket;

var animationTime = 150;
var toastShowTime = 3000;

if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x     or Firefox x.x (ignoring remaining digits);
    socket = new io.Socket({transports:['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
} else {
    socket = io();//for all browsers, other than Firefox.
}

$(window).load(function(){
    socket.emit('join', 'mainak ');
    socket.on('load', function (data) { //loop througn all the notes and load them in the html.
        for (var i = 0; i < data.length; i++) {
            //should use getNoteHtml()
            $('.notes-container').append(getNoteHtml(data[i].note, data[i].title));
        }
    });

    socket.on('reload', function (msg) {
        location.reload(true);//reload the index.html page when the server tells to reload.
    });

    $('#addNewNote-btn').on('click', function () {
        showModalWindow();
    });
    $('#newNote-modal').on('click', function (event) {
        if (event.target.id == 'newNote-modal') { //if clicked on anywhere other than the #newNote-modal-content, then hide the modal.
            hideModalWindow();
        }
    })

    $('#save-btn').on('click', function () { //take input from text fields -> run replaceHtmlTags() to get rid of html parsable content from user inputs and then, pass them to getNoteHtml() to get the html formatted text such that it can be appended to the .notes-container div of the document
        var note = $('#note-input').val();
        var title = $('#title-input').val();
        if (note.length == 0 || title.length == 0) { //if any of the inputs is blank, then hide the modal window and show the error toast.
            hideModalWindow();
            showToast('Invalid Inputs');
            return; //return, so that blank inputs do not get sent to the server, or appended to this page.
        }

        //show note locally.
        $('.notes-container').append(getNoteHtml(replaceHtmlTags(note), replaceHtmlTags(title)));

        //send note to server
        var noteObj = {
            'title': $('#title-input').val(),
            'note': $('#note-input').val()
        };
        socket.emit('message', noteObj);
        
        hideModalWindow();
    });

    $('body').on('click', '.delete-btn', function () {
        //send delete request to server.
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        //hide immediately from client side.
        $(this).parent().parent().css('display', 'none');
    });
});

//helper functions:
function getNoteHtml(note, title) {
    return '<div class="note"><div class="note-title">' + title + '</div><div class="note-text">' + note + '</div><div style="display:flex"><div class="btn edit-btn">Edit</div><div class="btn delete-btn">Delete</div></div></div>';
}

function hideModalWindow() {
    $('#newNote-modal-content').css('animation-name', 'modal-close-animation');
    setTimeout(function() {//timeout to complete the animation.
        $('#newNote-modal').css('display', 'none');//hiding the modal window.
    }, animationTime);
    $('#title-input').val('');
    $('#note-input').val('');
    $('body').css('overflow', 'auto');//making page scrollable again when modal window is closed.
}

function showModalWindow() {
    $('#newNote-modal-content').css('animation-name', 'modal-open-animation');
    $('#newNote-modal').css('display', 'block');//showing the modal window.
    $('body').css('overflow', 'hidden');//making page un-scrollable when modal window is open.
}

function showToast(msg) {
    $('#toast').html(msg);
    $('body').css('overflow', 'hidden');
    $('#toast').css('display', 'block');
    $('#toast').css('animation-name', 'toast-show-animation');
    setTimeout(function() {
        $('body').css('overflow', 'auto');
        $('#toast').css('display', 'none');
    }, toastShowTime);
}

function replaceHtmlTags(str) {
    str = str.replace(/&/g, '&amp');
    str = str.replace(/</g, '&lt');
    str = str.replace(/>/g, '&gt');
    return str;
}