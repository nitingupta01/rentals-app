const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next) =>{
    try{
        const {token} = req.cookies;
        
        if(!token){
            return res.status(401).json({message:'Unauthorized Request'})
        }
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        if(!verified){
            return res.status(401).json({message:'Unauthorized Access'});
        }
        // console.log(verified.id);
        req.id=verified.id;
        next();
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message})
    }
}

module.exports = authMiddleware;