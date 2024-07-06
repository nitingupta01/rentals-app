const multer = require("multer");

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("profileImage");
const arrayUpload = multer({storage}).array("listingPhotos");

module.exports = {singleUpload,arrayUpload};