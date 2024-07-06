const router = require('express').Router();
const { getTrips, updateWishlist, getPropertyList, getReservationList } = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');


router.get('/trips',authMiddleware,getTrips);
router.patch('/wishlist/:id',authMiddleware,updateWishlist);
router.get('/properties',authMiddleware,getPropertyList);
router.get('/reservations',authMiddleware,getReservationList);


module.exports=router;