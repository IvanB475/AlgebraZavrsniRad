

//make connection
var socket = io.connect('http://localhost:8000');

//buttons and inputs
var postlist = $("#postlist")
var send_message = $("#send_message")


console.log("here");

$(function(){

    send_message.click(function(){
        socket.emit("posts")
    })

//Listen on new_message
socket.on("posts", (data) => {
    console.log("ušao tu");
    postlist.prepend("<h5>" + data.post.username + "</h5> <textarea rows='5' cols='50' readonly>" + data.post.post + "</textarea>");
})


});




