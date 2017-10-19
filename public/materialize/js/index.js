$(document).ready(function() {
    var darkTheme = false;

    $('#collapse-hamburger-btn').sideNav({
        menuWidth: 200
    });
    $('.collapsible').collapsible();
    $('#new-note-modal').modal();
    $('#add-new-post-btn').on('click', function () {

    });
    $('.toggle-btn div').on('click', function (event) { //control the click effects on clicking the dark theme toggle button in settings.
        $('#feedback').css('display', 'block');
        $('#feedback').css('opacity', '0');
        $('#feedback').css('top', event.clientY - 20);
        $('#feedback').css('left', event.clientX - 20);
        $('#feedback').css('animation-name', 'feedback-anim');
        setTimeout(function () {
            $('#feedback').css('display', 'none');
            $('#feedback').css('opacity', '1');
        }, 200);
        if (darkTheme) {
            $('.toggle-btn div').css('background-color', 'rgb(167, 167, 167)');
            $('.toggle-btn div div').css('left', '-12px');
            $('.toggle-btn div div').css('transform', 'scale(1, 1)');
            $('.toggle-btn div div').css('background-color', 'rgba(128, 128, 128, 0.7)');
            
        } else {
            $('.toggle-btn div').css('background-color', 'rgb(120, 120, 120)');
            $('.toggle-btn div div').css('left', '11px');
            $('.toggle-btn div div').css('transform', 'scale(1.2, 1.2)');
            $('.toggle-btn div div').css('background-color', 'rgba(80, 80, 80, 0.9)');
        }
        darkTheme = !darkTheme;
        event.stopPropagation();
    })
});

function addNewNote(title, content) {
    $('#posts-container').append('new note added!!!');
}
