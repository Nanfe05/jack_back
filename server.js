// .env Variables
require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const dbConnect = require('./Database/dbConnect');

// Data Base Connection
dbConnect();

// Middleware - Request Body if JSON
app.use(express.json());

app.use('/jackmarketing/auth',require('./Routes/auth'));

app.use('/jackmarketing/landingpage',require('./Routes/landingPage'));

// Else if no routes available
app.get('*',(req,res)=>{
    res.status(404).send('Page Not Found');
});

app.listen(port,()=>{
    console.log('Server Started at port:',port);
});