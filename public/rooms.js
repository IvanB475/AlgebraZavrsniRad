

//make connection
var socket = io.connect('http://localhost:8000')

//buttons and inputs
var message = $("#message")
var send_message = $("#send_message")
var chatroom = $("#chatroom")
var feedback = $("#feedback")
var roomName = $("#roomName").val();
var sender = $("#sender").val();


$(function(){
//Emit message
send_message.click(function(){
    socket.emit('roomsMsg', { from: sender, msg : message.val(), roomName: roomName})
    feedback.html('');
    message.val('');
})

console.log(roomName);

//Listen on new_message
socket.on("roomsMsg", (data) => {
    feedback.html('');
    chatroom.append("<p class='message'>" + data.from + " -> " + data.msg +"</p>");
})

message.on('keyup', (event) => {
    if(event.keyCode === 13) {
        send_message.click();
    }
})

//Emit typing
message.on("keypress", () => {
    socket.emit('typing')
})

//Listen on typing
socket.on('typing', () => {
    feedback.html("<p><i>" + " Someone is typing a message..." + "</i></p>")
})
});




