const express = require('express');
const router = express.Router();

// Model of LandingPage
const User = require('../Schemas/user');
const LandingPage = require('../Schemas/landingPage');

// Middlewares
const middlewareJWT = require('../Middleware/jwt');

// GET
// SEND AVAILABLE LANDING PAGES
// Private - Token Needed
router.post('/getall',middlewareJWT,async (req,res)=>{
    try{
    const lp_private = await LandingPage.find({userid:req.user}).select('name category _id');   
    const lp_public = await LandingPage.find({accessibility:'public'}).select('name category _id');
    
    res.status(200).json({
        lp_private,
        lp_public,
        success:[{
            msg:'Landing Pages Loaded'
        }]
    });
        
    }catch(err){
        console.log('Error Getting Landing Pages: ',err);
        return res.status(400).json({errors:[{msg:"Error Getting Landing Pages"}]});
    }
    
    
});


// POST 
// Save Landing Page
// Private - Token Needed
router.post('/',middlewareJWT,async (req,res)=>{
    try{
        // Look for user to get email and id 
        const user = await User.findById(req.user);
        // // Search by USER ID - if a lp with save lp_id exists to choose if create or update one 
        // const landingPage = await LandingPage.findById(req.user);
        let landingPage;
        // Update a Landing Page
        
        // Create a Landing Page
        landingPage = new LandingPage({
            name:req.body.payload.lp_name,
            userid:user._id,
            useremail:user.email,
            content:req.body.payload,
        });


        await landingPage.save();
        
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