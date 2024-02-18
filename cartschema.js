const mongoose = require('mongoose');
const Menu = require('./menuschema.js');
const User = require('./authschema.js');

const cartSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Reference to the Product model
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
    quantity: Number
});

module.exports = mongoose.model('Cart', cartSchema);