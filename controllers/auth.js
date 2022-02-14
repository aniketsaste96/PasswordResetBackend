const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')


// this is going to import in routes/auth.js
//named Exports
//we are working with DB so function should be async 


//REGISTER 


exports.register = async (req, res, next) => {
    //we need things from body here
    //destructure it extract things from body
    const { username, email, password } = req.body;
    try {
        //create user 
        const user = await User.create({
            // this object where thiskeyword lives in
            username,
            email,
            password
        });
        sendToken(user, 200, res);
    } catch (error) {
        //if error 
        //custome errorHandler we build in utils
        next(error)

    }
}


//LOGIN



exports.login = async (req, res, next) => {
    //FOR LOGIN WE NEED to get things from body 
    //destrucuring
    const { email, password } = req.body;

    // first check if email  present or not
    if (!email || !password) {
        res.status(400).json({ success: false, error: "Please provide email and password" })

        // return next(new ErrorResponse("Please provide email and password",400))
    }

    try {
        //it will return user with email and password
        const user = await User.findOne({ email }).select("+password")

        //if we did not get user back so create method in models
        if (!user) {
            res.status(404).json({ success: false, error: "Invalid Credentials!!!" })
        }

        //if we found email in DB now we compare password 
        const isMatch = await user.matchPasswords(password);
        //if not mathced

        if (!isMatch) {
            res.status(404).json({ success: false, error: "Invalid Credentials!!!" })
        }


        sendToken(user, 200, res);



    } catch (error) {
        next(error)

    }
    //*************** */ check for res.send this took your more than 4 hrsssss************
}




exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            //do not tell directly about email
            return next(new ErrorResponse("Email could not be sent!!!", 404))
        }

        const resetToken = user.getResetPasswordToken();


        await user.save();

        //create reset url 

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`

        const message = `
        <h1> You have requested password reset </h1>
        <p>Please go to this link to reset password</p>
        <a href= ${resetUrl} clicktracking=off > ${resetUrl}</a>      
          `

        try {
            //create email sender for that we can use nodemailer and sendgrid
            sendEmail({
                to: user.email,
                subject: "Password reset Request!!",
                text: message
            });
            res.status(200).json({ success: true, data: "Email Sent" })

        } catch (error) {
            user.ResetPasswordToken = undefined;
            user.ResetPasswordExpire = undefined;
            await user.save();
            return next(new ErrorResponse("Email Could Not Be Send!!!", 500));
        }

    } catch (error) {
        next(error)
    }
}

exports.resetPassword = async (req, res, next) => {
    // recreate reset token

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest("hex");


    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {
                //check expire date is greater than now
                //to check the validt token
                $gt: Date.now()
            }

        })
        if (!user) {
            //400 bad request
            return next(new ErrorResponse("Invalid Reset Token", 400))
        }

        user.password = req.body.password;
        //we already used it we dont want let use it again
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(201).json({
            success: true,
            data: "Password Reset Success"
        })

    } catch (error) {
        next(error);
    }

}



//this function have access to to user we created
//used above 
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token })
}