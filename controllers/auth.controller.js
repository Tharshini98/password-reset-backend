const crypto = require('crypto');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const sendEmail = require('../utils/sendEmail');

exports.requestReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  await new Token({ userId: user._id, token }).save();

  const link = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`;
  await sendEmail(user.email, 'Password Reset', `Click to reset your password: ${link}`);

  res.json({ message: 'Reset link sent to your email.' });
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const resetToken = await Token.findOne({ userId: id, token });
  if (!resetToken) return res.status(400).json({ message: 'Invalid or expired token' });

  await User.findByIdAndUpdate(id, { password });
  await resetToken.deleteOne();

  res.json({ message: 'Password reset successful' });
};
