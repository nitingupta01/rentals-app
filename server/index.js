require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary');
const AuthRoutes = require('./routes/auth.js');
const ListingRoutes = require('./routes/Listing.js');
const PaymentRoutes = require('./routes/payment.js');
const UserRoutes =  require('./routes/user.js');
const googleAuthentication = require('./routes/googleAuth.js')
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./config/passportConfig.js')


const app=express();
app.use(cors({credentials: true,origin: "https://homestay-three.vercel.app"}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(passport.initialize());


const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.nnrvcc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
cloudinary.config({
    cloud_name: `${process.env.CLOUD_NAME}`,
    api_key: `${process.env.API_KEY}`,
    api_secret: `${process.env.API_SECRET}`,
});

app.use("/auth",AuthRoutes);
app.use("/properties",ListingRoutes);
app.use("/payment",PaymentRoutes);
app.use("/users",UserRoutes);
app.use("/api/auth",googleAuthentication);

mongoose.connect(uri).then(()=>{
    app.listen(process.env.PORT,()=>{console.log(`App is listening on PORT ${process.env.PORT}`)})
}).catch((err)=>{console.log(err)});
