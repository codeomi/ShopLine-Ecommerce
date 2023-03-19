const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrorHandler = require("../middleware/catchAsyncError")

//create new order
exports.newOrder = catchAsyncErrorHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    padiAt,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  const order = await Order.create({
    shippingInfo,
    orderInfo,
    paymentInfo,
    padiAt,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    padiAt: Date.now(),
    user: req.user._id,
  })
  res.status(200).json({ success: true, order })
})

//Get asingle order ---ADMIN*********
exports.getSingleOrder = catchAsyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  )
  if (!order) {
    return next(new ErrorHandler("Order does not exist", 400))
  }

  res.status(200).json({ success: true, order })
})

//My orders
exports.myOrders = catchAsyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })

  res.status(200).json({ success: true, orders })
})

//Get all orders ---ADMIN*********
exports.getAllOrders = catchAsyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find()
  let totalPrice = 0
  orders.forEach((order) => {
    totalPrice += order.totalPrice
  })
  res.status(200).json({ success: true, totalPrice, orders })
})


//update order status ---admin *
exports.updateOrderStatus = catchAsyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return next(new ErrorHandler("Order does not exist", 400))
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order already delivered", 400))
  }


  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }

  order.orderStatus = req.body.status
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now()
  }
  await order.save({ validateBeforeSave: false })

  res.status(200).json({ success: true, order })
})

const updateStock = async function (productId, qty) {
  const product = await Product.findById(productId)
  product.stock -= qty
  await product.save({ validateBeforeSave: false })
}



//delete order ---admin
exports.deleteOrder = catchAsyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return next(new ErrorHandler("Order does not exist", 400))
  }

  await order.remove()
  res.status(200).json({ success: true })
})
