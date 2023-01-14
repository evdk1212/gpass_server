const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name:{
        required:true,
        type: String,
        trim: true,
    },
    deviceId:{
        required:true,
        type: String,
        trim: true,
    },
    password: {
        required: true,
        type: String,
        trim: true,
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;