       var username = document.getElementById("username").value; 
       var sender = document.getElementById("sender").value;
       var senderid = document.getElementById("senderid").value;
       var userid = document.getElementById("userid").value;
       //make connection
       var socket = io.connect('http://localhost:8000', {query:`user=${username}`})

       //buttons and inputs
       var message = $("#message")
       var send_message = $("#send_message")
       var chatroom = $("#chatroom")
       var feedback = $("#feedback")
   console.log("hi sender" + senderid + "hi user" + userid);
      
   document.addEventListener("DOMContentLoaded", function(event) { 
    console.log("workd");
    socket.emit('privateconn', {userid: userid, senderid: senderid, roomName: makeid(8)})
  });

   $(function(){
       //Emit message
       send_message.click(function(){
           socket.emit("private", {msg: message.val(), from: sender, userid: userid, senderid: senderid, roomName: makeid(8)})
           feedback.html('');
           message.val('');
       })
   

       //Listen on new_message
       socket.on("private", (data) => {
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
           socket.emit('typing', { from: sender })
       })
   
       //Listen on typing
       socket.on('typing', (data) => {
           feedback.html("<p><i>" + data.from + " is typing a message..." + "</i></p>")
       })
   });
   
   


   function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
