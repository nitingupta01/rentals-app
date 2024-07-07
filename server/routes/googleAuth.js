const User = require('../models/User');
const passport=require('passport');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const redirecturl = 'https://homestay-three.vercel.app';



router.get('/google',
    passport.authenticate("google",{
        successMessage:'Login Successful',
        session:false,
        scope:['profile','email'],
    })
)

router.get('/google/failure' , (req , res) => { 
    res.send("Error"); 
}) 

router.get('/google/callback',
    passport.authenticate('google',{session:false,failureRedirect:'/api/auth/google/failure'}),
    async (req,res)=>{
        try{
            const {id,name,emails,photos}=req.user;
            const firstName=name.givenName;
            const lastName=name.familyName;
            const email = emails[0].value;
            const profileImageURL= photos[0].value;

            const user = await User.findOne({email});
            if(!user){
                const newUser = new User({firstName,lastName,email,password:id,profileImageURL})
                await newUser.save();
                const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
                return res.cookie("token",token,{secure:true,sameSite:'none'}).redirect(redirecturl);
            }
            else{
                const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
                return res.cookie("token",token,{
                    secure:true,
                    sameSite:'none',
                    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                    httpOnly: true,})
                    .redirect(redirecturl);
            }
        }catch(err){
            console.log(err);
            return res.cookie("token","",
                {secure:true,
                sameSite:'none',
                expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                httpOnly: true,})
                .redirect(`${redirecturl}/login`);
        }
    }
)

module.exports = router;
