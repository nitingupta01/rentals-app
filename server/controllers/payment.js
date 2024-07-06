const crypto = require("crypto");
const Payment = require("../models/PaymentModel");
const Razorpay = require("razorpay");
const Booking = require('../models/Booking.js');
const Listing = require('../models/Listing.js');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const checkout = async (req, res) => {
    try{
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };
        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    }catch(err){
        console.log(err);
        res.status(400).json({message:'erorr'});
    }
};

const paymentVerification = async (req, res) => {
    try{
    const {order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature,listingId,startDate,endDate,totalPrice } =
    req.body;
    const customerId=req.id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
        
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const payment = await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        });


        const listing =  await Listing.findById(listingId);
        const hostId = listing.creator;
        const newBooking = new Booking({customerId,hostId,listingId,paymentId:payment._id,startDate,endDate,totalPrice});
        await newBooking.save();

        res.status(200).json({message:'Success'});
    } else {
        res.status(400).json({
        success: false,
        message:'Payment Failed'
        });
    }
    }catch(err){
        console.log(err);
        res.status(404).json({message:'Payment Failed'});
    }
};

const getKey = async(req,res)=>{
    res.status(200).json({key:process.env.RAZORPAY_API_KEY});
}

module.exports={checkout,paymentVerification,getKey};