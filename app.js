const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require("express-session");
const csrf = require("csurf");
const path = require("path");
const Room = require("./models/room");
const Post = require("./models/post");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const { v4: uuidv4 } = require("uuid");
const joiSchema = require('./middleware/joiSchemas');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_CONN;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("success");
});

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
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jng" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

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
});

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, 
  max: 100
});

app.use(limiter);

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");

app.use(usersRoutes);
app.use(indexRoutes);
app.use(usersControllers);


const server = app.listen(8080, console.log("server started"));
const io = require("./socket").init(server);
io.on("connection", (socket) => {
  socket.username = "Anonymous";

  socket.on("new_message", (data) => {
    io.sockets.emit("new_message", {
      message: data.message,
      imageUrl: data.imageUrl,
      username: socket.username,
      color: socket.color,
    });
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", {
      username: socket.username,
      from: data.from,
    });
  });

  socket.on("change_username", (data) => {
          const { error } = joiSchema.changeUsername.validate(data);
          const valid = error == null;
  
          if(valid) {
            console.log("success");
              socket.username = data.username;
          } else {  
              console.log("that can't be done");
              socket.username = "wrong input";
          }
  });

  socket.on("change_color", (data) => {
    socket.color = data.color;
  });

  socket.on("newConn", (data) => {
    let update = { socket: socket.id, active: true };
    User.findByIdAndUpdate(data.userid, update, () => {
    });
  });

  socket.on("privateconn", (data) => {
    let update = { socket: socket.id, active: true };
    User.findByIdAndUpdate(data.senderid, update, () => {});
    Room.find()
      .all("members", [data.userid, data.senderid])
      .exec((err, room) => {
        if (room.length > 0) {
          socket.join(room[0].name);
          for (var i = 0; i < room[0].messages.length; i++) {
            socket.emit("private", {
              from: room[0].messages[i].sender,
              msg: room[0].messages[i].msg,
            });
          }
        } else {
          const room = new Room({
            name: data.roomName,
            members: [data.userid, data.senderid],
            messages: { sender: "Greeter", msg: "Welcome to chat" },
          });
          room.save().then(console.log("success"));
          socket.join(data.roomName);
        }
      });
  });

  socket.on("disconnect", () => {
    User.findOneAndUpdate(
      { socket: socket.id },
      { socket: "Non", active: false },
      () => {}
    );
  });

  socket.on("private", (data) => {
    Room.find()
      .all("members", [data.userid, data.senderid])
      .exec((err, room) => {
        room[0].messages.push({ sender: data.from, msg: data.msg });
        room[0].save();
        io.sockets
          .in(room[0].name)
          .emit("private", { from: data.from, msg: data.msg });
      });
  });

  socket.on("roomsMsg", (data) => {
    socket.join(data.roomName);
    io.sockets
      .in(data.roomName)
      .emit("roomsMsg", { from: data.from, msg: data.msg });
  });

  socket.on("call-user", (data) => {
    socket.to(data.to).emit("call-made", {
      offer: data.offer,
      socket: socket.id,
    });
  });

  socket.on("openCallWindow", (data) => {
    socket.to(data.to).emit("callWindowOpened", {
      socket: socket.id,
      user: data.user,
      from: data.from,
    });
  });

  socket.on("windowsOpened", (data) => {
    socket.to(data.to).emit("readyForCall", {
      socket: socket.id,
    });
  });

  socket.on("make-answer", (data) => {
    socket.to(data.to).emit("answer-made", {
      socket: socket.id,
      answer: data.answer,
    });
  });

  socket.on("endingCall", (data) => {
    socket.to(data.to).emit("callEnded", {
      socket: socket.id
    })
  })

  socket.on("comments", (data) => {
    const comment = {
      username: data.username,
      message: data.comment,
    };
    Post.findById(data.postid).then((post) => {
      post?.comments.push(comment);
      post?.save();
    });
    io.emit("comments", { comment: comment, postid: data.postid });
  });
});
