const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const landingPageSchema = new Schema({
    // ID will be automatically generated at the moment of creation of a lp
    name: String,
    userid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    useremail:{
        type:String,
        required: true
    },
    content:{
        type:Object,
        required:true
    },
    createdOn:{
        type: Date,
        default: Date.now
    }
});

const LandingPage = mongoose.model('landingpage',landingPageSchema);

module.exports = LandingPage;