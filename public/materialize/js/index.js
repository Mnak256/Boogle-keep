var darkTheme = false;
$(document).ready(function() {
    //required by materialize:
    $('#collapse-hamburger-btn').sideNav({
        menuWidth: 200
    });
    $('.collapsible').collapsible();
    $('#new-note-modal').modal();
    //receving all notes from the database.
    socket.emit('join', 'mainak ');
    socket.on('load', function (data) { //loop througn all the notes and load them in the html.
        var i;
        for (i = 0; i < data.length; i++) {
            $('.notes-container').prepend(getNoteHtml(data[i].id, data[i].title, data[i].note));
        }
    });
    //Click events:
    $('#save-btn').on('click', function(event) {
        var title = replaceHtmlTags($('#title-input').val());
        var note = replaceHtmlTags($('#note-input').val());
        if(title.length === 0 || note.length === 0) {
            Materialize.toast('Inputs cannot be empty', 2000);
            event.stopPropagation();
            return;
        }
        $('.notes-container').prepend(getNoteHtml(null, title, note));
        //send note to server
        var noteObj = {
            'title': $('#title-input').val(),
            'note': $('#note-input').val()
        };
        socket.emit('message', noteObj);
        $('#title-input').val('');
        $('#note-input').val('');
        Materialize.updateTextFields();//to make the labels fall back to their original palces.
    })
    $('#dark-theme-checkbox').on('change', function () {
        darkTheme = !darkTheme;
        nightMode(darkTheme);
    });
    $('body').on('click', '.delete-btn', function () {
        //send the id of the note to be deleted to the server.
        socket.emit('delete', $(this).parent().parent().parent().attr('id'));
        //hide immediately from client side.
        $(this).parent().parent().css('display', 'none');
    });
    //just after a note is sent to the server, the server will reply with an id.
    socket.on('id', function (id) {
        $('.note:first-child').attr('id', id);
    });
});
// helper functions
function nightMode(bool) {
    if (bool) {
        $('body').css('background-color', '#424242');
        $('.notes-container .note .card').css('background-color', 'grey');
        $('.notes-container .note .card').css('color', 'white');
        $('#slide-out').css('background-color', 'grey');
        $('.side-nav .collapsible-body').css('background-color', 'grey');
        $('#new-note-modal, #new-note-modal .modal-footer').css('background-color', 'grey');
        $('#new-note-modal .modal-content form .input-field label').css('color', 'white');
    } else {
        $('body').css('background-color', '#bdbdbd');
        $('.notes-container .note .card').css('background-color', 'white');
        $('.notes-container .note .card').css('color', 'black');
        $('#slide-out').css('background-color', 'white');
        $('.side-nav .collapsible-body').css('background-color', 'white');
        $('#new-note-modal, #new-note-modal .modal-footer').css('background-color', 'white');
        $('#new-note-modal .modal-content form .input-field label').css('color', 'black');
    }
}

function getNoteHtml(id, title, note) {
    var bgCol, txtCol;
    if (darkTheme) {
        bgCol = 'grey';
        txtCol = 'white';
    } else {
        bgCol = 'white';
        txtCol = 'black';
    }
    return '<div id="' + id + '" class="note col l3 m6 s12"><div class="card" style="background-color:' + bgCol + '; color:' + txtCol + ';"><div class="card-content"><div class="card-title">' + title + '</div><p>' + note + '</p><a href="#" class="btn-floating halfway-fab waves-effect waves-light grey darken-1"><i class="material-icons">edit</i></a><a href="#" class="delete-btn btn-floating halfway-fab waves-effect waves-light grey darken-1"><i class="material-icons">delete</i></a></div></div></div>';
}

function replaceHtmlTags(str) {
    str = str.replace(/&/g, '&amp');
    str = str.replace(/</g, '&lt');
    str = str.replace(/>/g, '&gt');
    return str;
}
