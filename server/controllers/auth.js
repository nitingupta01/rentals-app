const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
const User =  require('../models/User');
const cloudinary = require('cloudinary');
const getDataUri = require('../utils/dataUri.js');
const salt=bcrypt.genSaltSync(10);


const register = async (req,res)=>{
    try{
        const {firstName,lastName,email,password} = req.body;
        const file=req.file;
        if(!file){
            return res.status(400).send("No File Uploaded");
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({message:"User already exists"});
        }

        const fileUri = getDataUri(file);
        const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
        const profileImageUrl= mycloud.secure_url;
        const hashedPassword=bcrypt.hashSync(password,salt);

        const newUser = new User({
            firstName,lastName,email,password:hashedPassword,profileImageURL:profileImageUrl
        });

        await newUser.save();
        res.status(201).json({message:"User Registered Successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Registeration Failed' , error:err.message});
    }
}

const login  = async(req,res)=>{
    try{
        // console.log('here');
        const {email,password}=req.body;
        const existUser = await User.findOne({email});
        if(!existUser){
            return res.status(409).json({message:"User Not Found"});
        }
        const compareResult=bcrypt.compareSync(password,existUser.password);
        if(!compareResult){
            return res.status(401).json({message:'Wrong Password'});
        }

        const user=await User.findOne({email}).select({password:0})
        const token = jwt.sign({id:existUser._id},process.env.JWT_SECRET);

        res.cookie("token",token,{
            secure:true,
            sameSite:'none',
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }).status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}

const logout = async(req,res)=>{
    try{
        res.cookie("token",null,{
            secure:true,
            sameSite:'none',
            expires: new Date(Date.now()),
            httpOnly: true,
        }).status(200).json({message:'Successfully Logout'});
    }
    catch(err){
        res.status(404).json({messsage:err.message});
    }
}

const getMyProfile = async (req, res)=> {
    const user = await User.findById(req.id).select({password:0});
    
    res.status(200).json(user);
};


module.exports={register,login,logout,getMyProfile};