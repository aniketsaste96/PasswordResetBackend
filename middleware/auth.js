//protect routes
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse')

exports.protect = async (req, res, next) => {
    let token;

    // startsWith here > W is capital
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        //Bearer asvsa8vsva
        //split and take second part
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        return next(new ErrorResponse("You are Not authorized to access this route!!!", 401));
    }

    try {
        //DECODING THE TOKEN WE GOT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id)

        //if no user was found
        if (!user) {
            return next(new ErrorResponse("No user Found with this id", 404));
        }

        req.user = user;
        next();
        // response.end()
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
        //use this in prote route
    }
}

