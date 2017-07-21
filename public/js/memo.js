var ws = new WebSocket("ws://192.168.0.103:8256");


var button = document.getElementById("save-button");
button.addEventListener("click", function () {
    var title = document.getElementById("title-text");
    var note = document.getElementById("note-text");
    var noteQuery = "?title=" + title.value + "&note=" + note.value;
    
    

    ws.send(noteQuery);

    //update other clients -
    var socket = io("http://192.168.0.103:8256");
    socket.emit("join");
    //alert("join done");
});

ws.onmessage = function (event) {
    alert(event.data);
};
