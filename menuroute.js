const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage });


// Local Modules
const mycontroller = require('./menucontroller.js');
  
// Requests 
router.delete('/delete/:id', mycontroller.deletemenuitem);
router.put('/:id', upload.single('image'),mycontroller.putmenuitem);
router.get('/', mycontroller.getmenu);
router.post('/', upload.single('image'),mycontroller.postmenuitem);
module.exports = router;