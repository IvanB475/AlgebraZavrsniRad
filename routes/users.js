const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("users/signup", { path: "users/signup" });
});


router.get("/login", (req, res) => {
  res.render("users/login", { path: "users/login"});
})
module.exports = router;
