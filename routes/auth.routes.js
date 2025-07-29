const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const crypto = require('crypto');
const sendResetEmail = require('../utils/sendEmail');


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 1000 * 60 * 30; // 30 mins
    await user.save();

    const resetLink = `https://idyllic-florentine-9f1669.netlify.app/reset-password/${user._id}/${token}`;

    try {
      await sendResetEmail(user.email, resetLink);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (err) {
    console.error('Password reset error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/reset-password/:userId/:token', async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    const user = await User.findById(userId);

    if (
      !user ||
      user.resetToken !== token ||
      !user.tokenExpiry ||
      user.tokenExpiry < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetToken = null;
    user.tokenExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
