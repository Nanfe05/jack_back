const express = require('express');
const router = express.Router();

// Model of LandingPage
const User = require('../Schemas/user');
const LandingPage = require('../Schemas/landingPage');

// Middlewares
const middlewareJWT = require('../Middleware/jwt');




// GET
// SEND CONTENT OF LANDING PAGE
// Private - Token Needed
router.get('/',async (req,res)=>{
    try{
    let landingPage = await LandingPage.findById(req.query.id);
    if(landingPage){   
            res.status(200).json({
                name:landingPage.name,
                contents:landingPage.content.objects,
                sizes:landingPage.content.sizes,
                success:[{
                    msg:'Landing Page Loaded'
                }]
            });
    }else{
        throw Error;
    }
        
    }catch(err){
        console.log('Error Getting Landing Pages: ',err);
        return res.status(400).json({errors:[{msg:"Error Getting Landing Page"}]});
    }
    
    
});


// POST
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
// SEND CONTENT ALREADY SAVED OR LAYOUT
// Private - Token Needed
router.post('/content',middlewareJWT,async (req,res)=>{
    try{
    const lp = await LandingPage.findById(req.body.id);
    
    res.status(200).json({
        content:lp,
        success:[{
            msg:'Content Successfully Loaded'
        }]
    });
    }catch(err){
        console.log('Error Getting Landing Pages: ',err);
        return res.status(400).json({errors:[{msg:"Can't get the content right now"}]});
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
        if(req.body.payload.project_id){
            const landingPage = await LandingPage.findById(req.body.payload.project_id);
            // Check that user is the owner of the landing page
            if(landingPage.userid == req.user){
                landingPage.name = req.body.payload.lp_name;
                landingPage.content=req.body.payload;

                await landingPage.save();
                console.log('Updated');
                return res.status(200).json({
                    success:[{
                        msg:'Landing Page Saved!'
                    }]
                });                

            }else{
                return res.status(400).json({errors:[{msg:"Don't have autorization to edit this file"}]});
            }
        }



        // Create a Landing Page
        landingPage = new LandingPage({
            name:req.body.payload.lp_name,
            userid:user._id,
            useremail:user.email,
            content:req.body.payload,
        });
        await landingPage.save();
        
        console.log('First Save');
        return res.status(200).json({
            id:landingPage._id,
            success:[{
                msg:'Landing Page Created!'
            }]
        });
    }catch(err){
        console.log('Error Saving Landing Page: ',err);
        return res.status(400).json({errors:[{msg:"Error Saving Landing Page"}]});
    }
    
});

module.exports = router;