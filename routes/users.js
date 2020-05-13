const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("users/signup", { path: "users/signup" });
});

module.exports = router;
