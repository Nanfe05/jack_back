const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: String,
    lastname: String,
    email:{
        type:String,
        required: true
    },
    pass:{
        type:String,
        required:true
    },
    joinOn:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('user',userSchema);

module.exports = User;