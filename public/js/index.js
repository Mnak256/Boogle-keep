function addNode(msg) {
    $("#notes-container").append("<div class='col-md-3 col-sm-6 col-xs-12 top-mar-20'><h1>Test</h1><p class='text-justify'>" + msg + "</p><a class='btn btn-success btn-lg btn-block' href='#'>Edit KEEP</a></div>");
}
$("#notes-container").load("notes.html");