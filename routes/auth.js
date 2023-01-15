const express = require("express");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


// Sign up
authRouter.post("/api/signup", async(req,res)=>{
    try{
        const {name,deviceId,deviceId2, password}=req.body;
        
        const existingUser =  await User.findOne({deviceId});
        const existingUser2 =  await User.findOne({deviceId2});
        if(existingUser||existingUser2){
            return res.status(400)
            .json({msg:"User already exists!"});
        }
        const hashedPassword = await bcryptjs.hash(password, 8);
        let user = new User({
            name,
            password: hashedPassword,
            deviceId,
            deviceId2,
            
            
        });
        user = await user.save();
        res.json(user);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});


//Sign In
authRouter.post("/api/signin", async(req,res)=>{
    try{
        const {deviceId,deviceId2,password}= req.body;
        
        const user = await User.findOne({deviceId});
        const user2 = await User.findOne({deviceId2});
        if(!user||!user2){
            return res.status(400).json({msg: "User does not exist!"});
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password." });
        }
        const token = jwt.sign({ id: user._id},"passwordKey");
        res.json({token,  ...user._doc });
        // res.send(JSON.stringify({token, ...user._doc}));

    }catch(e){
        res.status(500).json({error:e.message});
    }
});

module.exports = authRouter;