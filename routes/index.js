require("dotenv").config();
const express = require("express");
const router = express.Router();
const authRoute = require("../routes/authRoute");


router.use("/auth", authRoute);


module.exports = router;
