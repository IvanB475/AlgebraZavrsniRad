module.exports = function () {
  this.isUser = function isUser(req, res, next) {
    if (!req.user) {
      res.send("<h1>you must be logged in to make that request</h1>");
    } else {
      next();
    }
  };
};

// to use middleware write following in exact files: require('../middleware/index')();
