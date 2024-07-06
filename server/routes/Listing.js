const router = require('express').Router();
const {arrayUpload} = require('../middlewares/multer.js');
const authMiddleware = require('../middlewares/auth.js');
const {createListing, fetchProperties , fetchPropertyById, fetchPropertiesBySearch} = require('../controllers/Listing.js')

router.post('/create',arrayUpload,authMiddleware,createListing);
router.get('/get',fetchProperties);
router.get('/:id',fetchPropertyById);
router.get('/search/:search',fetchPropertiesBySearch);

module.exports = router;