const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const roomSchema = new Schema({
    name: String,
    members: [ 
        {type: Schema.Types.ObjectId,
        ref: 'User'}
    ]
})

module.exports = mongoose.model('Room', roomSchema)