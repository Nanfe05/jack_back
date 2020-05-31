const mongoose = require('mongoose');


function dbConnect (){
    mongoose.connect(process.env.MONGOURL,{user:process.env.MONGOUSER,pass:process.env.MONGOPASS, useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Data Base Connected');
}

module.exports = dbConnect;