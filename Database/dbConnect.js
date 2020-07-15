const mongoose = require('mongoose');


function dbConnect (){
    try{
         await mongoose.connect(process.env.MONGOURL,{user:process.env.MONGOUSER,pass:process.env.MONGOPASS, useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Data Base Connected');
    }catch(err){
        console.log('DB Connection Error');
    }
}

module.exports = dbConnect;