const mongoose = require('mongoose');

const authSchema = {
    id: Number,
    name: { type: String, required: true },
    username: { type: String, required: true, index: { unique: true } },
    email: {type:String, required:true, index: {unique:true}},
    password: {type:String, required:true, minlength:8},
}



module.exports = mongoose.model('User', authSchema);