const { checkout, paymentVerification ,getKey } = require('../controllers/payment');
const authMiddleware = require('../middlewares/auth');
const router = require('express').Router();

router.post('/checkout',checkout);
router.post('/paymentverification',authMiddleware,paymentVerification);
router.get('/getkey',getKey);

module.exports=router;