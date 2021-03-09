var username = document.getElementById("username").value;
var sender = document.getElementById("sender").value;
var senderid = document.getElementById("senderid").value;
var usersocket = document.getElementById("usersocket").value;
var userid = document.getElementById("userid").value;
//make connection
var socket = io.connect("http://18.192.121.29:8080", { query: `user=${username}` });

//buttons and inputs
var message = $("#message");
var send_message = $("#send_message");
var callFriend = document.getElementById("callFriend");
var acceptButton = document.getElementById("acceptButton");
var chatroom = $("#chatroom");
var feedback = $("#feedback");
console.log("hi sender" + senderid + "hi user" + userid);
var friendSocket;
var iCalled = false;

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("workd");
  socket.emit("privateconn", {
    userid: userid,
    senderid: senderid,
    roomName: makeid(8),
  });
});

callFriend.addEventListener("click", function () {
  openCallWindow(usersocket);
});
$(function () {
  //Emit message
  send_message.click(function () {
    socket.emit("private", {
      msg: message.val(),
      from: sender,
      userid: userid,
      senderid: senderid,
      roomName: makeid(8),
    });
    feedback.html("");
    message.val("");
  });

  //Listen on new_message
  socket.on("private", (data) => {
    feedback.html("");
    chatroom.append(
      "<p class='message'>" + data.from + " -> " + data.msg + "</p>"
    );
  });

  message.on("keyup", (event) => {
    if (event.keyCode === 13) {
      send_message.click();
    }
  });

  //Emit typing
  message.on("keypress", () => {
    socket.emit("typing", { from: sender });
  });

  //Listen on typing
  socket.on("typing", (data) => {
    feedback.html(
      "<p><i>" + data.from + " is typing a message..." + "</i></p>"
    );
  });
});

async function openCallWindow(socketId) {
  console.log("offer sent");
  iCalled = true;
  window.open(
    "http://18.192.121.29:8080/call/" + userid,
    "Test window",
    "height=7000,width=15000"
  );

  socket.emit("openCallWindow", {
    to: socketId,
    user: userid,
    from: socket.id,
  });
}

socket.on("callWindowOpened", async (data) => {
  console.log("window should open");
  console.log(socket.id);
  console.log(data.socket);
  window.open(
    "http://18.192.121.29:8080/call/" + data.user,
    "Test window",
    "height=7000,width=15000"
  );

  socket.emit("windowsOpened", {
    to: data.socket,
  });
});

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
