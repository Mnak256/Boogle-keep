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

app.ws('/', function (ws, req) {
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
});

//fs.watchFile("/public/notes.html");

app.use(express.static('public'));

var server = app.listen(8256);
const io = require('socket.io').listen(server);


//server.listen(8256);


io.on('connection', function (socket) {
    socket.on('join', function(data) {
        console.log(data + "[server]");
        io.sockets.emit('reload', 'Hello from server');
    });
});