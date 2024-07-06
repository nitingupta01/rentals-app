const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const User = require('../models/User');

const getTrips = async(req,res)=>{
    try{
        const id=req.id;
        const trips =  await Booking.find({customerId:id}).populate('listingId');
        res.status(200).json(trips);
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}

const updateWishlist = async(req,res)=>{
    try{
        const userId=req.id;
        const listingId=req.params.id;
        const user = await User.findById(userId);
        const listing = await Listing.findById(listingId);
        
        const favouriteListing=user.wishList.find((item)=>item._id.toString()===listingId);
        if(favouriteListing){
            user.wishList = user.wishList.filter((item)=>item._id.toString()!==listingId)
            await user.save();
            res.status(200).json({message:'Removed from Wishlist',wishList:user.wishList})
        }else{
            user.wishList.push(listing);
            await user.save();
            res.status(200).json({message:'Successfully Added to Wishlist',wishList:user.wishList});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'Internal Server Error'});
    }
}

const getPropertyList = async(req,res)=>{
    try{
        const id=req.id;
        const properties = await Listing.find({creator:id});
        res.status(200).json(properties);
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}

const getReservationList = async(req,res)=>{
    try{
        const id=req.id;
        const reservations = await Booking.find({hostId:id}).populate('listingId');
        res.status(200).json(reservations);
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}

module.exports= {getTrips,updateWishlist,getPropertyList,getReservationList};