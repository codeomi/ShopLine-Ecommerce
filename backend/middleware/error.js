const ErrorHandler = require("../utils/errorHandler")

module.exports = (err, req, res, next) => {
  ;(err.statusCode = err.statusCode || 500),
    (err.message = err.message || "Internal Server Error")

  // in case wrong mongoId
  if (err.name === "CastError") {
    const message = `Resource not Found. Invalid: ${err.path}`
    err = new ErrorHandler(message, 400)
  }

  //incase duplicate key error ie user already exist
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(
      err.keyValue
    )} entered`
    err = new ErrorHandler(message, 400)
  }
  
  //wrong hwt token
  if (err.code === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again`
    err = new ErrorHandler(message, 400)
  }

  //json web token expired
  if (err.code === "TokenExpiredError") {
    const message = `Json web token has expired, try again`
    err = new ErrorHandler(message, 400)
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  })
}
