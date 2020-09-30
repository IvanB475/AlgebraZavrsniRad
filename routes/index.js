const express = require("express");
const router = express.Router();
const User = require("../models/user");
require("../middleware/index")();

router.get("/", (req, res) => {
  res.render("index/landing", { users: 0, path: "index/landing" });
});

router.get("/chat", (req, res) => {
  res.render("index/socket", { path: "index/socket" });
});

router.get("/room-register", isUser, (req, res) => {
  res.render("index/rooms", { path: "index/rooms" });
});

router.get("/scaledronechat", (req, res) => {
  res.render("index/scaledronechat", { path: "index/scaledronechat" });
});
module.exports = router;
