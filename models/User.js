// mongoose helps to create and validate schemas

//import 
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please Provied a username"]
    },
    email: {
        type: String,
        required: [true, "Please Provied a email"],
        unique: true,
        match: [
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            "Please Provide a Valid Email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date

});

// we are running some middleware presaving
UserSchema.pre("save", async function (next) {
    //first check if password is modified
    if (!this.isModified("password")) {
        //if password we are sending is not modified no need to rehashing ans just save 
        //for hashing bcrypt 
        next();
    }
    //create salt 10 rounds is moderate don't overdo it
    const salt = await bcrypt.genSalt(10);
    //this would save new passworD in password field then its saved the document
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPasswords = async function (password) {
    // password we extracted from body and compare it with database
    //this.password> means we compare wathever method is running against
    return await bcrypt.compare(password, this.password)

};


UserSchema.methods.getSignedToken = function () {
    //sign take 3 things payloads/secretkey/options
    //this refers to object we are calling this on (user)
    //look into auth.js
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

//randon secret in terminal
//node > require('crypto').randomBytes(35).toString("hex")
//we can use this as json web token secret (much secured) 
//'05837936005e0ece1f8cdaae56f5276ec84b6b398968c7d03b467e5707c91045e06f06'
//copy this in config.env


UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(10).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;

}




//select we dont password to send back when query for user unless we explicitly mention to do so

const User = mongoose.model("User", UserSchema);

//now we can import it in controller/auth.js
module.exports = User;