const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index/landing', {users: 0, path: 'index/landing'});
});

router.get('/chat', (req, res) => {
    res.render('index/socket', {path: 'index/socket'});
})

router.get("/room-register", (req, res) => {
    res.render("index/rooms", {path: 'index/rooms'});
})

router.get("/room", (req, res) => {
    res.render("index/room", {path: 'index/room'});
})
module.exports = router;