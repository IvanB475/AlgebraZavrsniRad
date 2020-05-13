const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.post("/singup", (req, res) => {
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

module.exports = router;
