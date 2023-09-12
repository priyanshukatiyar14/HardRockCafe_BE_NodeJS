const mongoose = require('mongoose');

const menuSchema = {
    id: Number,
    name: String,
    price: Number,
    description: String,
    category: String,
    imagePath: String,
}



module.exports = mongoose.model('Menu', menuSchema);