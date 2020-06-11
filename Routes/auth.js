const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// Security 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Model of User from the DataBase
const User =  require('../Schemas/user');

// Middlewares
const middlewareJWT = require('../Middleware/jwt');

// POST 
// Validate User
// Private - Need Token 
router.post('/',middlewareJWT,async (req,res)=>{
    try{
        const user = await User.findById(req.user);
        res.status(200).json({
            user:{
                name:user.name,
                lastname:user.lastname
            },
            success:[{
                msg:'Successfully Logged'
            }]
        });
    }catch(err){
        console.log('Error Validating User: ',err);
        return res.status(400).json({errors:[{msg:"Error Validating User"}]});
    }
    
});


// POST
// Login User
// Public

router.post('/login',[
    check('email')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    check('pass')
        .isLength({min:5}).withMessage('Password Should be min 5 Characters')
        .isLength({max:10}).withMessage('Password Should be max 10 Characters')
        .not().isEmpty().withMessage('Password Should not be empty')
],async (req,res)=>{
    // Check if errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }
    try{
            // Get User 
            let user = await User.findOne({email:req.body.email});
            // If user don't exists
            if(!user){
                
                    return res.status(400).json({errors:[{msg:"Credentials are not valid"}]});
                
            }
            // If password don't match
            const passMatch =await bcrypt.compare(req.body.pass,user.pass);
            
            if(!passMatch){
                
                    return res.status(400).json({errors:[{msg:"Credentials are not valid"}]});
                
            }

            const token =  jwt.sign({user:{id:user.id}},process.env.SECRETKEY,{
                expiresIn: process.env.TOKENTIME
            })
            
            // Return JSON WEB TOKEN TO SIGN
            
                res.status(200).json({
                    token,
                    success:[{
                        msg:'Successfully Logged'
                    }]
                });
            
        

    }catch(err){
    console.log('Error Saving User: ', err);
     res.status(500).send('Server Error, Please Contact Customer Support');
    }

});


// POST
// Register New Users
// Public

router.post('/signin',[
    check('name')
        .isLength({min:1}).withMessage('Name Should be min 1 Characters')
        .isLength({max:10}).withMessage('Name Should be max 10 Characters'),
    check('lastname')
        .isLength({min:1}).withMessage('Lastname Should be min 1 Characters')
        .isLength({max:10}).withMessage('Lastname Should be max 10 Characters'),
    check('email')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    check('pass')
        .isLength({min:5}).withMessage('Password Should be min 5 Characters')
        .isLength({max:10}).withMessage('Password Should be max 10 Characters')
        .not().isEmpty().withMessage('Password Should not be empty')
],async (req,res)=>{
    // Check if errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        
            return  res.status(400).json({errors:errors.array()});
      
    }
    // Check if email DO NOT exists
    let user = await User.findOne({email:req.body.email});
    // If email already registered send error
    if(user){
        
            return res.status(400).json({errors:[{msg:"Email already registered"}]});
       
    }
    try{
        // Hash Password
        let pass = await bcrypt.hash(req.body.pass,10);
        // Create and save user
        user = new User({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            pass
        });

        await user.save();

        // Generate a Token with the user ID
        const token = jwt.sign({user:{id:user.id}},process.env.SECRETKEY,{
            expiresIn: process.env.TOKENTIME
        })
        
        // Return JSON WEB TOKEN TO SIGN
        
            res.status(200).send({
                token,
                success:[{
                    msg:'Successfully Signed'
                }]
            });
       


    }catch(err){
        console.log('Error Saving User: ', err);
        
            res.status(500).send('Server Error, Please Contact Customer Support');
       
    }

   
});



module.exports = router;
