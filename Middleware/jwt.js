const jwt = require('jsonwebtoken');

function TokenMiddleware (req,res,next){
    try{
        // console.log('REQ BODY: ',req.body);
        // console.log('REQ HEADERS: ',req.headers);
        const token = req.body.token;
        const validToken = jwt.verify(token,process.env.SECRETKEY);
        req.user = validToken.user.id;
    }catch(err){
        return res.status(400).json({errors:[{msg:"Session Expired"}]});
    }
    next();
};


module.exports = TokenMiddleware;