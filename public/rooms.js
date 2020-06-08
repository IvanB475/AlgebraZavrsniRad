var roomName = document.getElementById("roomName").value; 
var sender = document.getElementById("sender").value;

//make connection
var socket = io.connect('http://localhost:8000')

//buttons and inputs
var message = $("#message")
var send_message = $("#send_message")
var chatroom = $("#chatroom")
var feedback = $("#feedback")


$(function(){
//Emit message
send_message.click(function(){
    socket.emit('roomsMsg', { from: sender, msg : message.val(), roomName: roomName})
})

console.log(roomName);

//Listen on new_message
socket.on("roomsMsg", (data) => {
    console.log("a tu");
    feedback.html('');
    message.val('');
    chatroom.append("<p class='message'>" + data.from + " -> " + data.msg +"</p>");
})


//Emit typing
message.on("keypress", () => {
    socket.emit('typing')
})

//Listen on typing
socket.on('typing', (data) => {
    feedback.html("<p><i>" + " Someone is typing a message..." + "</i></p>")
})
});




