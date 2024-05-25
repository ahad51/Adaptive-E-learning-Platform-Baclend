const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_API_KEY) {
  console.error("SendGrid API Key is not set.");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateOTP = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
};

const generateToken = async (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '1d',
  });
};

const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

const sendOTP = async (email, otp) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email doesn't exist");
    }

    const msg = {
      to: user.email,
      from: 'taha.rasheed@zweidevs.com',
      subject: 'Your OTP',
      text: `Your OTP is: ${otp}`,
    };

    await sgMail.send(msg);

    user.otp = otp;
    await user.save();

    return otp;
  } catch (error) {
    console.error('Error generating or sending OTP:', error.message);
    throw error;
  }
};

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }
    const resetUrl = `http://your-reset-password-url/${resetToken}`;
    const msg = {
      to: email,
      from: 'taha.rasheed@zweidevs.com',
      subject: 'Reset Your Password',
      text: `To reset your password, click on the following link: ${resetUrl}`,
    };

    await sgMail.send(msg);
    return resetToken;
  } catch (error) {
    console.error('Error sending reset password email:', error.message);
    throw error;
  }
};

const userID = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'User not found' });
  }
};

const checkUserExistence = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const userExists = await User.exists({ _id: userId });

    if (!userExists) {
      res.status(404).json({ error: 'User does not exist' });
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  checkUserExistence,
  userID,
  generateToken,
  generateOTP,
  sendOTP,
  generateResetToken,
  sendResetPasswordEmail,
};
