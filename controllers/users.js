const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const async = require("async");
const Post = require("../models/post");
const io = require("../socket");

require("../middleware/index")();

router.post("/signup", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    status: "user",
  });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.render("index/landing", { path: "index/landing", users: 0 });
      });
    }
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
  console.log("successfully logged you out");
});

router.post("/settings", isUser, async (req, res, next) => {
  let update;
  if ( req.file && !req.body.userPrivacy) { 
  update = { email: req.body.email, imageUrl: req.file.path };
  } else if( req.file && req.body.userPrivacy) {
    update = { email: req.body.email, imageUrl: req.file.path, privacy: req.body.userPrivacy}
  } else {
    update = { email: req.body.email, privacy: req.body.userPrivacy }
  }

  try {
    await User.findByIdAndUpdate(req.user._id, update);
    res.render("index/landing", { path: "/", users: 0 });
  } catch(e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
});

router.post("/resetpw", (req, res, next) => {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(32, (err, buf) => {
          let token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (!user) {
            console.log("error" + " No account with that email address exists");
            return res.redirect("/");
          }

          user.resetPasswordToken = token;

          user.resetPasswordExpires = Date.now() + 3600000;

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      (token, user, done) => {
        let smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAILUSER,
            pass: process.env.GMAILPW,
          },
        });
        let mailOptions = {
          to: user.email,
          from: process.env.GMAILUSER,
          subject: "Node.js Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/resetpw/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          console.log("mail sent");
          console.log(
            "success",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions."
          );
          done(err, "done");
        });
      },
    ],
    (err) => {
      if (err) return next(err);
      res.redirect("/");
    }
  );
});

router.post("/resetpw/:token", (req, res) => {
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          (err, user) => {
            if (!user) {
              console.log("nop");
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save((err) => {
                  req.logIn(user, function (err) {
                    done(err, user);
                  });
                });
              });
            } else {
              console.log("passwords don't match");
              return res.redirect("back");
            }
          }
        );
      },
      function (user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAILUSER,
            pass: process.env.GMAILPW,
          },
        });
        var mailOptions = {
          to: user.email,
          from: process.env.GMAILUSER,
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log("password has been changed!");
          done(err);
        });
      },
    ],
    function (err) {
      res.redirect("/");
    }
  );
});

router.post("/sendFriendReq", isUser, async (req, res) => {
  const friendId = req.body.wantedUserId;

  try {
    const friend = await User.findById(friendId);
    req.user.addToFriends(friend);
    res.render("users/myfriendlist", { users: 0, friends:17555, path: "users/myfriendlist" });
  } catch(e) {
    console.log(e);
  }

});



router.post("/handleFriend", (req, res, next) => {
  const friendId = req.body.handleFriendId;
  

  User.findById(friendId)
    .then((friend) => {
    switch(req.body.handleFriend) {
      case "Accept":
        return req.user.acceptFriend(friend);
      case "Decline":
        return req.user.declineFriend(friend);
      case "Block":
        return req.user.blockFriend(friend);
      case "Unfriend":
        return req.user.unfriendFriend(friend);
      default:
        res.write("<h1> Error occured </h1>");
    }
  })
    .then(() => {
      res.redirect("back");
    })
    .catch(() => {
      console.log("Failed");
    });
});

router.post("/room-register", isUser, (req, res) => {
  if (req.body.room === req.body.kod) {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        res.redirect("/");
      } else {
        user.rooms.push(req.body.room);
        user.save();
        res.render("index/room", { path: "index/room", name: req.body.room });
      }
    });
  } else {
    res.redirect("/");
  }
});

router.post("/room", isUser, (req, res) => {
  var room = req.body.room;
  User.findById(req.user._id, (err, user) => {
    if(err) {
      console.log(err);
    }
    else { 
      if( user.rooms.includes(room) ){
      res.render("index/room", { path: "index/room", name: req.body.room });
      }
      else {
        res.write("<h1>You are not authorized to enter this room</h1>");
      }
    }
  })
});

router.post("/newsfeed", isUser, (req, res) => {
  const post = new Post({
    author: req.user._id,
    username: req.user.username,
    post: req.body.newpost,
  });
  post.save();
  io.getIO().emit("posts", { post: post, postid: post._id });
});

router.post("/privatePost", (req, res) => {
  const post = new Post({
    author: req.user._id,
    username: req.user.username,
    post: req.body.newpost,
  });
  post.save();
  io.getIO().emit("privatePost", { post: post, postid: post._id });
  io.getIO().emit("posts", { post: post, postid: post._id });
  res.redirect('back');
});
module.exports = router;
