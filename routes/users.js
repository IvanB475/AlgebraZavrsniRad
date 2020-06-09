const express = require("express");
const router = express.Router();
const User = require('../models/user');

router.get("/signup", (req, res) => {
  res.render("users/signup", { path: "users/signup" });
});


router.get("/login", (req, res) => {
  res.render("users/login", { path: "users/login"});
})

router.get("/settings", (req, res) => {
  res.render("users/settings", {path: "users/settings"});
});

router.get("/resetpw", (req, res) => {
  res.render("users/resetpw", {path: "users/resetpw"});
});

router.get('/resetpw/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if(!user) {
    console.log("Reset token is invalid");
    return res.redirect('/');
    }
    res.render('users/setnewpw', {token: req.params.token});
  })
});

router.get('/findusers', (req, res) => {
  const regex = new RegExp(req.query.search, 'gi');
  User.find({"username": regex}, (err, allUsers) => {
    res.render('index/landing', { users: allUsers, path: 'index/landing' })
  })
})

router.get("/user/:id", (req, res) => {
  User.findById(req.params.id, (err, founduser) => {
    if(err) {
        return res.redirect("/");
    } else {
        res.render("users/user", {path: 'users/user', user: founduser})
    }
})
})

router.get("/myfriends", (req, res) => {
  res.render('users/myfriendlist', {path: 'users/myfriendlist'});
})

router.get("/newsfeed", (req, res) => {
  res.render("users/newsfeed", { path: 'users/newsfeed'});
})

module.exports = router;
