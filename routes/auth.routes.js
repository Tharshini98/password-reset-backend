
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
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.tokenExpiry = Date.now() + 1000 * 60 * 30; 
  await user.save();

  const resetLink = `https://shiny-croquembouche-618917.netlify.app/reset-password/${user._id}/${token}`;
  await sendResetEmail(user.email, resetLink);

  res.json({ message: 'Password reset link sent to email' });
});

module.exports = router;
