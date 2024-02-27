const User = require("../models/User");
const bcrypt = require("bcrypt");
const { SuccessResponse, ErrorResponse } = require("../utils/responsehelpers");
const {
  generateToken,
//   generateOTP,
//   sendOTP,
//   generateResetToken,
//   sendResetPasswordEmail,
} = require("../utils/commonFunctions");
const signupUser = async (req, res) => {
    try {
      const { password, email, username } = req.body;
  
      if (!password || !email || !username) {
        return ErrorResponse(res, 400, "Missing required fields");
      }
  
      const emailExist = await User.findOne({ email });
  
      if (emailExist) {
        return ErrorResponse(res, 303, "User already exists");
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
  
      const response = await User.create({
        email,
        username,
        password: hashPassword,
        isVerified: false,
      });
  
      if (response) {
        const access_token = await generateToken({ userId: response._id });
        return SuccessResponse(res, 202, "User created successful")
  
      } else {
        return ErrorResponse(res, 400, "Failed to create user");
      }
    } catch (error) {
      ErrorResponse(res, 400, String(error), "users", String(error), "/");
      console.error("Error creating user:", error.message);
    }
  };

  module.exports = {
    signupUser
  };
  