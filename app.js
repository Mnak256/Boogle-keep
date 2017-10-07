var express = require('express');
var mysql = require('mysql');
var app = express();
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var expressWs = require('express-ws')(app);
app.use(express.static('public'));
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
                console.log('SQL Error.');
                throw err;
            }
            for (var i = 0; i < rows.length; i++) {
                noteJson.push({'title': rows[i].title, 'note': rows[i].note});
            }
            socket.emit('load', noteJson);
            noteJson.length = 0;
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
        connection.query(sqlQuery, function (err) {
            if (err) {
                console.log('Query Error');
            }
        });
        /*connection.query('INSERT INTO notes (title, note) VALUES ("mainak", "dutta")', function (err, rows, fields) {
            if (err) {
                console.log('Query Error.');
            } else {
                console.log('Query Success.', rows);
            }
        });*/

        //recreating duplicate noteObj, such that specal characters are properly parsed in the new object.
        var noteObj_dup = {
            'title': title,
            'note': msg
        };
        //reload all clients.
        socket.broadcast.emit('reload', noteObj_dup);
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
