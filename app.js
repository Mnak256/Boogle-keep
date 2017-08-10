var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var expressWs = require('express-ws')(app);
app.use(express.static('public'));
var server = app.listen(8256);
const io = require('socket.io').listen(server);

var index = 0;//unique ID of each note, saved in the attribute 'index' of the wrapping div of each note.

io.on('connection', function (socket) {
    socket.on('join', function(data) {
        console.log(data + "join[server]");
    });

    socket.on('message', function(noteQuery) {
        var title = noteQuery.title;
        var msg = noteQuery.note;

        //making the user input as plain text, so that special characters are properly parsed.
        title = replaceHtmlTags(title);
        msg = replaceHtmlTags(msg);

        //updating public/notes.html with new note.
        fs.appendFile("public/notes.html", "<div index='" + index++ + "' class='col-md-3 col-sm-6 col-xs-12 top-mar-20'><h1 id='title'>" + title + "</h1><p id='note' class='text-justify'>" + msg + "</p><a class='btn btn-success btn-lg btn-block edit-btn'>Edit KEEP</a></div>\n", function (error) {
            if(error) {
                throw error;
            }
        });
    });
});

fs.watchFile('public/notes.html', { persistent: true, interval: 500 }, function (curr, prev) {
    io.sockets.emit('reload', 'from watchFile()');
    console.log("notes.html changed.");
});

/* helper functions - */

function replaceHtmlTags(str) {
    str = str.replace(/</g, "&lt");
    str = str.replace(/>/g, "&gt");
    str = str.replace(/&/g, '&amp');
    return str;
}
