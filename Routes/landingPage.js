const express = require('express');
const router = express.Router();

// Model of LandingPage
const User = require('../Schemas/user');
const LandingPage = require('../Schemas/landingPage');

// Middlewares
const middlewareJWT = require('../Middleware/jwt');

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


        let saveFile = await landingPage.save();
        console.log('SAVE: ',saveFile);
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