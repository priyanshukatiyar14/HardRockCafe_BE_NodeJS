const mongoose = require('mongoose');

const menuSchema = {
    id: Number,
    name: String,
    price: Number,
    description: String,
    category: String,
    imagePath: String,
    quantity:Number,
}



module.exports = mongoose.model('Menu', menuSchema);