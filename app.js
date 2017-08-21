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

io.on('connection', function (socket) {
    socket.on('join', function(data) { //on reload or new client join, pass the json file to that client to load it into the html.
        var noteJson = fs.readFileSync('public/notes.json');
        var jsonContent = JSON.parse(noteJson);
        socket.emit('load', jsonContent);
    });

    socket.on('message', function(noteObj) {
        var title = noteObj.title;
        var msg = noteObj.note;

        //making the user input as plain text, so that special characters are properly parsed.
        title = replaceHtmlTags(title);
        msg = replaceHtmlTags(msg);

        //making the json file.
        var noteJson = fs.readFileSync('public/notes.json');
        var jsonContent = JSON.parse(noteJson);
        jsonContent.push({"title": title, "note": msg});
        noteJson = JSON.stringify(jsonContent);

        //reload all clients.
        io.sockets.emit('reload');

        //updating public/notes.json with new note.
        fs.writeFile("public/notes.json", noteJson, function (error) {
            if(error) {
                throw error;
            }
        });
    });
});

/*  only for automatic webpage refresh when developing.

var i = 1;
fs.watchFile('public/index.html', { persistent: true, interval: 500 }, function (curr, prev) {
    io.sockets.emit('reload', 'from watchFile()');
    console.log(i++ + " : Refreshed.");
});
fs.watchFile('public/index.css', { persistent: true, interval: 500 }, function (curr, prev) {
    io.sockets.emit('reload', 'from watchFile()');
    console.log(i++ + " : Refreshed.");
});
fs.watchFile('public/index.js', { persistent: true, interval: 500 }, function (curr, prev) {
    io.sockets.emit('reload', 'from watchFile()');
    console.log(i++ + " : Refreshed.");
});
*/

/* helper functions - */

function replaceHtmlTags(str) {
    str = str.replace(/&/g, '&amp');
    str = str.replace(/</g, '&lt');
    str = str.replace(/>/g, '&gt');
    return str;
}
