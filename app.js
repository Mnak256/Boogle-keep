var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.ws('/', function (ws, req) {
    ws.on("message", function(noteQuery) {
        var adr = "http://example.com/index.html" + noteQuery;
        var q = url.parse(adr, true);
        var query = q.query;
        var msg = query.note;
        var title = query.title;
        console.log(title + "[server]");
        fs.appendFile("public/notes.html", "<div class='col-md-3 col-sm-6 col-xs-12 top-mar-20'><h1>" + title + "</h1><p class='text-justify'>" + msg + "</p><a class='btn btn-success btn-lg btn-block' href='#'>Edit KEEP</a></div>\n", function (error) {
            if(error) {
                throw error;
            }
        });
    });
});
app.use(express.static('public'));
app.listen(8256);
