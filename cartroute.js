const express = require('express');
const router = express.Router();

// Local Modules
const mycontroller = require('./cartcontroller.js');

// Requests
router.post('/', mycontroller.cartaddItem);
router.get('/', mycontroller.listcartItem);
router.put('/', mycontroller.updatecartItem);
router.delete('/', mycontroller.checkoutcartItem);

module.exports = router;