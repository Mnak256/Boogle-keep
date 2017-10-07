var socket;

var animationTime = 150;
var toastShowTime = 3000;

if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x     or Firefox x.x (ignoring remaining digits);
    socket = new io.Socket({transports:['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
} else {
    socket = io();//for all browsers, other than Firefox.
}


//$('.note').innerHTML = "";
//console.log($('.note'));



$(window).load(function(){
    socket.emit('join', 'mainak ');
    socket.on('load', function (data) { //loop througn all the notes and load them in the html.
        var i;
        for (i = 0; i < data.length; i++) {
            $('.notes-container').prepend(getNoteHtml(data[i].note, data[i].title));
        }
    });

    socket.on('reload', function (noteObj) {
        $('html,body').scrollTop(0); //go to the top of this page such that the toast is visible.

        showToast('Other Cliend Updated.', 'rgb(68,114,167)');
        $('.notes-container').prepend(getNoteHtml(noteObj.note, noteObj.title));
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
            showToast('Invalid Inputs', 'rgb(195, 44, 44)');
            return; //return, so that blank inputs do not get sent to the server, or appended to this page.
        }

        //show note locally, in case server is unavailable.
        $('.notes-container').prepend(getNoteHtml(replaceHtmlTags(note), replaceHtmlTags(title))); //parsing user inputs properly before rendering them.

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

function showToast(msg, color) {
/*
error toasts and other client updated toasts are co-insiding. NOT FIXED.
*/

    $('#toast').html(msg);
    //$('body').css('overflow', 'hidden');
    $('#toast').css('display', 'block');
    $('#toast').css('background-color', color);
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