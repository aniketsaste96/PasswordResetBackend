class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message, statusCode);
        this.statusCode = statusCode

    }
}

module.exports = ErrorResponse;
//in middleware we are making special error handler