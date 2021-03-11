const express = require("express");
const router = express.Router();
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

const roomsArray = ["Algebra", "Backend", "Frontend"];

roomsArray.forEach(i => {
  router.get(`/room/${i}`, isUser, (req, res) => {
    res.render("index/room", { path: "index/room", name: i });
  })
})
module.exports = router;
