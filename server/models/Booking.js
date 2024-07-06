const mongoose = require('mongoose');

const BookingSchema =  new mongoose.Schema({
    customerId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    hostId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    listingId:{
        type:mongoose.Types.ObjectId,
        ref:'Listing'
    },
    paymentId:{
        type:mongoose.Types.ObjectId,
        ref:'Payment'
    },
    startDate:{
        type:String,
        required:true
    },
    endDate:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    }
},
{timestamps:true}
)

const Booking = mongoose.model('Booking',BookingSchema);
module.exports = Booking;