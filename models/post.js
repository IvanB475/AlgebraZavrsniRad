const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
    Author: { type: Schema.Types.ObjectId, ref: 'User'},
    username: String,
    post: String,
    time: {type: Date, default: Date.now},
    comments: [
        { 
            username: String,
            message: String,
            time: {type: Date, default: Date.now}
        }
    ]
})

module.exports = mongoose.model('Post', postSchema);