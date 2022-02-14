const ErrorResponse = require('../utils/errorResponse');

//its err first
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    //in mongoose 11000 means duplicate key
    if (err.code === 11000) {
        const message = `Duplicate Field Value Entered...`;
        error = new ErrorResponse(message, 400)

    }

    if (err.name === "validationError") {
        const message = object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error"
    })

}

module.exports = errorHandler;

//import it in server.js