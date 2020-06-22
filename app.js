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
const Post = require('./models/post');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

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


const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },
  filename: function(req, file, cb) {
      cb(null, uuidv4())
  }
});

const fileFilter = (req, file, cb) => {
  if(
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jng' ||
      file.mimetype === 'image/jpeg'||
      file.mimetype === 'image/pdf'
  ) {
      cb(null, true);
  } else {
      cb(null, false);
  }
}


app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));


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
const io = require('./socket').init(server);
io.on('connection', socket => {
  socket.username = "Anonymous";


  socket.on('new_message', (data) => {
    io.sockets.emit('new_message', {message: data.message, username: socket.username});
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: socket.username, from: data.from});
  });

  socket.on('change_username', (data) => {
    socket.username = data.username;
  });

  socket.on("privateconn", (data) => {
    Room.find().all('members', [data.userid, data.senderid]).exec((err, room) => {
    if( room.length > 0) {
      socket.join(room[0].name);
      for(var i = 0; i < room[0].messages.length; i++) {
        socket.emit("private", { from: room[0].messages[i].sender, msg: room[0].messages[i].msg});
      }
    } else {
      const room = new Room({
        name: data.roomName,
        members: [ data.userid, data.senderid],
        messages: {sender: "Greeter", msg: "Welcome to chat"}
      })
      room.save().then(console.log("success"));
      socket.join(data.roomName);
    }   
  })
})

  socket.on("private", (data) => {
      Room.find().all('members', [data.userid, data.senderid]).exec((err, room) => {
        room[0].messages.push({sender: data.from, msg: data.msg})
        room[0].save();
        io.sockets.in(room[0].name).emit("private", { from: data.from, msg: data.msg});
    })
  })

  socket.on("roomsMsg", (data) => {
    console.log(data.roomName);
    socket.join(data.roomName);
      io.sockets.in(data.roomName).emit("roomsMsg", {from: data.from, msg: data.msg});
    })

    socket.on("comments", (data) => {
      const comment = {
        username: data.username,
        message: data.comment
      };
      Post.findById(data.postid).then((post) => {
           post.comments.push(comment);
          post.save();
      })
    io.emit('comments', { comment: comment, postid: data.postid});
    });
})


