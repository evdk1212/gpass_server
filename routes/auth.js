const express = require("express");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Sign up
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, deviceId, deviceDetails, password } = req.body;

    const existingUser = await User.findOne({ deviceId });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists!" });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      name,
      password: hashedPassword,
      deviceId,
      deviceDetails,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Sign In
authRouter.post("/api/signin", async (req, res) => {
  //   try {
  //     const { deviceId, password } = req.body;

  //     const user = await User.findOne({ deviceId: deviceId });
  //     if (!user) {
  //       return res.status(400).json({ msg: "User does not exist!" });
  //     }

  //     const isMatch = await bcryptjs.compare(password, user.password);
  //     if (!isMatch) {
  //       return res.status(400).json({ msg: "Incorrect password." });
  //     }
  //     const token = jwt.sign({ id: user._id }, "passwordKey");
  //     res.json({ token, ...user._doc });
  //   } catch (e) {
  //     res.status(500).json({ error: e.message });
  //   }

  User.findOne({ deviceId: { $in: req.body.deviceId } }, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send({ message: "User not found" });
    bcryptjs.compare(req.body.password, user.password , (err, isMatch)=>{
        if (err) return res.status(500).send(err);
        if (!isMatch) return res.status(401).send({ message: 'Wrong password' });
        const token = jwt.sign({ id: user._id }, "passwordKey");
        res.json({ token, ...user._doc });
    });
    
  });
});

module.exports = authRouter;
