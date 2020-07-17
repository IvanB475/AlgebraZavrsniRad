const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");

require("../middleware/index")();

router.get("/signup", (req, res) => {
  res.render("users/signup", { path: "users/signup" });
});

router.get("/login", (req, res) => {
  res.render("users/login", { path: "users/login" });
});

router.get("/settings", isUser, (req, res) => {
  Post.find({ author: req.user._id }).then((allPosts) => {
    res.render("users/settings", {
      posts: allPosts,
      path: "users/settings",
    });
  });
});

router.get("/resetpw", (req, res) => {
  res.render("users/resetpw", { path: "users/resetpw" });
});

router.get("/resetpw/:token", (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    (err, user) => {
      if (!user) {
        console.log("Reset token is invalid");
        return res.redirect("/");
      }
      res.render("users/setnewpw", { token: req.params.token });
    }
  );
});

router.get("/findusers", isUser, (req, res) => {
  const regex = new RegExp(req.query.search, "gi");
  User.find({ username: regex }, (err, allUsers) => {
    var friends = [];
  User.findById(req.user._id)
    .then((user) => {
      for (var i = 0; i < user.friends.length; i++) {
        if (user.friends[i].status === "friends") {
          friends.push(user.friends[i].userId);
        }
      }
    })
    .then(() => {
      console.log(friends);
      User.find({ _id: { $in: friends } }, (err, result) => {
        console.log(result);
        res.render("users/myfriendlist", {
          users: allUsers,
          path: "users/myfriendlist",
          friends: result,
        });
      });
    });
  });
});

router.get("/user/:id", (req, res) => {
  User.findById(req.params.id, (err, founduser) => {
    if (err) {
      return res.redirect("/");
    } else {
      res.render("users/user", { path: "users/user", user: founduser });
    }
  });
});

router.get("/myfriends", isUser, (req, res) => {
  var friends = [];
  User.findById(req.user._id)
    .then((user) => {
      for (var i = 0; i < user.friends.length; i++) {
        if (user.friends[i].status === "friends") {
          friends.push(user.friends[i].userId);
        }
      }
    })
    .then(() => {
      User.find({ _id: { $in: friends } }, (err, result) => {
        res.render("users/myfriendlist", {
          users: 17555,
          path: "users/myfriendlist",
          friends: result,
        });
      });
    });
});

router.get("/newsfeed", isUser, (req, res) => {
  Post.find().then((allPosts) => {
    res.render("users/newsfeed", {
      path: "users/newsfeed",
      posts: allPosts,
    });
  });
});

router.get("/userprofile/:id", isUser, (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      return res.redirect("/");
    } else {
      Post.find({ author: req.params.id }, (err, foundPosts) => {
        res.render("users/userprofile", {
          path: "users/userprofile",
          user: foundUser,
          posts: foundPosts,
        });
      });
    }
  });
});

module.exports = router;
