
//make connection
var socket = io.connect('http://localhost:8000');

//buttons and inputs
var postlist = $("#postlist")
var send_message = $("#send_message")
var username = $("#username")
var comment = $("#comment")
var postid = $("#postid")
var commentlist = $(".commentlist")



$(function(){

    $(".selector").on('keyup click', function () {
        commentlist = $(this).find(".commentlist");
        comment = $(this).find("#comment")
        postid = $(this).find("#postid").val();
    })
    send_message.click(function(){
        socket.emit("posts")
    })

//Listen on new_message
socket.on("posts", (data) => {
    console.log("ušao tu");
    console.log(data.post.postid);
    postlist.prepend("<h5>" + data.post.username + "</h5> <textarea rows='5' cols='50' readonly>" + data.post.post + "</textarea>" + 
    `<div class="selector"> <div class="commentlist" id="commentlist${data.postid}">
    </div>
    </br>
    <selection>
        <input type="hidden" id="username" value='<%=currentUser.username %>'>
        <input type="hidden" name="_csrf" value='<%= csrfToken %>'>
        <input type="hidden" id="postid" value='${data.postid}'>
        <input type="text" id='comment'>
        <button id="sendcomment${data.postid}" type="submit" onclick="mySubmit()">Comment!</button> 
    </selection>
</div>`);

$(".selector").on('keyup click', function () {
    commentlist = $(this).find(".commentlist");
    comment = $(this).find("#comment")
    postid = $(this).find("#postid").val();
})
})

socket.on("comments", (data) => {
    commentlist = "commentlist" + data.postid;
    commentlist = $(`#${commentlist}`);
    console.log(commentlist);
    commentlist.append("<em>" + data.comment.username + "</em>" + `<input type='text' value= "${data.comment.message}" + readonly></br>`);
})


});


function mySubmit() {
    socket.emit("comments", {username: username.val(), comment: comment.val(), postid: postid});
    comment.val("");

}

 




