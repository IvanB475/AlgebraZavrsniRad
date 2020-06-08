const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');
const path = require('path');
const Room = require('./models/room');


app.use(
  session({
    secret: "MYSECRET",
    resave: false,
    saveUninitialized: false,
  })
);

const usersRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");
const usersControllers = require("./controllers/users");


const csrfProtection = csrf();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrfProtection);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));


app.use(usersRoutes);
app.use(indexRoutes);
app.use(usersControllers);




mongoose.connect("mongodb://localhost:27017/zavrsnirad", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("success");
});

const server = app.listen(8000, console.log("server started"));
const io = require('socket.io')(server);
io.on('connection', socket => {
  socket.username = "Anonymous";


  socket.on('new_message', (data) => {
    console.log("blaa");
    io.sockets.emit('new_message', {message: data.message, username: socket.username});
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: socket.username});
  });

  socket.on('change_username', (data) => {
    socket.username = data.username;
  });

  socket.on("private", (data) => {
      Room.find().all('members', [data.userid, data.senderid]).exec((err, room) => {
        console.log(room.length);
      if( room.length > 0) {
        socket.join(room[0].name);
        io.sockets.in(room[0].name).emit("private", { from: data.from, msg: data.msg});
      } else {
        const room = new Room({
          name: data.roomName,
          members: [ data.userid, data.senderid]
        })
        room.save().then(console.log("success"));
        socket.join(data.roomName);
        io.sockets.in(data.roomName).emit("private", { from: data.from, msg: data.msg});
      }
      
    })
     
  })


})
