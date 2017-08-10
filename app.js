var express = require('express');
var app = express();
var http = require('http');

// var server = http.createServer(app);



var url = require('url');
var path = require('path');
var fs = require('fs');

var expressWs = require('express-ws')(app);


// app.get('/index.html', function (req, res) {
//     res.sendFile(path.join(__dirname, '/public', 'index.html'));
//     //console.log(req.get('referer'));
    
// });

/*app.ws('/', function (ws, req) {
    ws.on("message", function(noteQuery) {
        var adr = "http://example.com/index.html" + noteQuery;
        var q = url.parse(adr, true);
        var query = q.query;
        var msg = query.note;
        var title = query.title;
        //console.log(title + "[server]");
        fs.appendFile("public/notes.html", "<div class='col-md-3 col-sm-6 col-xs-12 top-mar-20'><h1>" + title + "</h1><p class='text-justify'>" + msg + "</p><a class='btn btn-success btn-lg btn-block' href='#'>Edit KEEP</a></div>\n", function (error) {
            if(error) {
                throw error;
            }
        });
    });
});*/

app.use(express.static('public'));

var server = app.listen(8256);
const io = require('socket.io').listen(server);


//server.listen(8256);

var index = 0;//unique ID of each note, saved in the attribute 'index' of the wrapping div of each note.

io.on('connection', function (socket) {
    //console.log("connection[server]");

    socket.on('join', function(data) {
        console.log(data + "join[server]");
        //io.sockets.emit('reload', 'from io.on()');
    });

    socket.on('message', function(noteQuery) {
        console.log("message got[server]");
        /*var adr = "http://example.com/index.html" + noteQuery;
        var q = url.parse(adr, true);
        var query = q.query;
        var msg = query.note;
        var title = query.title;
        title = replaceHtmlTags(title);
        msg = replaceHtmlTags(msg);*/

        var title = noteQuery._title;
        var msg = noteQuery._note;

        //making the user input as plain text, so that special characters are properly parsed.
        title = replaceHtmlTags(title);
        msg = replaceHtmlTags(msg);

        fs.appendFile("public/notes.html", "<div index='" + index++ + "' class='col-md-3 col-sm-6 col-xs-12 top-mar-20'><h1 id='title'>" + title + "</h1><p id='note' class='text-justify'>" + msg + "</p><a class='btn btn-success btn-lg btn-block edit-btn'>Edit KEEP</a></div>\n", function (error) {
            if(error) {
                throw error;
            }
        });
    });

    /*socket.on('edit', function (editObj) {
        io.sockets.emit('edit', editObj);
        
    });*/
});

fs.watchFile('public/notes.html', { persistent: true, interval: 500 }, function (curr, prev) {
    io.sockets.emit('reload', 'from watchFile()');
    console.log("notes.html changed.");
});

function replaceHtmlTags(str) {
    str = str.replace(/</g, "&lt");
    str = str.replace(/>/g, "&gt");
    str = str.replace(/&/g, '&amp');
    return str;
}