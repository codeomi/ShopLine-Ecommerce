const catchAsynErrors = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.proccessPayment = catchAsynErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
      });
      if(!myPayment){
        return(next(new ErrorHandler("Payment Failed", 400)))
      }
  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

//sending API key in frontend
exports.sendStripeApiKey = catchAsynErrors(async (req, res, next) => {
  res
    .status(200)
    .json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
