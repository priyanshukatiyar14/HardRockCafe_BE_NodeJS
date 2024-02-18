const mongoose = require('mongoose');
const Menu = require('./menuschema.js');
const path = require('path');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const User = require('./authschema.js');
const Cart=require('./cartschema.js');

const cartaddItem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from headers
        if (!token) {
            return res.status(401).json({ success: false, message: "Error! Token was not provided." });
        }
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        } else if (decodedToken.exp < Date.now() / 1000) {
            return res.status(401).json({ success: false, message: "Token Expired" });
        }

        const userId = decodedToken._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }

        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(400).send("User not found!! Sign up first");
        }

        const { product, quantity } = req.body;
        const menu = await Menu.findById(product);

        
        if (!menu) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if(menu.quantity<quantity){
            return res.status(404).json({ success: false, message: "Quantity is greater than Available Quantity" });
        }

        const cartItem = new Cart({
            user: userId,
            product: product,
            quantity: quantity
        });

        const savedCartItem = await cartItem.save();
        res.status(201).json(savedCartItem);
    } catch (err) {
        console.error(err); // Log any unexpected errors
        res.status(500).send('Failed to add Cart Item');
    }
};


const listcartItem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from headers
        if (!token) {
            return res.status(401).json({ success: false, message: "Error! Token was not provided." });
        }
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        } else if (decodedToken.exp < Date.now() / 1000) {
            return res.status(401).json({ success: false, message: "Token Expired" });
        }

        const userId = decodedToken._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }

        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(400).send("User not found!! Sign up first");
        }

        const { product, quantity } = req.body;
        const cartItems = await Cart.find({ user: userId });

        if (!cartItems) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        res.status(200).json(cartItems);
    } catch (err) {
        console.error(err); // Log any unexpected errors
        res.status(500).send('Failed to add Cart Item');
    }
};

const updatecartItem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from headers
        if (!token) {
            return res.status(401).json({ success: false, message: "Error! Token was not provided." });
        }
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        } else if (decodedToken.exp < Date.now() / 1000) {
            return res.status(401).json({ success: false, message: "Token Expired" });
        }

        const userId = decodedToken._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }

        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(400).send("User not found!! Sign up first");
        }

        const { id,product, quantity } = req.body;
        const menu = await Menu.findById(product);
        if (!menu) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if(menu.quantity<quantity){
            return res.status(404).json({ success: false, message: "Quantity is greater than Available Quantity" });
        }


        const cartItems = await Cart.findById(id);
        if (!cartItems) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cartItems.quantity=quantity
        const updatedCartItem = await cartItems.save();

        res.status(200).json(updatedCartItem);

    } catch (err) {
        console.error(err); // Log any unexpected errors
        res.status(500).send('Failed to add Cart Item');
    }
};

const checkoutcartItem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from headers
        if (!token) {
            return res.status(401).json({ success: false, message: "Error! Token was not provided." });
        }
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        } else if (decodedToken.exp < Date.now() / 1000) {
            return res.status(401).json({ success: false, message: "Token Expired" });
        }

        const userId = decodedToken._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }

        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(400).send("User not found!! Sign up first");
        }

        const { product, quantity } = req.body;
        const cartItems = await Cart.find({ user: userId });

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ success: false, message: "Cart is empty" });
        }

        // Iterate over cart items and process checkout for each item
        for (const cartItem of cartItems) {
            // Retrieve product details
            const product = await Menu.findById(cartItem.product);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            // Check if sufficient quantity is available
            if (product.quantity < cartItem.quantity) {
                return res.status(400).json({ success: false, message: "Insufficient quantity for product: " + product.name });
            }

            // Subtract the quantity from available stock
            product.quantity -= cartItem.quantity;
            await product.save();

            // Remove the item from the cart after successful checkout
            await Cart.findByIdAndDelete(cartItem._id);
        }

        res.status(200).json({ success: true, message: "Checkout successful" });
    } catch (err) {
        console.error(err); // Log any unexpected errors
        res.status(500).send('Failed to Checkout Cart Item');
    }
};

module.exports = {
    cartaddItem,
    listcartItem,
    updatecartItem,
    checkoutcartItem
};
