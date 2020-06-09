const express = require('express');
const router = express.Router();

// Model of LandingPage


// Middlewares
const middlewareJWT = require('../Middleware/jwt');

// POST 
// Save Landing Page
// Private - Token Needed
router.post('/',middlewareJWT,async (req,res)=>{
    try{
        // const user = await User.findById(req.user);
        
        console.log(req.body);
        res.status(200).json({
            success:[{
                msg:'Landing Page Saved'
            }]
        });
    }catch(err){
        console.log('Error Saving Landing Page: ',err);
        return res.status(400).json({errors:[{msg:"Error Saving Landing Page"}]});
    }
    
});

module.exports = router;