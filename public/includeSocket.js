var socket = io.connect("http://localhost:8000");

var userid = document.getElementById("userid").value;


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