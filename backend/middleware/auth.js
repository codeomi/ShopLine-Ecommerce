const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/userModel");

//this wll see if the user is logged in  or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to see resources.", 201));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});

//to check wether user is admin or not
exports.authorizedRoles = (...roles) => {
  //...dot allows all the arguments to be placed in an array
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new ErrorHandler(
        `Role:${req.user.role} is not allowed to access this resource`,
        400
      ))
    }
    next();
  };
};
