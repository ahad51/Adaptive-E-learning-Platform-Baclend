const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router();

const {
  loginUser,
  signupUser,
  forgotPassword,
  resetPassword,

} = require("../controller/auth");
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/forget", forgotPassword);
router.post("/reset", verifyToken, resetPassword);

module.exports = router;
