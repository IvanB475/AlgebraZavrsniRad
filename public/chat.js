//make connection
var socket = io.connect("http://localhost:8080");

//buttons and inputs
var message = $("#message");
var username = $("#username");
var send_message = $("#send_message");
var send_username = $("#send_username");
var chatroom = $("#chatroom");
var feedback = $("#feedback");
var imageUrl = $("#imageUrl");
var color = $("#color");
var send_color = $("#send_color");
var userid = document.getElementById("userid")?.value;


document.addEventListener("DOMContentLoaded", function (event) {
  console.log("workd");
  socket.emit("change_username", { username: username.val() });
});

$(function () {
  //Emit message
  send_message.click(function () {
    socket.emit("new_message", {
      message: message.val(),
      imageUrl: imageUrl.val(),
    });
    message.val("");
  });

  message.on("keypress", () => {
    socket.emit("typing", { from: username.val() });
  });

  message.on("keyup", (event) => {
    if (event.keyCode === 13) {
      send_message.click();
    }
  });

  //Listen on new_message
  socket.on("new_message", (data) => {
    feedback.html("");
    chatroom.append(
      `<p style='color:${data.color}'>` +
        data.username +
        `<img src='${data.imageUrl}' alt='profileImg' width='30px' height='30px'>  : ` +
        data.message +
        "</p>"
    );
  });

  send_color.click(function () {
    socket.emit("change_color", { color: color.val() });
  })

  //Emit a username
  send_username.click(function () {
    socket.emit("change_username", { username: username.val() });
  });

  //Emit typing

  //Listen on typing
  socket.on("typing", (data) => {
    console.log("ušao tu");
    feedback.html(
      "<p><i>" + data.from + " is typing a message..." + "</i></p>"
    );
  });
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
      "http://localhost:8080/call/" + data.user,
      "Test window",
      "height=7000,width=15000"
    );
  
    socket.emit("windowsOpened", {
      to: data.socket,
    });
  });