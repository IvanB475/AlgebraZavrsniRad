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

router.get("/settings", isUser, async (req, res) => {

  try {
    const posts = await Post.find({ author: req.user._id });
    res.render("users/settings", {
      posts: posts,
      path: "users/settings",
    });
  } catch(e) {
    console.log("error occured");
  }

/*   Post.find({ author: req.user._id }).then((allPosts) => {
    res.render("users/settings", {
      posts: allPosts,
      path: "users/settings",
    });
  }); */
});

router.get("/resetpw", (req, res) => {
  res.render("users/resetpw", { path: "users/resetpw" });
});

router.get("/resetpw/:token", async (req, res) => {

    try {
      const user = await User.findOne(
        {
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { $gt: Date.now() },
        });
      if(!user) {
        console.log("token is invalid");
      } else {
        res.render("users/setnewpw", { token: req.params.token });
      }
    } catch(e) {
      console.log("something went wrong");
    }

/*   User.findOne(
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
  ); */
});

router.get("/findusers", isUser, async (req, res) => {
  const regex = new RegExp(req.query.search, "gi");
  let foundUsers = [];
  let friends = [];

  try { 
    const users = await User.find({username: regex});
    users.forEach( user => { 
      if( user.friends.some(friend => friend.userId.toString() === req.user._id.toString() && (friend.status === "declined" || friend.status ==="blocked" || friend.status ==="friends"))){
          console.log("do not display this user");
      } else {
        if( user.privacy !== "Private"){ 
          foundUsers.push(user);
        }
      }
    });
  } catch(e) {
    console.log(e);
  }

  try { 
    const user = await User.findById(req.user._id);
    for (friend of user.friends) {
      if (friend.status === "friends") {
        friends.push(friend.userId);
      }
    }
  } catch(e) {
    console.log(e);
  }


  try { 
    const allFriends = await User.find({ _id: { $in: friends } });
    res.render("users/myfriendlist", {
      users: foundUsers,
      path: "users/myfriendlist",
      friends: allFriends,
    });
  } catch(e) {
    console.log(e);
  }

});
/*   User.find({ username: regex }, (err, allUsers) => {
    allUsers.forEach( user => {
        if( user.friends.some(friend => friend.userId.toString() === req.user._id.toString() && (friend.status === "declined" || friend.status ==="blocked"))){
            console.log("do not display this user");
          } else {
            if( user.privacy !== "Private"){ 
            foundUsers.push(user);
          }
        } 
      })
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
          users: foundUsers,
          path: "users/myfriendlist",
          friends: result,
        });
      });
    });
  });
}); */

router.get("/user/:id", async (req, res) => {

  try {
    const user = await User.findById(req.params.id);
    res.render("users/user", { path: "users/user", user: user });
  } catch(e) {
    console.log(e);
  }



/*   User.findById(req.params.id, (err, founduser) => {
    if (err) {
      return res.redirect("/");
    } else {
      res.render("users/user", { path: "users/user", user: founduser });
    }
  }); */
});

router.get("/myfriends", isUser, async (req, res) => {
  var friends = [];

  try { 
    const user = await User.findById(req.user._id);
    for (friend of user.friends) {
      if (friend.status === "friends") {
        friends.push(friend.userId);
      };
    }
  } catch(e){
    console.log(e);
  }

  try { 
    const allFriends = await User.find({ _id: { $in: friends }});
    res.render("users/myfriendlist", {
      users: 17555,
      path: "users/myfriendlist",
      friends: allFriends,
    });
  } catch(e) {
    console.log(e);
  }


/*   User.findById(req.user._id)
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
    }); */
});

router.get("/newsfeed", isUser, async (req, res) => {
  
  try {
    const posts = await Post.find();
    res.render("users/newsfeed", {
      path: "users/newsfeed",
      posts: posts,
    });
  } catch {
    console.log("error occured");
  }
/*   Post.find().then((allPosts) => {
    res.render("users/newsfeed", {
      path: "users/newsfeed",
      posts: allPosts,
    });
  }); */
});

router.get("/userprofile/:id", isUser, async (req, res) => {

  try { 
    const user = await User.findById(req.params.id);
    const posts = await Post.find({author: req.params.id});
    res.render("users/userprofile", {
      path: "users/userprofile",
      user: user,
      posts: posts,
    });
  } catch (e) {
    console.log(e);
  }


  /* User.findById(req.params.id, (err, foundUser) => {
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
  }); */
});

module.exports = router;
