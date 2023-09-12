const mongoose = require('mongoose');
const User = require('./authschema.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongodb').ObjectId;


require('dotenv').config();
const usersignup= async (req, res) => {
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    try{
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        const savedUser = await user.save();
        const accesstoken=await jwt.sign({_id: user._id.valueOf()}, process.env.TOKEN_SECRET, {expiresIn: "1d"});
        const refreshtoken=await jwt.sign({_id: user._id.valueOf()}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
        return res.status(201).json({"accesstoken":accesstoken, "refreshtoken":refreshtoken});
    }
    catch(err){
        if (err.code === 11000){
            res.status(400).send("User already exists with this "+Object.keys(err.keyValue)[0]+"!!");
        }
        else{
            res.status(500).send(err);
        }
    }

}
const userlogin= async (req, res) => {
    try{
        const user=await User.findOne({username: req.body.username})
        if (!user){
            res.status(400).send("User not found!! Sign up first");
        }
        else{
            console.log(user);
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            console.log(validPassword);
            if (!validPassword){
                res.status(400).send("Invalid Password");
            }
            else{
                try{
                    const accesstoken=await jwt.sign({_id: user._id.valueOf()}, process.env.TOKEN_SECRET, {expiresIn: "1d"});
                    const refreshtoken=await jwt.sign({_id: user._id.valueOf()}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
                    return res.status(200).json({"accesstoken":accesstoken, "refreshtoken":refreshtoken});
                }
                catch(err){
                    res.status(500).send(err);
                }
            }
        }
    }      
    catch(err){
        res.status(500).send(err);
    }
}

const refreshtoken= async (req, res) => {
    const refreshtoken = req.body.token;
    if (!refreshtoken) {
        res.status(401).json({success:false, message: "Error! Token was not provided."});
    }
    try{
        const decodedToken = await jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
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
        try{
            const accesstoken=await jwt.sign({_id: user._id.valueOf()}, process.env.TOKEN_SECRET, {expiresIn: "1d"});
            const refreshtoken=await jwt.sign({_id: user._id.valueOf()}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
            return res.status(200).json({"accesstoken":accesstoken, "refreshtoken":refreshtoken});
        }
        catch(err){
            res.status(400).send(err);
        }
    }
    catch(err){
        res.status(400).send(err);
    }
}


module.exports = {
    usersignup,
    userlogin,
    refreshtoken
};