const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const roomSchema = new Schema({
    name: String,
    members: [ 
        {type: Schema.Types.ObjectId,
        ref: 'User'}
    ],
    messages: [
        {
            sender: String, 
            msg: String
        }
    ]
})

module.exports = mongoose.model('Room', roomSchema)

