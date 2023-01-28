const express = require("express");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authorizedKeys = ['ATIuxQfvT11lxkF2', '9TxcWF8mLfQ59yRO', 'qk5bl1tcItvGrHER'];

// middleware to check for valid API key
const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['api-key'];
    if (!apiKey || authorizedKeys.indexOf(apiKey) === -1) {
        return res.status(401).send({error: 'Invalid API key'});
    }
    next();
};
// Sign up
authRouter.post("/api/signup",checkApiKey, async (req, res) => {
  try {
    const { name, deviceId,uid, deviceDetails, password } = req.body;

    const existingUser = await User.findOne({ deviceId });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists!" });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      name,
      password: hashedPassword,
      deviceId,
      uid,
      deviceDetails,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Sign In
authRouter.post("/api/signin",checkApiKey, async (req, res) => {

  User.findOne({ deviceId: { $in: req.body.deviceId } }, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send( "User not found" );
    bcryptjs.compare(req.body.password, user.password , (err, isMatch)=>{
        if (err) return res.status(500).send(err);
        if (!isMatch) return res.status(401).send( 'Wrong password' );
        const token = jwt.sign({ id: user._id }, "passwordKey");
        res.json({ token, ...user._doc });
    });
    
  });
});

//add New deviceId

authRouter.post("/api/adddevice",checkApiKey, async (req,res)=>{
    User.updateOne({ deviceId: req.body.deviceId }, { $addToSet: { deviceId: req.body.newDeviceId} }, function(err, res) {
        if (err) throw err;
        
      });
    res.json({msg: "New Device Added"});
});

authRouter.post("/api/removeOneDevice", checkApiKey, async(req,res)=>{
  User.updateOne({}, {$pull: {deviceId: req.body.deviceId}}, (err, result) => {
    if (err) throw err;
    console.log(result);
   
  });
  res.json({msg: "Device Removed"});
});

module.exports = authRouter;
