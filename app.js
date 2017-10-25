var express = require('express');
var mysql = require('mysql');
var app = express();
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var expressWs = require('express-ws')(app);
// app.use(express.static('public'));
app.use(express.static('public/materialize', {index: 'login.html'}));
var server = app.listen(8256);
const io = require('socket.io').listen(server);

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Override',
    database: 'booglekeep'
});
connection.connect();

var noteJson = [];

io.on('connection', function (socket) {
    socket.on('join', function(data) { //on reload or new client join, make an object array(noteJson) with all the notes and pass it to the client.
        let sqlQuery = 'SELECT * FROM notes';
        connection.query(sqlQuery, function (err, rows, fields) {
            if (err) {
                console.log('SQL Error while loading the notes');
                throw err;
            }
            for (var i = 0; i < rows.length; i++) {
                noteJson.push({'id': rows[i].ID, 'title': rows[i].title, 'note': rows[i].note});
            }
            socket.emit('load', noteJson);
            noteJson.length = 0;//clearing the noteJson object so that other clients or same client refreshes do not get repeated items.
        });
    });

    socket.on('message', function(noteObj) {
        var title = noteObj.title;
        var msg = noteObj.note;

        //making the user input as plain text, so that special characters are properly parsed.
        title = replaceHtmlTags(title);
        msg = replaceHtmlTags(msg);

        //storing to DB.
        let sqlQuery = 'INSERT INTO notes (title, note) VALUES ("' + title + '", "' + msg + '")';
        connection.query(sqlQuery, function (err, result) {
            if (err) {
                console.log('Query Error while adding new note');
            }
            //recreating duplicate noteObj, such that specal characters are properly parsed in the new object.
            var noteObj_dup = {
                'id': result.insertId,
                'title': title,
                'note': msg
            };
            //update all clients, except the sender of the note.(sender's update is being handled by the sender itself)
            socket.broadcast.emit('reload', noteObj_dup);
            //send the note ID to the sender only.
            socket.emit('id', noteObj_dup.id);
        });
    });

    socket.on('delete', function(noteId) {
        let sqlQuery = 'DELETE FROM notes WHERE ID = ' + noteId;
        connection.query(sqlQuery, function (err) {
            if (err) {
                console.log('Query Error while deleting note with ID = ' + noteId);
            }
            //update all clients, except the sender of the note.(sender's update is being handled by the sender itself)
            socket.broadcast.emit('reload', noteId);
        });
    });
});

//   only for automatic webpage refresh when developing.

var i = 1;
fs.watchFile('public/materialize/index.html', { persistent: true, interval: 500 }, function (curr, prev) {
    io.sockets.emit('reload', 'from watchFile()');
    console.log(i++ + " : Refreshed.");
});
fs.watchFile('public/materialize/css/index.css', { persistent: true, interval: 500 }, function (curr, prev) {
    io.sockets.emit('reload', 'from watchFile()');
    console.log(i++ + " : Refreshed.");
});
fs.watchFile('public/materialize/js/index.js', { persistent: true, interval: 500 }, function (curr, prev) {
    io.sockets.emit('reload', 'from watchFile()');
    console.log(i++ + " : Refreshed.");
});


/* helper functions - */

function replaceHtmlTags(str) {
    str = str.replace(/&/g, '&amp');
    str = str.replace(/</g, '&lt');
    str = str.replace(/>/g, '&gt');
    return str;
}
