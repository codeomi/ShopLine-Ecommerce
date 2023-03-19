const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
    proccessPayment,
    sendStripeApiKey,
} = require("../controllers/paymentControllers");

const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, proccessPayment);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);


module.exports = router;
