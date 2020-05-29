const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("users/signup", { path: "users/signup" });
});


router.get("/login", (req, res) => {
  res.render("users/login", { path: "users/login"});
})

router.get("/settings", (req, res) => {
  res.render("users/settings", {path: "users/settings"});
});

module.exports = router;
