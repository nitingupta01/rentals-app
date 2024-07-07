const Listing  = require('../models/Listing.js');
const User = require('../models/User.js');
const cloudinary = require('cloudinary');
const getDataUri = require('../utils/dataUri.js');

const createListing = async(req,res)=>{
    try{
        const id=req.id;
        const {category,type,streetAddress,aptSuite,city,province,country,guestsCount,bedroomsCount,bedsCount,bathroomsCount,amenities,title,description,highlight,highlightDesc,price} = req.body;
        const listings=req.files;
        if(!listings){
            return res.status(404).json({message:'Missing Data'});
        }


        const listingPhotos = [];
        for (const file of listings) {
            const fileUri = getDataUri(file);
            const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
            listingPhotos.push(mycloud.secure_url);
        }

        // console.log(listingPhotos);

        const user = await User.findOne({_id:id})
        
        const result=new Listing({creator:id,category,type,streetAddress,aptSuite,city,province,country,guestsCount,bedroomsCount,bedsCount,bathroomsCount,listingPhotos,amenities,title,description,highlight,highlightDesc,price});

        await result.save();
        res.status(201).json({message:'Your Property Listed Sucessfully!'});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}

const fetchProperties = async(req,res)=>{
    const qCategory = req.query.category;
    try{
        let listings;
        if(qCategory==='All'){
            listings = await Listing.find({}).populate('creator','firstName');
        }else{
            listings = await Listing.find({category:qCategory});
        }
        res.status(200).json(listings);
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

const fetchPropertyById = async(req,res)=>{
    try{
        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Property Not Found'});
        }
        const property= await Listing.findById(id).populate('creator','firstName lastName profileImageURL');
        if(!property){
            return res.status(400).json({message:'Property Not Found'});
        }
        res.status(200).json(property);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}

const fetchPropertiesBySearch = async(req,res)=>{
    const {search} = req.params;
    try{
        const listing = await Listing.find({
            $or:[
                {category:{$regex:search,$options:'i'}},
                {title: {$regex:search,$options:'i'}},
                {city: {$regex:search, $options:'i'}},
                {country: {$regex:search,$options:'i'}},
                {province: {$regex:search,$options:'i'}}
            ]
        }).populate('creator','firstName lastName profileImageURL');
        res.status(200).json(listing);
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Fail to fetch'});
    }
}

module.exports = {createListing,fetchProperties,fetchPropertyById,fetchPropertiesBySearch};