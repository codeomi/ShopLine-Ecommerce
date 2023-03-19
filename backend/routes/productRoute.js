const express = require("express");
const {
  getAllProdcts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getReviews,
  getAdminProdcts,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

//get products
router.route("/products").get(getAllProdcts);

//create products ---only admins
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);

//Get all products ----admin
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAdminProdcts);

//updat product
router
  .route("/admin/product/updateproduct/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct);

//delete product
router
  .route("/admin/product/deleteproduct/:id")
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

//get product details
router.route("/product/getproduct/:id").get(getProductDetails);

router.route("/product/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/product/reviews")
  .get(getReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
