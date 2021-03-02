const peerConnection = new RTCPeerConnection();
const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");
var socket = io.connect("http://localhost:8000", { forceNew: false });
socket = window.opener.socket;
var friendSocket = window.opener.usersocket;
const iCalled = window.opener.iCalled;
var acceptButton = document.getElementById("acceptButton");
var endButton = document.getElementById("endButton");

document.addEventListener("DOMContentLoaded", function (event) {
  setTimeout(function () {
    console.log("worked");
    console.log(iCalled);
    if (iCalled) {
      console.log("SENT CALL OFFER");
      callUser(friendSocket);
    } else {
      console.log("page loaded");
    }
  }, 3000);
});

async function callUser(socketId) {
  console.log("offer sent");
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

  socket.emit("call-user", {
    offer,
    to: socketId,
  });
}

socket.on("call-made", async (data) => {
  console.log("received call offer");
  friendSocket = data.socket;
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );
});

socket.on("answer-made", async (data) => {
  let isAlreadyCalling = false;
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );

  if (!isAlreadyCalling) {
    callUser(data.socket);
    isAlreadyCalling = true;
  }
});

acceptButton.addEventListener("click", async () => {
  console.log("clicked button");
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

  socket.emit("make-answer", {
    answer,
    to: friendSocket,
  });
});

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    if (localVideo) {
      localVideo.srcObject = stream;
    }

    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));
  })
  .catch((err) => {
    console.log(err);
  });

peerConnection.ontrack = function ({ streams: [stream] }) {
  if (remoteVideo) {
    remoteVideo.srcObject = stream;
    remoteVideo.onloadedmetadata = function (e) {
      remoteVideo.play();
    };
  }
};
