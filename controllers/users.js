const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.post("/signup", (req, res) => {
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
        console.log("uspješna registracija");
        res.render("index/landing", { path: "index/landing" });
      });
    }
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}));


router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
  console.log("successfully logged you out");
});

router.post('/settings', (req, res, next) => {
  const update = { email: req.body.email}
  User.findByIdAndUpdate(req.user._id, update).then(result => {
    res.render('index/landing', {path: '/'});
    console.log(result);
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
})

module.exports = router;
