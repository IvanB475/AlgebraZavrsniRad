

   	//make connection
	var socket = io.connect('http://localhost:8000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")

	document.addEventListener("DOMContentLoaded", function(event) { 
		console.log("workd");
		socket.emit('change_username', {username : username.val()})
	  });

$(function(){
	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
		message.val('');
	})


	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.on("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});


