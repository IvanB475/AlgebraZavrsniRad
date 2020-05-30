const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index/landing', {path: 'index/landing'});
});


module.exports = router;