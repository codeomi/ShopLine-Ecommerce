const express = require("express")
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateRoles,
  deleteUser,
} = require("../controllers/userController")
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth")

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").post(logout)
router.route("/me").get(isAuthenticatedUser, getUserserDetails)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)
router.route("/updateprofile").put(isAuthenticatedUser, updateProfile)
router
  .route("/admin/getallusers")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers)

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateRoles)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser)


module.exports = router
