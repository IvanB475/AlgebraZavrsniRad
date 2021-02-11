       var username = document.getElementById("username").value; 
       var sender = document.getElementById("sender").value;
       var senderid = document.getElementById("senderid").value;
       var usersocket = document.getElementById("usersocket").value;
       var userid = document.getElementById("userid").value;
       //make connection
       var socket = io.connect('http://localhost:8000', {query:`user=${username}`})

       //buttons and inputs
       var message = $("#message")
       var send_message = $("#send_message")
       var callFriend = document.getElementById("callFriend");
       var chatroom = $("#chatroom")
       var feedback = $("#feedback")
       const peerConnection = new RTCPeerConnection();
   console.log("hi sender" + senderid + "hi user" + userid);

      
   document.addEventListener("DOMContentLoaded", function(event) { 
    console.log("workd");
    socket.emit('privateconn', {userid: userid, senderid: senderid, roomName: makeid(8)})
  });

  callFriend.addEventListener("click", function() {
      callUser(usersocket);
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

   async function callUser(socketId) {
       console.log("offer sent");
       const offer = await peerConnection.createOffer();
       await peerConnection.setLocalDescription( new RTCSessionDescription(offer));

       socket.emit("call-user", {
           offer,
           to: socketId
       })
   }

   socket.on("call-made", async data => {
       await peerConnection.setRemoteDescription(
           new RTCSessionDescription(data.offer)
       );

       const answer = await peerConnection.createAnswer();
       await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

       socket.emit("make-answer", {
           answer,
           to: data.socket
       })
   });

   socket.on("answer-made", async data => {
       let isAlreadyCalling = false;
       await peerConnection.setRemoteDescription(
           new RTCSessionDescription(data.answer)
       );

       if(!isAlreadyCalling) {
           callUser(data.socket);
           isAlreadyCalling = true;
       }
   });


   navigator.getUserMedia(
       {video: true, audio: true },
       stream => {
           const localVideo = document.getElementById("local-video");
           if(localVideo) {
               localVideo.srcObject = stream;
           }

           stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
       },
       error => {
           console.log(error.message);
       }
   );

   peerConnection.ontrack = function({streams: [stream]}) {
       const remoteVideo = document.getElementById("remote-video");
       if(remoteVideo) {
           remoteVideo.srcObject = stream;
       }
   }
   

   


   function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
