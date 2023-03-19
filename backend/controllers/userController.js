const User = require("../models/userModel");
const catchAsyncErrorHandler = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require("bcryptjs");
const token = require("../utils/jwtToken");
const sendEmail = require("../utils/sendemail");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const statusRes = require("../utils/response");
const { findById } = require("../models/userModel");
const cloudinary = require("cloudinary");

//Register a User
exports.registerUser = catchAsyncErrorHandler(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avtar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  token(user, 201, res);
});

//Login user
exports.loginUser = catchAsyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter Credentials", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Please enter correct credentials", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Please enter correct credentials", 400));
  }

  // const isPasswordMatched = await bcrypt.compare(password, user.password)
  // console.log(isPasswordMatched)

  token(user, 200, res);
});

//logout
exports.logout = catchAsyncErrorHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Succesfully",
  });
});

//FORGOT PASSWORD
exports.forgotPassword = catchAsyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler(`User with ${req.body.email} does not exist`),
      404
    );
  }

  //get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false }); //resetpaswordtoken which is created but not save will be saved throught this

  //reset password url to be sent on email
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/${resetToken}`;
  const message = `Your password reset token is:- \n\n${resetPasswordUrl}\n\nIf you have not requested this email then please ignore.`;

  try {
    //email send is not working
    // await sendEmail({
    //   email: user.email,
    //   subject: `Ecommerce email recovery`,
    //   message,
    // })
    res.status(500).json({
      success: true,
      message: `Email sent successfully to ${user.email}.`,
      resetToken,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password
exports.resetPassword = catchAsyncErrorHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(resetPasswordToken);
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password toke is invalid or has been expired",
        500
      )
    );
  }
  //checking password validity when confirming
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match"), 50);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//getting user details
exports.getUserserDetails = catchAsyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ status: true, user });
});

//update passsword after logging in
exports.updatePassword = catchAsyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id).select("+password");
  const isMatched = await user.comparePassword(req.body.oldPassword);
  console.log(isMatched);
  if (!isMatched) {
    return next(new ErrorHandler("Old password does not match", 500));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Your new and confirm passwords does not match", 400)
    );
  }
  user.password = req.body.newPassword;
  await user.save();
  // res.status(200).json({success:true,message:"Password changed successfully"})
  statusRes("password update successfully", 200, res, true);
});

//update user profile
exports.updateProfile = catchAsyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imgaeId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const checkEmail = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (checkEmail) {
    return next(new ErrorHandler("User with this email already exist", 400));
  }

  const user = await User.findByIdAndUpdate(req.user.id);

  user.name = newUserData.name;
  user.email = newUserData.email;
  await user.save();

  // sendToken("Profile updated successfully", 200, res)
  statusRes("Profile updated successfully", 200, res, true);
});

//get all users (admin)  ----admin
exports.getAllUsers = catchAsyncErrorHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

//get a single user (admin)  ----admin
exports.getUser = catchAsyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`"User does not exist with ${req.params}`, 400)
    );
  }
  res.status(200).json({ success: true, user });
});

//admin upadating roles of user  ----admin
exports.updateRoles = catchAsyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findById(req.params.id);
  console.log(user);
  if (!user) {
    return next(
      new ErrorHandler(`"User does not exist with ${req.params}`, 400)
    );
  }
  user.role = newUserData.role;
  await user.save();
  res.status(200).json({ success: true, user });
});

//delete a user ----admin
exports.deleteUser = catchAsyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User with this ${req.params.id} does not exist`, 400)
    );
  }

  const imgaeId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  user.remove();
  statusRes("Profile deleted successfully", 200, res, true);
});
