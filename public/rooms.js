

//make connection
var socket = io.connect('http://localhost:8000')

//buttons and inputs
var message = $("#message")
var send_message = $("#send_message")
var chatroom = $("#chatroom")
var feedback = $("#feedback")
var roomName = $("#roomName").val();
var sender = $("#sender").val();
var userid = document.getElementById("userid").value;

document.addEventListener("DOMContentLoaded", () => { 
    console.log("workd");
    socket.emit('roomsMsg', {from: 'Greeter', msg: sender + ' joined ' + ' chat room', roomName: roomName});
  });

  
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
    socket.emit('typing', { from: sender});
})

//Listen on typing
socket.on('typing', (data) => {
    feedback.html("<p><i>" + data.from + "  is typing a message..." + "</i></p>")
})
});




document.addEventListener("DOMContentLoaded", function (event) {
    console.log("socket updated");
    console.log(userid);
    socket.emit("newConn", {
      userid: userid,
    });
  });


  socket.on("callWindowOpened", async (data) => {
    console.log("window should open");
    console.log(socket.id);
    console.log(data.socket);
    window.open(
      "http://localhost:8000/call/" + data.user,
      "Test window",
      "height=7000,width=15000"
    );
  
    socket.emit("windowsOpened", {
      to: data.socket,
    });
  });


