# FBClone
### Short story of how Final project became FBClone
Project started as final project for front-end developer education program at Algebra, requiring me to create a front-end application that enables real time communication using scaledrone API. 
I found myself craving for more of a challenge, so I went on to implement server for users to be able to register and login, and implemented the same chat (open chat for everyone) this time using socket.io library. That led to implementing special rooms (Algebra, Front-end, Back-end), which you could access only if you were registered to that specific room(s). Then that led to implementing option to add friends within the application, and ability to have private (1 on 1) chats with your friends. To keep the story shorter, one challenge after another, and now within application among other things you're able to create post in real time, check out friends posts( via their profile or newsfeed), comment on friends and your own posts ( in real time), and have a video call with your friends.

### Requirements:
- MongoDB installed
- NodeJS installed


### Start the project:
- Clone or download github repo
- Run npm install
- Start project with "node app.js" (app is available on port 8080)

### Tech stack:
- MEN
- Mongoose (ODM)
- Socket.io
- WebRTC
- Passport
- Joi



### Features for guest users:
- Chat
- Scaledrone chat


### Features for registered users:
- Registering to rooms
- Rooms
- Account profile
- Changing account visibility ( private/public )
- Adding/accepting friends
- Creating a post
- Commenting on post
- Seeing personal posts on personal profile
- Requesting new password
- Friend's profile page and friend's posts
- Personal chats with friends
- Video calls with friends
- Newsfeed

### Few notes about the project
- Frontend is purely for demonstration purposes of backend funcionality, it is not responsive and is intended for bigger (tested on 21.5 - 27 inch) monitors.
- Warning: do not enter sensitive data of any kind in preview application. 
