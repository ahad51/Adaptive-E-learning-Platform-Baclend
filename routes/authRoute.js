const express = require("express");
const router = express.Router();

const { signupUser,loginUser,forgotPassword,resetPassword } = require("../controller/auth");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/forget", forgotPassword);
router.post("/reset", resetPassword);

module.exports = router;
