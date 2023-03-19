const express = require("express")
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController")
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth")

const router = express.Router()

router.route("/order/new").post(isAuthenticatedUser, newOrder)

router
  .route("/order/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleOrder)

router.route("/orders/me").get(isAuthenticatedUser, myOrders)

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders)

  
router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateOrderStatus)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder)

module.exports = router
