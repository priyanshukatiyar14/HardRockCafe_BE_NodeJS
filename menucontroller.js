const mongoose = require('mongoose');
const Menu = require('./menuschema.js');
const path = require('path');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const User = require('./authschema.js');

const deletemenuitem= async(req, res) => {
    const token = await req.headers.authorization.split(' ')[1]; 
    //Authorization: 'Bearer TOKEN'
    if(!token)
    {
        res.status(401).json({success:false, message: "Error! Token was not provided."});
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decodedToken){
        res.status(401).json({success:false, message: "Invalid Token"});
    }
    else if(decodedToken.exp<Date.now()/1000){
        res.status(401).json({success:false, message: "Token Expired"});
    }
    const userId = decodedToken._id;
    if(!userId){
        res.status(401).json({success:false, message: "Invalid Token"});
    }
    const user=await User.findOne({ _id: new ObjectId(userId) })
    if (!user){
        res.status(400).send("User not found!! Sign up first");
    }
    try {
        const id = new mongoose.Types.ObjectId(req.params.id); // Convert string to ObjectId
        const deletedMenu = await Menu.findByIdAndRemove(id);
        
        if (deletedMenu) {
            res.status(200).send('Menu deleted');
        } else {
            res.status(404).send('Menu not found');
        }
    } catch (err) {
        res.status(500).send('Failed to delete menu');
    }
};

const getmenu= async (req, res) => {
    const token = await req.headers.authorization.split(' ')[1]; 
    //Authorization: 'Bearer TOKEN'
    if(!token)
    {
        res.status(401).json({success:false, message: "Error! Token was not provided."});
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decodedToken){
        res.status(401).json({success:false, message: "Invalid Token"});
    }
    else if(decodedToken.exp<Date.now()/1000){
        res.status(401).json({success:false, message: "Token Expired"});
    }
    const userId = decodedToken._id;
    if(!userId){
        res.status(401).json({success:false, message: "Invalid Token"});
    }
    const user=await User.findOne({ _id: new ObjectId(userId) })
    if (!user){
        res.status(400).send("User not found!! Sign up first");
    }
    try {
      const menuItems = await Menu.find();
      const menuWithImageUrls = menuItems.map(item => {
        return {
          id:item._id,
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
          quantity:item.quantity,
          imageUrl: `http://localhost:3000/${item.imagePath}`, // Generate image URL based on imagePath
        };
      });
      res.json(menuWithImageUrls);
    } catch (error) {
      console.error('Error retrieving menu:', error);
      res.status(500).json({ error: 'An error occurred while retrieving menu items' });
    }
  };


const postmenuitem=async (req, res) => {
    const token = await req.headers.authorization.split(' ')[1]; 
    //Authorization: 'Bearer TOKEN'
    if(!token)
    {
        res.status(401).json({success:false, message: "Error! Token was not provided."});
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decodedToken){
        res.status(401).json({success:false, message: "Invalid Token"});
    }
    else if(decodedToken.exp<Date.now()/1000){
        res.status(401).json({success:false, message: "Token Expired"});
    }
    const userId = decodedToken._id;
    if(!userId){
        res.status(401).json({success:false, message: "Invalid Token"});
    }
    const user=await User.findOne({ _id: new ObjectId(userId) })
    if (!user){
        res.status(400).send("User not found!! Sign up first");
    }
    const menu = new Menu({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        imagePath: path.join('uploads', req.file.filename),
    })
    const savedMenu = await menu.save();
    res.json(savedMenu);

};

const putmenuitem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //Authorization: 'Bearer TOKEN'
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send("User not found!! Sign up first");
        }

        const id = req.params.id;
        const menu = await Menu.findById(id);
        console.log(req.body)
        if (!menu) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        menu.name = req.body.name;
        menu.description = req.body.description;
        menu.quantity = req.body.quantity;
        menu.price = req.body.price;
        menu.category = req.body.category;



        
        menu.imagePath = path.join('uploads', req.file.filename);
        

        const updatedMenuItem = await menu.save();
        console.log(updatedMenuItem)

        res.status(200).json(updatedMenuItem);
    } catch (error) {
        console.error("Error in putmenuitem:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

  
module.exports = {
    deletemenuitem,
    getmenu,
    postmenuitem,
    putmenuitem
};