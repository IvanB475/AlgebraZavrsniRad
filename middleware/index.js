module.exports = function() {
    this.isAdmin = function isAdmin(req, res, next) {
        if(!req.user) {
            res.sent("you must be logged in to make that request");
        } else {
            if(req.user.status ==="admin"){
                next();
            } 
            else {
                res.send("you are not authorized to make that request");
            }
        }
        }
    }


    // to use middleware write following in exact files: require('../middleware/index')();