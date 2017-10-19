$(document).ready(function() {
    $('.button-colapse').sideNav({
        menuWidth: 200
    });
    $('#new-note-modal').modal();
    $('#add-new-post-btn').on('click', function () {
        
    });
});

function addNewNote(title, content) {
    $('#posts-container').append('new note added!!!');
}
