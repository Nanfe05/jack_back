const jwt = require('jsonwebtoken');




function TokenMiddleware (req,res,next){
    const token = req.body.token;
    const validToken = jwt.verify(token,process.env.SECRETKEY);
    if(!validToken){
        return res.status(400).json({errors:[{msg:"Session Expired"}]});
    }
    req.user = validToken.user.id;
    next();
};


module.exports = TokenMiddleware;