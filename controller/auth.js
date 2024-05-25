const User = require("../models/User");
const bcrypt = require("bcrypt");
const { SuccessResponse, ErrorResponse } = require("../utils/responsehelpers");
const {
  generateToken,
    generateResetToken,
    sendResetPasswordEmail
} = require("../utils/commonFunctions");
const loginValidation = require("../utils/validation");

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
      return SuccessResponse(res, 202, "User created successful");
    } else {
      return ErrorResponse(res, 400, "Failed to create user");
    }
  } catch (error) {
    ErrorResponse(res, 400, String(error), "users", String(error), "/");
    console.error("Error creating user:", error.message);
  }
}; 

const loginUser = async (req, res) => {
  try {
    const error = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Email doesn't Exist" });
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Password" });
    }
    console.log({ user });
    if (user.isVerified == false)
      return ErrorResponse(res, 403, "Please verify email to login");
    const access_token = await generateToken({ userId: user._id });
    SuccessResponse(res, 200, {
      message: "Login Successfully",
      access_token,
    });
  } catch (error) {
    ErrorResponse(res, 400, String(error), "users", String(error), "/");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User doesn't exist" });
    }

    const resetToken = generateResetToken();
    user.resetToken = resetToken;

    await user.save();

    const resetLink = `http://your-reset-password-url/${resetToken}`;
    await sendResetPasswordEmail(email, resetLink);

    res.status(200).json({
      success: true,
      message: "Reset link sent successfully",
      resetLink,
    });
  } catch (error) {
    console.error("Error sending reset link:", error);
    res
      .status(400)
      .json({ success: false, error: "Failed to send reset link" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = req.user;
    console.log({ user, newPassword });
    if (!newPassword) {
      return ErrorResponse(res, 400, "New password is required");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    console.log({ hashPassword });
    user.password = hashPassword;
    await user.save();
    SuccessResponse(res, 200, {
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    ErrorResponse(res, 400, "Failed to reset password");
  }
};



module.exports = {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword
};
