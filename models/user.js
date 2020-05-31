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
  friends: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: { type: String},
    status: { type: String, required: true}
  }]
});

// rooms&messages need to be added

userSchema.plugin(passportLocalMongoose);

userSchema.methods.addToFriends = function(friend) {
  const updatedFriends = [...this.friends];
  const friendsFriends = [... friend.friends];

  updatedFriends.push({
    userId: friend._id,
    username: friend.username,
    status: "pending"
  });

  friendsFriends.push({
    userId: this._id,
    username: this.username,
    status: "request received"
  });

  this.friends = updatedFriends;
  friend.friends = friendsFriends;
  friend.save();
  return this.save();
}

userSchema.methods.acceptFriend = function(friend) {
  this.friends.filter( user => {
    if(user.userId.toString() === friend._id.toString()) {
        user.status = "friends";
    } 
  })
  friend.friends.filter( user => {
    if(user.userId.toString() === this._id.toString()) {
      user.status ="friends";
    }
  })
  friend.save();
  return this.save();
}



module.exports = mongoose.model("User", userSchema);
