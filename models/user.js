const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  status: {
    type: String,
  },
});

// rooms&messages need to be added

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
