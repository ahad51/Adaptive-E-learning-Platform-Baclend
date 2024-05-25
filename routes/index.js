require("dotenv").config();
const express = require("express");
const router = express.Router();
const authRoute = require("../routes/authRoutes");

router.use("/auth", authRoute);


module.exports = router;
