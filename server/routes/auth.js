const express= require('express');
const {singleUpload} = require('../middlewares/multer.js');
const router = express.Router();
const {register,login, logout, getMyProfile} = require('../controllers/auth.js');
const authMiddleware = require('../middlewares/auth.js');

router.post("/register",singleUpload,register);
router.post("/login",login);
router.post('/logout',logout);
router.get('/profile',authMiddleware,getMyProfile);

module.exports = router;