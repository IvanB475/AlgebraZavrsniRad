//make connection
var socket = io.connect("http://localhost:8080");

//buttons and inputs
var postlist = $("#postlist");
var send_message = $("#send_message");
var username = $("#username");
var userid = document.getElementById("userid").value;
var comment = $("#comment");
var postid = $("#postid");
var commentlist = $(".commentlist");
var sendcomment = $("#sendcomment");



document.addEventListener("DOMContentLoaded", function (event) {
  console.log("socket updated");
  console.log(userid);
  socket.emit("newConn", {
    userid: userid,
  });
});

$(function () {
  $(".selector").on("keyup click", function () {
    commentlist = $(this).find(".commentlist");
    comment = $(this).find("#comment");
    sendcomment = $(this).find("#sendcomment");
    postid = $(this).find("#postid").val();
    comment.on("keyup", (event) => {
      if (event.keyCode === 13) {
        sendcomment.click();
      }
    });
  });

  send_message.click(function () {
    socket.emit("privatePost");
  });

  //Listen on new_message
  socket.on("privatePost", (data) => {
    console.log("ušao tu");
    console.log(data.post.postid);
    postlist.prepend(
      '<div class="post" readonly>' +
       '<h5><img src="https://ptetutorials.com/images/user-profile.png" class="profile_img" width= "25px" height="25px"></img>' + data.post.username +
        "</h5> <hr>" +
        data.post.post +
        "</div>" +
        `<div class="selector"> <div class="commentlist" id="commentlist${data.postid}">
  
    </br>
    <selection>
        <input type="hidden" id="username" value='<%=currentUser.username %>'>
        <input type="hidden" name="_csrf" value='<%= csrfToken %>'>
        <input type="hidden" id="postid" value='${data.postid}'>
        <input type="text" id='comment'>
        <button id="sendcomment" type="submit" onclick="mySubmit()">Comment!</button> 
    </selection>
    </div>
</div>`
    );

    $(".selector").on("keyup click", function () {
      commentlist = $(this).find(".commentlist");
      comment = $(this).find("#comment");
      postid = $(this).find("#postid").val();
    });
  });

  socket.on("comments", (data) => {
    commentlist = "commentlist" + data.postid;
    commentlist = $(`#${commentlist}`);
    console.log(commentlist);
    commentlist.prepend(
      `<div class="comment">
      <em><img src="https://ptetutorials.com/images/user-profile.png" class="profile_img" width= "20px" height="20px"></img>${data.comment.username}</em>
       <span class="form-control-plaintext" readonly> ${data.comment.message} </span>
    </div>
       <em class="timeSince posted_on">Just now</em>
    </br>
    </br>`
  );
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

function mySubmit() {
  if (comment.val().length > 0) {
    socket.emit("comments", {
      username: username.val(),
      comment: comment.val(),
      postid: postid,
    });
    comment.val("");
  } else return;
}
